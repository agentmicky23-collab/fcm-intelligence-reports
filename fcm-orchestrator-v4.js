#!/usr/bin/env node
/**
 * FCM Report Pipeline Orchestrator v4
 * Delegates to main agent via openclaw agent CLI
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dykudrjpcliuyahjuiag.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PIPELINE_SECRET = process.env.FCM_PIPELINE_SECRET || 'fcm-pipeline-2026-secure-key';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
const SITE_URL = process.env.SITE_URL || 'https://fcmreport.com';

const POLL_INTERVAL = 120000; // 2 minutes
const PIPELINE_TIMEOUT = 3600000; // 60 minutes

const ORDERS_DIR = path.join(process.env.HOME, '.openclaw/reports/orders');
const LOG_DIR = path.join(process.env.HOME, '.openclaw/logs');
const LOG_FILE = path.join(LOG_DIR, 'orchestrator.log');

[ORDERS_DIR, LOG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

if (!SUPABASE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let isShuttingDown = false;
let lastPollTime = null;
let currentlyProcessing = new Map();
const stats = {
  ordersProcessed: 0,
  ordersSucceeded: 0,
  ordersFailed: 0,
  startTime: new Date(),
};

// ── Agent Run Tracking ──
async function startAgentRun(orderId, agentId) {
  try {
    const { data, error } = await supabase
      .from('agent_runs')
      .insert({ order_id: orderId, agent_id: agentId, status: 'running', started_at: new Date().toISOString() })
      .select('id')
      .single();
    if (error) throw error;
    log('INFO', `[${orderId}] Agent run started: ${agentId} (run #${data.id})`);
    return data.id;
  } catch (err) {
    log('ERROR', `[${orderId}] Failed to log agent run start for ${agentId}: ${err.message}`);
    return null;
  }
}

async function completeAgentRun(runId, { status = 'success', errorMessage = null, tokensUsed = null, costUsd = null, outputSummary = null } = {}) {
  if (!runId) return;
  try {
    const completedAt = new Date().toISOString();
    const { data: run } = await supabase.from('agent_runs').select('started_at').eq('id', runId).single();
    const durationSeconds = run ? Math.round((new Date(completedAt) - new Date(run.started_at)) / 1000) : null;
    await supabase.from('agent_runs').update({
      status,
      completed_at: completedAt,
      duration_seconds: durationSeconds,
      tokens_used: tokensUsed,
      cost_usd: costUsd,
      error_message: errorMessage,
      output_summary: outputSummary,
    }).eq('id', runId);
    log('INFO', `Agent run #${runId} completed: ${status}${durationSeconds ? ` (${durationSeconds}s)` : ''}`);
  } catch (err) {
    log('ERROR', `Failed to complete agent run #${runId}: ${err.message}`);
  }
}

function log(level, msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level.padEnd(5)}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch (e) {}
}

async function sendDiscordAlert(message, level = 'error') {
  if (!DISCORD_WEBHOOK) return;
  const emoji = { error: '🚨', warn: '⚠️', info: 'ℹ️', success: '✅' }[level] || '📢';
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `${emoji} **Pipeline ${level.toUpperCase()}**\n${message}` })
    });
  } catch (err) {}
}

async function updateOrderStatus(orderId, status, extraData = {}) {
  try {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString(), ...extraData }).eq('id', orderId);
    log('INFO', `[${orderId}] Status: ${status}`);
  } catch (err) {
    log('ERROR', `[${orderId}] Failed to update status: ${err.message}`);
  }
}

async function delegateToMainAgent(orderId, order) {
  const orderDir = path.join(ORDERS_DIR, orderId);
  
  const message = `PIPELINE ORDER: ${orderId}

Process this FCM Intelligence Report order end-to-end:

**Order Details:**
- Order ID: ${orderId}
- Business: ${order.business_name || 'Unknown'}
- Location: ${order.business_postcode || 'Unknown'}, ${order.business_town || 'Unknown'}
- Listing URL: ${order.business_url || 'N/A'}
- Tier: ${order.report_tier}
- Customer: ${order.customer_email}
- Order directory: ${orderDir}

**Pipeline Steps:**
1. Spawn fcm-scout (research) - read order-info.json
2. Spawn fcm-sage (writing)
3. Spawn fcm-sentinel (validation, max 3 retries)
4. Write to Supabase: POST ${SITE_URL}/api/write-report with x-api-key: ${PIPELINE_SECRET}
5. Spawn fcm-oracle (QA, max 2 retries)
6. STOP and set status to 'awaiting_approval' - DO NOT auto-deliver

Update order status in Supabase at each step. After Oracle, PAUSE for human approval.`;

  // ── Track agent runs for each pipeline stage ──
  const agentStages = [
    { id: 'scout', statusMatch: 'research' },
    { id: 'sage', statusMatch: 'writing' },
    { id: 'sentinel', statusMatch: 'validating' },
    { id: 'oracle', statusMatch: 'qa' },
  ];
  const runIds = {};
  for (const stage of agentStages) {
    runIds[stage.id] = await startAgentRun(orderId, stage.id);
  }

  log('INFO', `[${orderId}] Sending delegation message to main agent...`);
  
  const { stdout, stderr } = await execAsync(
    `openclaw agent --agent main --message ${JSON.stringify(message)} --timeout 3600`,
    { maxBuffer: 10 * 1024 * 1024 }
  );

  if (stderr) {
    log('WARN', `[${orderId}] Agent stderr: ${stderr.substring(0, 500)}`);
  }

  return stdout;
}

async function processOrder(order) {
  const orderId = order.id;
  const startTime = Date.now();
  
  log('INFO', `[${orderId}] ═══════════════════════════════════════`);
  log('INFO', `[${orderId}] PIPELINE START`);
  log('INFO', `[${orderId}] Business: ${order.business_name}`);
  log('INFO', `[${orderId}] Tier: ${order.report_tier}`);
  log('INFO', `[${orderId}] Customer: ${order.customer_email}`);
  log('INFO', `[${orderId}] ═══════════════════════════════════════`);

  stats.ordersProcessed++;

  const timeoutHandle = setTimeout(async () => {
    log('ERROR', `[${orderId}] Pipeline timeout after ${PIPELINE_TIMEOUT / 1000 / 60} minutes`);
    await updateOrderStatus(orderId, 'error', { customer_message: 'Report generation timed out.' });
    await sendDiscordAlert(`🚨 Order ${orderId} TIMEOUT\nBusiness: ${order.business_name}`, 'error');
    currentlyProcessing.delete(orderId);
    stats.ordersFailed++;
  }, PIPELINE_TIMEOUT);

  currentlyProcessing.set(orderId, { startTime, timeoutHandle });

  try {
    const orderDir = path.join(ORDERS_DIR, orderId);
    if (!fs.existsSync(orderDir)) fs.mkdirSync(orderDir, { recursive: true });
    fs.writeFileSync(path.join(orderDir, 'order-info.json'), JSON.stringify(order, null, 2));

    const response = await delegateToMainAgent(orderId, order);
    
    log('INFO', `[${orderId}] Agent response (${response.length} chars)`);

    if (response.includes('SUCCESS') || response.includes('awaiting_approval') || response.includes('PAUSED') || response.includes('✅')) {
      clearTimeout(timeoutHandle);
      currentlyProcessing.delete(orderId);
      
      const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      log('INFO', `[${orderId}] PIPELINE PAUSED FOR APPROVAL (${duration} minutes)`);
      
      // Complete all agent runs as success
      for (const stage of agentStages) {
        await completeAgentRun(runIds[stage.id], {
          status: 'success',
          costUsd: 7.00,
          outputSummary: { pipelineDurationMin: duration },
        });
      }
      
      // Update status to awaiting_approval
      await updateOrderStatus(orderId, 'awaiting_approval');
      
      // Send review notification email to Mick
      try {
        const reviewUrl = `${SITE_URL}/report/${orderId}?admin=${PIPELINE_SECRET}`;
        const approveUrl = `${SITE_URL}/api/approve-report?key=${PIPELINE_SECRET}&orderId=${orderId}&action=approve`;
        
        log('INFO', `[${orderId}] Review: ${reviewUrl}`);
        log('INFO', `[${orderId}] Approve: ${approveUrl}`);
        
        // Try to send email via Resend if configured
        const RESEND_KEY = process.env.RESEND_API_KEY;
        if (RESEND_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'FCM Pipeline <reports@fcmreport.com>',
              to: 'mikesh@interimenterprises.co.uk',
              subject: `🔍 Report Ready for Review: ${orderId}`,
              html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                  <h2>Report ready for your review</h2>
                  <p><strong>Order:</strong> ${orderId}</p>
                  <p><strong>Business:</strong> ${order.business_name}</p>
                  <p><strong>Customer:</strong> ${order.customer_email}</p>
                  <p><strong>Tier:</strong> ${order.report_tier}</p>
                  <br/>
                  <p><a href="${reviewUrl}" style="background:#D4AF37;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Review Report →</a></p>
                  <br/>
                  <p>Once you're happy, approve it:</p>
                  <p><a href="${approveUrl}" style="background:#22c55e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">✅ Approve & Deliver</a></p>
                </div>
              `,
            }),
          });
          log('INFO', `[${orderId}] Review notification email sent`);
        } else {
          log('WARN', `[${orderId}] RESEND_API_KEY not configured - skipping email`);
        }
      } catch (emailErr) {
        log('ERROR', `[${orderId}] Failed to send review email: ${emailErr.message}`);
      }
      
      stats.ordersSucceeded++;
      await sendDiscordAlert(`⏸️ Order ${orderId} awaiting approval\nBusiness: ${order.business_name}\nReview: ${SITE_URL}/report/${orderId}?admin=${PIPELINE_SECRET}`, 'info');
    } else {
      throw new Error('Main agent reported failure or unclear status');
    }

  } catch (err) {
    clearTimeout(timeoutHandle);
    currentlyProcessing.delete(orderId);
    
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    log('ERROR', `[${orderId}] PIPELINE FAILED (${duration} minutes)`);
    log('ERROR', `[${orderId}] Error: ${err.message}`);
    
    // Mark all agent runs as failed
    for (const stage of agentStages) {
      if (runIds[stage.id]) {
        await completeAgentRun(runIds[stage.id], {
          status: 'failed',
          errorMessage: err.message,
        });
      }
    }
    
    stats.ordersFailed++;
    await updateOrderStatus(orderId, 'error', { customer_message: `Report generation failed: ${err.message}` });
    await sendDiscordAlert(`🚨 Order ${orderId} FAILED\nBusiness: ${order.business_name}\nError: ${err.message}`, 'error');
  }
}

async function pollForOrders() {
  if (isShuttingDown) return;
  lastPollTime = new Date();

  try {
    const { data: orders, error } = await supabase.from('orders').select('*').in('status', ['received', 'queued']).order('created_at', { ascending: true });
    if (error) {
      log('ERROR', `Poll failed: ${error.message}`);
      return;
    }
    if (!orders || orders.length === 0) {
      log('DEBUG', 'No new orders');
      return;
    }
    log('INFO', `Found ${orders.length} order(s) to process`);
    for (const order of orders) {
      if (isShuttingDown) break;
      if (currentlyProcessing.has(order.id)) continue;
      await processOrder(order);
    }
  } catch (err) {
    log('ERROR', `Poll exception: ${err.message}`);
  }
}

const app = express();
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  res.json({
    status: 'running',
    uptime: Math.floor(uptime),
    lastPoll: lastPollTime?.toISOString(),
    currentlyProcessing: Array.from(currentlyProcessing.keys()),
    stats: { ...stats, runtime: Math.floor((Date.now() - stats.startTime.getTime()) / 1000) },
  });
});
const healthServer = app.listen(3030, () => log('INFO', 'Health check on http://localhost:3030/health'));

process.on('SIGINT', async () => {
  log('INFO', 'Shutdown signal received');
  isShuttingDown = true;
  if (currentlyProcessing.size > 0) {
    log('INFO', `Waiting for ${currentlyProcessing.size} order(s)...`);
    const maxWait = 30 * 60 * 1000;
    const start = Date.now();
    while (currentlyProcessing.size > 0 && (Date.now() - start) < maxWait) {
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  healthServer.close();
  log('INFO', `Orchestrator stopped. Processed: ${stats.ordersProcessed}, Success: ${stats.ordersSucceeded}, Failed: ${stats.ordersFailed}`);
  process.exit(0);
});

async function main() {
  log('INFO', '════════════════════════════════════════════════════════════════');
  log('INFO', 'FCM Report Pipeline Orchestrator v4 Started');
  log('INFO', `Supabase: ${SUPABASE_URL}`);
  log('INFO', `Site: ${SITE_URL}`);
  log('INFO', `Poll interval: ${POLL_INTERVAL / 1000}s`);
  log('INFO', '════════════════════════════════════════════════════════════════');
  await pollForOrders();
  setInterval(pollForOrders, POLL_INTERVAL);
  log('INFO', 'Orchestrator running — press Ctrl+C to stop');
}

main().catch(err => {
  log('FATAL', `Startup failed: ${err.message}`);
  process.exit(1);
});

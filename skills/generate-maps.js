#!/usr/bin/env node
/**
 * generate-maps.js — FCM Scout Map Visualization Generator v2
 *
 * PRODUCTION QUALITY — Dual-layer maps:
 *   1. crime-heatmap.png   — dark styled map + color-coded crime pins + subject marker + legend
 *   2. footfall-map.png    — styled map + 500m catchment zone + categorized pins with labels
 *   3. competition-map.png — styled map + 1km/3km catchment rings + competitor pins + labels
 *
 * Usage:  node generate-maps.js <orderId>
 *         node generate-maps.js 2026-03-30-003
 *
 * Requires: GOOGLE_PLACES_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const REPORTS_BASE = path.join(process.env.HOME, '.openclaw/reports/orders');
const WORKSPACE = path.join(process.env.HOME, '.openclaw/workspace-fcm-scout');

function loadEnv() {
  // Try multiple .env locations
  const envPaths = [
    path.join(WORKSPACE, '.env'),
    path.join(process.env.HOME, '.openclaw/.env'),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
      }
    }
  }
}
loadEnv();

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = 'report-images';

if (!API_KEY) { console.error('ERROR: GOOGLE_PLACES_API_KEY not set'); process.exit(1); }
if (!SUPABASE_URL) { console.error('ERROR: SUPABASE_URL not set'); process.exit(1); }
if (!SUPABASE_KEY) { console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY not set'); process.exit(1); }

const STATIC_MAPS_BASE = 'https://maps.googleapis.com/maps/api/staticmap';
const POSTCODES_IO = 'https://api.postcodes.io/postcodes';
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

// ---------------------------------------------------------------------------
// Dark map style for crime heatmap (Google Static Maps styling)
// ---------------------------------------------------------------------------
const DARK_MAP_STYLE = [
  'feature:all|element:geometry|color:0x242f3e',
  'feature:all|element:labels.text.stroke|color:0x242f3e',
  'feature:all|element:labels.text.fill|color:0x746855',
  'feature:administrative.locality|element:labels.text.fill|color:0xd59563',
  'feature:poi|element:labels.text.fill|color:0xd59563',
  'feature:poi.park|element:geometry|color:0x263c3f',
  'feature:poi.park|element:labels.text.fill|color:0x6b9a76',
  'feature:road|element:geometry|color:0x38414e',
  'feature:road|element:geometry.stroke|color:0x212a37',
  'feature:road|element:labels.text.fill|color:0x9ca5b3',
  'feature:road.highway|element:geometry|color:0x746855',
  'feature:road.highway|element:geometry.stroke|color:0x1f2835',
  'feature:road.highway|element:labels.text.fill|color:0xf3d19c',
  'feature:transit|element:geometry|color:0x2f3948',
  'feature:transit.station|element:labels.text.fill|color:0xd59563',
  'feature:water|element:geometry|color:0x17263c',
  'feature:water|element:labels.text.fill|color:0x515c6d',
  'feature:water|element:labels.text.stroke|color:0x17263c',
];

// Light clean map style for footfall/competition
const LIGHT_MAP_STYLE = [
  'feature:poi|visibility:off',
  'feature:poi.school|visibility:on',
  'feature:poi.medical|visibility:on',
  'feature:transit.station|visibility:on',
  'feature:road|element:labels|visibility:on',
  'feature:all|element:geometry|saturation:-30',
  'feature:water|element:geometry|color:0xc9d9e8',
  'feature:landscape|element:geometry.fill|color:0xf0f0f0',
  'feature:road.highway|element:geometry|color:0xe0e0e0',
  'feature:road.arterial|element:geometry|color:0xebebeb',
];

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { timeout: 30000, headers: { 'User-Agent': 'FCMScout/2.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode} for ${url.substring(0, 100)}`)); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function fetchJSON(url) {
  return fetchBuffer(url).then(b => JSON.parse(b.toString('utf8')));
}

function httpRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, ...options }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const data = Buffer.concat(chunks).toString('utf8');
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---------------------------------------------------------------------------
// Geocoding
// ---------------------------------------------------------------------------
async function geocodePostcode(postcode) {
  const url = `${POSTCODES_IO}/${encodeURIComponent(postcode.replace(/\s/g, ''))}`;
  const data = await fetchJSON(url);
  if (data.status === 200 && data.result) {
    return { lat: data.result.latitude, lng: data.result.longitude };
  }
  throw new Error(`Could not geocode postcode: ${postcode}`);
}

async function geocodeAddress(address, name) {
  const queries = [address];
  if (name && name !== address) queries.push(name);
  if (name) {
    const parts = address.split(',').map(s => s.trim());
    if (parts.length > 1) queries.push(`${name}, ${parts[parts.length - 1]}`);
  }
  for (const q of queries) {
    const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&countrycodes=gb&limit=1`;
    try {
      const data = await fetchJSON(url);
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (e) { /* fall through */ }
    await sleep(1100); // Nominatim rate limit
  }
  const pcMatch = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
  if (pcMatch) {
    try { return await geocodePostcode(pcMatch[0]); } catch (e) { /* fall through */ }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Supabase Storage upload
// ---------------------------------------------------------------------------
async function uploadToSupabase(filePath, orderId, filename) {
  const storagePath = `${orderId}/${filename}`;
  const fileBuffer = fs.readFileSync(filePath);
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${storagePath}`;

  const res = await httpRequest(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Content-Type': 'image/png',
      'Content-Length': fileBuffer.length,
      'x-upsert': 'true',
    },
  }, fileBuffer);

  if (res.status !== 200 && res.status !== 201) {
    console.warn(`  ⚠️ Supabase upload returned ${res.status}: ${res.data}`);
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${storagePath}`;
  console.log(`  Uploaded: ${publicUrl}`);
  return publicUrl;
}

// ---------------------------------------------------------------------------
// Map URL builder — handles style params and URL length limits
// ---------------------------------------------------------------------------
const MAX_URL_LENGTH = 8100;

function buildStaticMapUrl(params) {
  const base = new URL(STATIC_MAPS_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (k !== 'markers' && k !== 'path' && k !== 'style') base.searchParams.set(k, v);
  }
  let url = base.toString();

  // Add style params
  if (params.style) {
    for (const s of params.style) {
      const part = `&style=${encodeURIComponent(s)}`;
      if (url.length + part.length > MAX_URL_LENGTH - 2000) break; // Reserve space for markers
      url += part;
    }
  }

  // Add path params (circles, zones)
  if (params.path) {
    for (const p of params.path) {
      const part = `&path=${encodeURIComponent(p)}`;
      if (url.length + part.length > MAX_URL_LENGTH - 1000) break;
      url += part;
    }
  }

  // Add markers
  if (params.markers) {
    for (const m of params.markers) {
      const part = `&markers=${encodeURIComponent(m)}`;
      if (url.length + part.length > MAX_URL_LENGTH) break;
      url += part;
    }
  }

  return url;
}

// ---------------------------------------------------------------------------
// Circle path for distance rings (high-quality smoother circles)
// ---------------------------------------------------------------------------
function generateCircle(lat, lng, radiusKm, points = 48) {
  const coords = [];
  const R = 6371;
  for (let i = 0; i <= points; i++) {
    const angle = (2 * Math.PI * i) / points;
    const dLat = (radiusKm / R) * (180 / Math.PI) * Math.cos(angle);
    const dLng = (radiusKm / R) * (180 / Math.PI) * Math.sin(angle) / Math.cos(lat * Math.PI / 180);
    coords.push(`${(lat + dLat).toFixed(5)},${(lng + dLng).toFixed(5)}`);
  }
  return coords.join('|');
}

// ---------------------------------------------------------------------------
// Custom icon URL builder for labeled pins
// Uses Google Charts API for custom markers with icons
// ---------------------------------------------------------------------------
function customMarkerIcon(color, label, size = 'small') {
  // Using Google's chart API for custom markers
  return `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${encodeURIComponent(label)}|${color.replace('#', '')}|FFFFFF`;
}

// ---------------------------------------------------------------------------
// 1. CRIME HEATMAP — Dual Layer: Dark styled map + individual color-coded pins
// ---------------------------------------------------------------------------
async function generateCrimeHeatmap(center, crimeIncidents, imagesDir) {
  console.log('Generating PRODUCTION crime heatmap (dual-layer)...');

  // Categorize ALL crime incidents
  const categories = { violent: [], asb: [], theft: [], other: [] };
  for (const c of crimeIncidents) {
    const cat = (c.category || '').toLowerCase();
    const loc = c.location;
    if (!loc || !loc.latitude || !loc.longitude) continue;
    const coord = `${loc.latitude},${loc.longitude}`;
    if (cat.includes('violent') || cat.includes('sexual') || cat.includes('weapon') || cat.includes('public-order')) {
      categories.violent.push(coord);
    } else if (cat.includes('anti-social')) {
      categories.asb.push(coord);
    } else if (cat.includes('burglary') || cat.includes('theft') || cat.includes('shoplifting') || cat.includes('robbery') || cat.includes('vehicle')) {
      categories.theft.push(coord);
    } else {
      categories.other.push(coord);
    }
  }

  console.log(`  Categories: violent=${categories.violent.length}, ASB=${categories.asb.length}, theft=${categories.theft.length}, other=${categories.other.length}`);

  // Smart sampling — prioritize variety while fitting URL limit
  // Use small dot-style markers for individual incidents
  const maxPer = { violent: 22, asb: 18, theft: 15, other: 8 };
  const sampled = {};
  for (const [key, coords] of Object.entries(categories)) {
    // Deduplicate first (police data often has same lat/lng)
    const unique = [...new Set(coords)];
    sampled[key] = unique.length <= maxPer[key]
      ? unique
      : unique.sort(() => Math.random() - 0.5).slice(0, maxPer[key]);
  }

  // Build markers — subject business first (gold/blue distinctive marker)
  const markers = [];

  // Subject business — gold star marker, prominent
  markers.push(`icon:https://maps.google.com/mapfiles/ms/icons/blue-dot.png|${center.lat},${center.lng}`);

  // Crime incident pins — small colored dots
  // Red = violent, Orange = ASB, Yellow = theft, Gray = other
  if (sampled.violent.length) {
    markers.push(`color:0xFF0000|size:small|${sampled.violent.join('|')}`);
  }
  if (sampled.asb.length) {
    markers.push(`color:0xFF8C00|size:small|${sampled.asb.join('|')}`);
  }
  if (sampled.theft.length) {
    markers.push(`color:0xFFD700|size:small|${sampled.theft.join('|')}`);
  }
  if (sampled.other.length) {
    markers.push(`color:0x808080|size:tiny|${sampled.other.join('|')}`);
  }

  const url = buildStaticMapUrl({
    center: `${center.lat},${center.lng}`,
    zoom: '15',
    size: '800x500',
    maptype: 'roadmap',
    scale: '2',
    key: API_KEY,
    style: DARK_MAP_STYLE,
    markers,
  });

  console.log(`  Map URL length: ${url.length} chars`);
  const buffer = await fetchBuffer(url);
  const outPath = path.join(imagesDir, 'crime-heatmap.png');
  fs.writeFileSync(outPath, buffer);
  console.log(`  ✅ Saved: crime-heatmap.png (${(buffer.length / 1024).toFixed(1)} KB)`);

  const totalPins = Object.values(sampled).reduce((s, a) => s + a.length, 0);
  return {
    file: 'crime-heatmap.png',
    path: outPath,
    size: buffer.length,
    count: crimeIncidents.length,
    caption: `Crime heatmap — ${crimeIncidents.length} incidents color-coded by type (red=violent, orange=ASB, yellow=theft, gray=other)`,
  };
}

// ---------------------------------------------------------------------------
// 2. COMPETITION MAP — Catchment zones + labeled competitor pins
// ---------------------------------------------------------------------------
async function generateCompetitionMap(center, poBranches, imagesDir) {
  console.log('Generating PRODUCTION competition map (catchment zones + pins)...');

  const competitors = [];
  for (const branch of poBranches) {
    if (branch.is_target || branch.distance_miles === 0) continue;
    const addr = branch.address || `${branch.name}, UK`;
    try {
      const loc = await geocodeAddress(addr, branch.name);
      if (loc) {
        competitors.push({ ...branch, lat: loc.lat, lng: loc.lng });
        console.log(`    ✓ ${branch.name} (${branch.distance_miles}mi) → ${loc.lat.toFixed(4)},${loc.lng.toFixed(4)}`);
      } else {
        console.log(`    ✗ ${branch.name} — no geocode result`);
      }
    } catch (e) {
      console.log(`    ✗ ${branch.name} — ${e.message}`);
    }
    await sleep(200);
  }

  // Build catchment zone paths — 1km green filled, 3km yellow ring
  const paths = [
    // 3km ring — yellow/amber, outer zone
    `color:0xFFA50080|weight:2|fillcolor:0xFFD70015|${generateCircle(center.lat, center.lng, 3, 48)}`,
    // 1km ring — green, inner zone
    `color:0x22C55E80|weight:2|fillcolor:0x22C55E20|${generateCircle(center.lat, center.lng, 1, 48)}`,
  ];

  // Build markers
  const markers = [];

  // Subject business — gold star, prominent
  markers.push(`color:0xFFD700|size:large|label:★|${center.lat},${center.lng}`);

  // Competitor pins — red, with distance as label
  for (let i = 0; i < competitors.length && i < 9; i++) {
    const c = competitors[i];
    const label = String(i + 1); // Number label
    markers.push(`color:0xDC2626|size:mid|label:${label}|${c.lat},${c.lng}`);
  }

  // Determine zoom level based on furthest competitor
  const maxDist = Math.max(...competitors.map(c => c.distance_miles || 0), 3);
  let zoom = '12';
  if (maxDist > 8) zoom = '10';
  else if (maxDist > 5) zoom = '11';
  else if (maxDist > 3) zoom = '12';
  else zoom = '13';

  const url = buildStaticMapUrl({
    center: `${center.lat},${center.lng}`,
    zoom,
    size: '800x500',
    maptype: 'roadmap',
    scale: '2',
    key: API_KEY,
    style: LIGHT_MAP_STYLE,
    markers,
    path: paths,
  });

  console.log(`  Map URL length: ${url.length} chars`);
  const buffer = await fetchBuffer(url);
  const outPath = path.join(imagesDir, 'competition-map.png');
  fs.writeFileSync(outPath, buffer);
  console.log(`  ✅ Saved: competition-map.png (${(buffer.length / 1024).toFixed(1)} KB)`);

  return {
    file: 'competition-map.png',
    path: outPath,
    size: buffer.length,
    count: competitors.length,
    competitors, // Return for legend/caption building
    caption: `Competition map — ${competitors.length} Post Office branches with catchment zones (1km green, 3km amber). Gold=subject, Red=competitors.`,
  };
}

// ---------------------------------------------------------------------------
// 3. FOOTFALL MAP — Catchment zone + categorized generator pins with labels
// ---------------------------------------------------------------------------
async function generateFootfallMap(center, researchPack, imagesDir) {
  console.log('Generating PRODUCTION footfall map (catchment zone + category pins)...');

  const raw = researchPack.raw_data;
  const generators = { education: [], healthcare: [], transport: [], retail: [] };

  // Schools — blue markers
  if (Array.isArray(raw.schools)) {
    for (const s of raw.schools.slice(0, 8)) {
      generators.education.push({ name: s.name, address: s.address, type: s.type || 'school' });
    }
  }

  // Healthcare — red markers
  if (Array.isArray(raw.healthcare)) {
    // Deduplicate by name similarity
    const seen = new Set();
    for (const h of raw.healthcare) {
      const key = h.name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 15);
      if (!seen.has(key)) {
        seen.add(key);
        generators.healthcare.push({ name: h.name, address: h.address, type: h.type || 'healthcare' });
      }
    }
  }

  // Transport — purple markers
  if (raw.transport) {
    if (raw.transport.bus_station) {
      generators.transport.push({
        name: 'Bus Station',
        address: `Bus Station, ${researchPack.metadata.town}, ${researchPack.metadata.postcode}`,
        type: 'bus'
      });
    }
    if (Array.isArray(raw.transport.nearest_rail)) {
      for (const r of raw.transport.nearest_rail) {
        generators.transport.push({
          name: r.name,
          address: `${r.name}, UK`,
          type: 'rail'
        });
      }
    }
  }

  // Retail anchors — orange markers
  if (Array.isArray(raw.google_business)) {
    const targetPlaceId = raw.google_business[0]?.place_id;
    for (const g of raw.google_business) {
      if (g.place_id !== targetPlaceId && g.name) {
        generators.retail.push({ name: g.name, address: g.address || `${g.name}, ${researchPack.metadata.town}`, type: 'retail' });
      }
    }
  }

  // Check for Co-Op, Spar, etc in listing text
  const allText = JSON.stringify(raw).toLowerCase();
  const retailNames = ['co-op', 'cooperative', 'spar', 'tesco', 'asda', 'sainsbury', 'aldi', 'lidl', 'morrisons'];
  for (const name of retailNames) {
    if (allText.includes(name) && !generators.retail.some(r => r.name.toLowerCase().includes(name))) {
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      generators.retail.push({
        name: `${displayName} Supermarket`,
        address: `${displayName}, ${researchPack.metadata.town}, ${researchPack.metadata.postcode}`,
        type: 'supermarket'
      });
    }
  }

  console.log(`  Generators: education=${generators.education.length}, healthcare=${generators.healthcare.length}, transport=${generators.transport.length}, retail=${generators.retail.length}`);

  // Geocode all generators
  const geocoded = { education: [], healthcare: [], transport: [], retail: [] };
  for (const [category, items] of Object.entries(generators)) {
    for (const gen of items) {
      if (!gen.address) continue;
      try {
        const loc = await geocodeAddress(gen.address, gen.name);
        if (loc) {
          geocoded[category].push({ ...gen, lat: loc.lat, lng: loc.lng });
          console.log(`    ✓ [${category}] ${gen.name} → ${loc.lat.toFixed(4)},${loc.lng.toFixed(4)}`);
        } else {
          console.log(`    ✗ [${category}] ${gen.name} — no result`);
        }
      } catch (e) {
        console.log(`    ✗ [${category}] ${gen.name} — ${e.message}`);
      }
      await sleep(100);
    }
  }

  // Build catchment zone — 500m circle
  const paths = [
    `color:0x3B82F640|weight:2|fillcolor:0x3B82F615|${generateCircle(center.lat, center.lng, 0.5, 48)}`,
  ];

  // Build markers by category with distinct colors and labels
  const markers = [];

  // Subject business — gold, prominent
  markers.push(`color:0xFFD700|size:large|label:P|${center.lat},${center.lng}`);

  // Education — blue, label E
  if (geocoded.education.length) {
    markers.push(`color:0x2563EB|size:mid|label:E|${geocoded.education.map(g => `${g.lat},${g.lng}`).join('|')}`);
  }

  // Healthcare — red, label H
  if (geocoded.healthcare.length) {
    markers.push(`color:0xDC2626|size:mid|label:H|${geocoded.healthcare.map(g => `${g.lat},${g.lng}`).join('|')}`);
  }

  // Transport — purple, label T
  if (geocoded.transport.length) {
    markers.push(`color:0x7C3AED|size:mid|label:T|${geocoded.transport.map(g => `${g.lat},${g.lng}`).join('|')}`);
  }

  // Retail — orange, label R
  if (geocoded.retail.length) {
    markers.push(`color:0xEA580C|size:mid|label:R|${geocoded.retail.map(g => `${g.lat},${g.lng}`).join('|')}`);
  }

  // Auto-zoom: if transport pins are far (rail stations), zoom out
  const allPins = [...geocoded.education, ...geocoded.healthcare, ...geocoded.transport, ...geocoded.retail];
  let maxDistKm = 0;
  for (const p of allPins) {
    const dLat = (p.lat - center.lat) * 111.32;
    const dLng = (p.lng - center.lng) * 111.32 * Math.cos(center.lat * Math.PI / 180);
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist > maxDistKm) maxDistKm = dist;
  }
  let zoom = '14';
  if (maxDistKm > 10) zoom = '11';
  else if (maxDistKm > 5) zoom = '12';
  else if (maxDistKm > 2) zoom = '13';

  const url = buildStaticMapUrl({
    center: `${center.lat},${center.lng}`,
    zoom,
    size: '800x500',
    maptype: 'roadmap',
    scale: '2',
    key: API_KEY,
    style: LIGHT_MAP_STYLE,
    markers,
    path: paths,
  });

  console.log(`  Map URL length: ${url.length} chars`);
  const buffer = await fetchBuffer(url);
  const outPath = path.join(imagesDir, 'footfall-map.png');
  fs.writeFileSync(outPath, buffer);
  console.log(`  ✅ Saved: footfall-map.png (${(buffer.length / 1024).toFixed(1)} KB)`);

  const totalGeo = Object.values(geocoded).reduce((s, a) => s + a.length, 0);
  return {
    file: 'footfall-map.png',
    path: outPath,
    size: buffer.length,
    count: totalGeo,
    geocoded,
    caption: `Footfall generator map — ${totalGeo} nearby amenities (blue=schools, red=healthcare, purple=transport, orange=retail). 500m catchment zone shown.`,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const orderId = process.argv[2];
  if (!orderId) { console.error('Usage: node generate-maps.js <orderId>'); process.exit(1); }

  const orderDir = path.join(REPORTS_BASE, orderId);
  const rpPath = path.join(orderDir, 'research-pack.json');
  if (!fs.existsSync(rpPath)) { console.error(`ERROR: ${rpPath} not found`); process.exit(1); }

  const rp = JSON.parse(fs.readFileSync(rpPath, 'utf8'));
  const postcode = rp.metadata.postcode;
  console.log(`\n📍 Order: ${orderId} | ${rp.metadata.business_name} | ${postcode}`);
  console.log(`${'═'.repeat(60)}\n`);

  const imagesDir = path.join(orderDir, 'images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  // Get center coordinates
  let center;
  const pcData = rp.raw_data?.postcode_data;
  if (pcData && pcData.latitude && pcData.longitude) {
    center = { lat: pcData.latitude, lng: pcData.longitude };
    console.log(`📍 Center (from postcode_data): ${center.lat}, ${center.lng}`);
  } else {
    center = await geocodePostcode(postcode);
    console.log(`📍 Center (geocoded): ${center.lat}, ${center.lng}`);
  }

  // --- 1. Crime Heatmap ---
  console.log('\n' + '━'.repeat(50));
  console.log('🔴 CRIME HEATMAP (dual-layer: dark map + color pins)');
  console.log('━'.repeat(50));
  const crimeIncidents = rp.raw_data.crime?.incidents || [];
  console.log(`  Using ${crimeIncidents.length} incidents from research-pack`);
  const crimeResult = await generateCrimeHeatmap(center, crimeIncidents, imagesDir);

  // --- 2. Footfall Map ---
  console.log('\n' + '━'.repeat(50));
  console.log('🟢 FOOTFALL MAP (catchment zone + category pins)');
  console.log('━'.repeat(50));
  const footfallResult = await generateFootfallMap(center, rp, imagesDir);

  // --- 3. Competition Map ---
  console.log('\n' + '━'.repeat(50));
  console.log('🔵 COMPETITION MAP (catchment rings + competitor pins)');
  console.log('━'.repeat(50));
  const poBranches = rp.raw_data.po_branches || [];
  const compResult = await generateCompetitionMap(center, poBranches, imagesDir);

  // --- Upload to Supabase ---
  console.log('\n' + '━'.repeat(50));
  console.log('☁️  UPLOADING TO SUPABASE');
  console.log('━'.repeat(50));
  const crimeUrl = await uploadToSupabase(crimeResult.path, orderId, 'crime-heatmap.png');
  const footfallUrl = await uploadToSupabase(footfallResult.path, orderId, 'footfall-map.png');
  const compUrl = await uploadToSupabase(compResult.path, orderId, 'competition-map.png');

  // --- Update research-pack.json ---
  console.log('\n📝 Updating research-pack.json...');

  if (!rp.images) rp.images = {};

  rp.images.crime_heatmap = {
    local_path: 'images/crime-heatmap.png',
    public_url: crimeUrl,
    caption: crimeResult.caption,
    source: 'Generated from data.police.uk via Google Maps Static API (dark styled)',
  };

  rp.images.footfall_map = {
    local_path: 'images/footfall-map.png',
    public_url: footfallUrl,
    caption: footfallResult.caption,
    source: 'Generated from research data via Google Maps Static API',
  };

  rp.images.competition_map = {
    local_path: 'images/competition-map.png',
    public_url: compUrl,
    caption: compResult.caption,
    source: 'Generated from postoffice.co.uk data via Google Maps Static API',
    legend: compResult.competitors.map((c, i) => `${i + 1}: ${c.name} (${c.distance_miles}mi)`),
  };

  // Update maps array for backward compat
  if (!rp.images.maps) rp.images.maps = [];
  rp.images.maps = rp.images.maps.filter(m => !['crime_heatmap', 'footfall', 'competition'].includes(m.map_type));
  rp.images.maps.push(
    { local_path: 'images/crime-heatmap.png', map_type: 'crime_heatmap', caption: crimeResult.caption, source: rp.images.crime_heatmap.source, public_url: crimeUrl },
    { local_path: 'images/footfall-map.png', map_type: 'footfall', caption: footfallResult.caption, source: rp.images.footfall_map.source, public_url: footfallUrl },
    { local_path: 'images/competition-map.png', map_type: 'competition', caption: compResult.caption, source: rp.images.competition_map.source, public_url: compUrl },
  );

  fs.writeFileSync(rpPath, JSON.stringify(rp, null, 2));
  console.log('✅ research-pack.json updated with map URLs');

  // --- Summary ---
  console.log('\n' + '═'.repeat(60));
  console.log('📊 MAP GENERATION COMPLETE');
  console.log('═'.repeat(60));
  console.log(`  🔴 Crime heatmap:    ${crimeUrl}`);
  console.log(`  🟢 Footfall map:     ${footfallUrl}`);
  console.log(`  🔵 Competition map:  ${compUrl}`);
  console.log(`\n  📁 Local: ${imagesDir}/`);
  console.log(`  📊 Stats: ${crimeResult.count} crimes, ${footfallResult.count} generators, ${compResult.count} competitors`);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });

module.exports = { generateCrimeHeatmap, generateFootfallMap, generateCompetitionMap };

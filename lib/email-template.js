// lib/email-template.js
// Shared FCM Intelligence email template wrapper
// All emails use this for consistent branding

export function fcmEmailWrapper({ preheader, content, footerExtra }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>FCM Intelligence</title>
  <!--[if mso]>
  <style>body{font-family:Arial,sans-serif!important;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ''}
  
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        
        <!-- Email container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Gold top line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td>
          </tr>
          
          <!-- Header -->
          <tr>
            <td style="background-color:#0B1D3A;padding:28px 32px;text-align:center;">
              <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;color:#c9a227;text-transform:uppercase;letter-spacing:3px;">FCM Intelligence</div>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="background-color:#161b22;padding:0;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#0B1D3A;padding:24px 32px;border-top:1px solid rgba(201,162,39,0.15);">
              ${footerExtra || ''}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
                    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#484f58;line-height:1.5;margin:0;">
                      Firstclass Managerial Ltd trading as FCM Intelligence<br>
                      <a href="https://fcmreport.com" style="color:#c9a227;text-decoration:none;">fcmreport.com</a> &nbsp;|&nbsp;
                      <a href="https://fcmreport.com/terms" style="color:#484f58;text-decoration:none;">Terms</a> &nbsp;|&nbsp;
                      <a href="https://fcmreport.com/privacy" style="color:#484f58;text-decoration:none;">Privacy</a> &nbsp;|&nbsp;
                      <a href="https://fcmreport.com/refunds" style="color:#484f58;text-decoration:none;">Refunds</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Gold bottom line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Reusable components
export function goldButton(text, href) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:8px;padding:14px 32px;">
          <a href="${href}" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#0B1D3A;text-decoration:none;display:inline-block;">${text}</a>
        </td>
      </tr>
    </table>`;
}

export function sectionDivider() {
  return `<tr><td style="padding:0 32px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>`;
}

export function infoRow(label, value) {
  return `
    <tr>
      <td style="padding:6px 0;">
        <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#8b949e;">${label}</span>
      </td>
      <td style="padding:6px 0;text-align:right;">
        <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#e6edf3;font-weight:600;">${value}</span>
      </td>
    </tr>`;
}

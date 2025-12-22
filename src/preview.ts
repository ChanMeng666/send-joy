import * as http from 'http';
import * as React from 'react';
import { render } from '@react-email/render';
import { ChristmasEmail } from './templates/christmas-email.js';
import { config } from './config.js';

const PORT = 3003;

async function startPreviewServer() {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/preview') {
      try {
        // Render the email template
        const emailHtml = await render(
          React.createElement(ChristmasEmail, {
            recipientName: 'Friend',
            personalImageUrl: config.personalImageUrl,
          })
        );

        // Add some preview styling
        const previewHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Christmas Email Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #1a1a2e;
      min-height: 100vh;
    }
    .preview-header {
      max-width: 640px;
      margin: 0 auto 20px;
      padding: 15px 20px;
      background: #16213e;
      border-radius: 8px;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .preview-header h1 {
      margin: 0 0 10px;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .preview-header p {
      margin: 0;
      font-size: 14px;
      color: #a0a0a0;
    }
    .preview-controls {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    .preview-controls a {
      padding: 8px 16px;
      background: #DC2626;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
    }
    .preview-controls a:hover {
      background: #B91C1C;
    }
    .email-container {
      max-width: 640px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div class="preview-header">
    <h1>🎄 Christmas Email Preview</h1>
    <p>This is how your email will look to recipients.</p>
    <p>Sender: ${config.sender.name} &lt;${config.sender.email}&gt;</p>
    <div class="preview-controls">
      <a href="/raw">View Raw HTML</a>
      <a href="javascript:location.reload()">Refresh</a>
    </div>
  </div>
  <div class="email-container">
    ${emailHtml}
  </div>
</body>
</html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(previewHtml);
      } catch (error) {
        console.error('Error rendering email:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error rendering email template');
      }
    } else if (req.url === '/raw') {
      try {
        const emailHtml = await render(
          React.createElement(ChristmasEmail, {
            recipientName: 'Friend',
            personalImageUrl: config.personalImageUrl,
          })
        );

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(emailHtml);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error rendering email');
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log(`
🎄 Christmas Email Preview Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Preview URL: http://localhost:${PORT}
Raw HTML:    http://localhost:${PORT}/raw

Press Ctrl+C to stop the server.
    `);

    // Try to open browser automatically
    const url = `http://localhost:${PORT}`;
    const start =
      process.platform === 'win32' ? 'start' :
      process.platform === 'darwin' ? 'open' : 'xdg-open';

    import('child_process').then(({ exec }) => {
      exec(`${start} ${url}`);
    }).catch(() => {
      // Ignore if browser can't be opened
    });
  });
}

startPreviewServer().catch(console.error);

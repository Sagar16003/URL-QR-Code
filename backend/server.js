const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

// In-memory storage for token tracking
// Map<token, { targetUrl: string, active: boolean }>
const tokenStore = new Map();

const os = require('os');

// Helper to get local IP address
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (localhost) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const HOST_IP = getLocalIp();

// Generate a one-time link
app.post('/api/generate', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const token = uuidv4();
    // Use the actual LAN IP so devices on the network can access it
    const trackingUrl = `http://${HOST_IP}:${PORT}/s/${token}`;

    tokenStore.set(token, {
        targetUrl: url,
        active: true
    });

    console.log(`Generated token ${token} for ${url}`);
    res.json({ trackingUrl });
});

// Handle scan
app.get('/s/:token', (req, res) => {
    const { token } = req.params;
    const data = tokenStore.get(token);

    if (!data) {
        return res.status(404).send('<h1>Invalid Link</h1><p>This link does not exist.</p>');
    }

    if (!data.active) {
        return res.status(410).send('<h1>Link Expired</h1><p>This QR code has already been scanned.</p>');
    }

    // Mark as inactive (one-time use)
    data.active = false;
    tokenStore.set(token, data);

    console.log(`Token ${token} used. Redirecting to ${data.targetUrl}`);
    res.redirect(data.targetUrl);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://${HOST_IP}:${PORT}`);
});

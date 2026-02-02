const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

// In-memory storage for token tracking
// Map<token, { targetUrl: string, active: boolean }>
const tokenStore = new Map();

const os = require('os');

// Generate a one-time link
app.post('/api/generate', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const token = uuidv4();

    // Construct the tracking URL dynamically based on the incoming request
    // This ensures it works on localhost, Render, or any other host
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const trackingUrl = `${protocol}://${host}/s/${token}`;

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
    console.log(`Server running on port ${PORT}`);
});

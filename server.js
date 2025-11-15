const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.webp': 'image/webp'
};

const rateLimitMap = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 60000;
    const maxRequests = 5;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }

    const requests = rateLimitMap.get(ip).filter(time => now - time < windowMs);
    
    if (requests.length >= maxRequests) {
        return false;
    }
    
    requests.push(now);
    rateLimitMap.set(ip, requests);
    return true;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '/': '&#x2F;'
    };
    return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

function smartTruncate(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    
    let truncated = text.substring(0, maxLength);
    
    const lastAmpersand = truncated.lastIndexOf('&');
    if (lastAmpersand > maxLength - 10) {
        const entityEnd = text.indexOf(';', lastAmpersand);
        if (entityEnd > maxLength || entityEnd === -1) {
            truncated = truncated.substring(0, lastAmpersand);
        }
    }
    
    return truncated;
}

function sanitizeAndValidate(input, maxLength) {
    if (typeof input !== 'string') {
        return '';
    }
    const trimmed = input.trim();
    const escaped = escapeHtml(trimmed);
    return smartTruncate(escaped, maxLength);
}

function isValidEmail(email) {
    const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
    return emailRegex.test(email.toLowerCase()) && email.length >= 3 && email.length <= 254;
}

function handleContactForm(req, res) {
    if (!DISCORD_WEBHOOK_URL) {
        console.error('DISCORD_WEBHOOK_URL environment variable is not set');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server configuration error. Please contact the administrator.' }));
        return;
    }

    const clientIp = req.socket.remoteAddress;
    
    if (!checkRateLimit(clientIp)) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Too many requests. Please try again later.' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
        if (body.length > 10000) {
            res.writeHead(413, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Request too large' }));
            req.connection.destroy();
        }
    });

    req.on('end', () => {
        try {
            const formData = JSON.parse(body);
            
            if (!formData.name || !formData.email || !formData.message) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
                return;
            }

            const rawName = (formData.name || '').trim();
            const rawEmail = (formData.email || '').trim();
            const rawMessage = (formData.message || '').trim();

            if (!rawName || rawName.length < 2) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Name must be at least 2 characters' }));
                return;
            }

            if (!isValidEmail(rawEmail)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid email address' }));
                return;
            }

            if (!rawMessage || rawMessage.length < 10) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Message must be at least 10 characters' }));
                return;
            }

            const sanitizedName = sanitizeAndValidate(rawName, 256);
            const sanitizedEmail = sanitizeAndValidate(rawEmail, 256);
            const sanitizedMessage = sanitizeAndValidate(rawMessage, 1024);

            const embed = {
                title: '📬 New Contact Form Submission',
                color: 6450047,
                fields: [
                    {
                        name: '👤 Name',
                        value: sanitizedName,
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: sanitizedEmail,
                        inline: true
                    },
                    {
                        name: '💬 Message',
                        value: sanitizedMessage
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Portfolio Contact Form'
                }
            };

            const webhookData = JSON.stringify({
                username: 'Portfolio Bot',
                embeds: [embed]
            });

            const webhookUrl = new URL(DISCORD_WEBHOOK_URL);
            const options = {
                hostname: webhookUrl.hostname,
                path: webhookUrl.pathname + webhookUrl.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(webhookData)
                }
            };

            const webhookReq = https.request(options, (webhookRes) => {
                if (webhookRes.statusCode === 204 || webhookRes.statusCode === 200) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Failed to send message' }));
                }
            });

            webhookReq.on('error', () => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server error' }));
            });

            webhookReq.write(webhookData);
            webhookReq.end();

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    if (req.method === 'POST' && parsedUrl.pathname === '/api/contact') {
        handleContactForm(req, res);
        return;
    }

    let filePath = '.' + parsedUrl.pathname;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════════════');
    console.log('✨  Modern Portfolio Website Server');
    console.log('═══════════════════════════════════════════════');
    console.log(`🚀  Server running at: http://0.0.0.0:${PORT}/`);
    console.log(`📁  Serving files from: ${__dirname}`);
    console.log(`🎨  Advanced UI/UX with smooth animations`);
    console.log(`📱  Fully responsive design`);
    console.log('═══════════════════════════════════════════════');
});

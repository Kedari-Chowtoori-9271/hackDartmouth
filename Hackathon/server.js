import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import url from 'url';

const API_TOKEN = 'xi278sPuBQOIqVLrQ6IHBMA3BNHUBiMWXGwqvzzK';
const KINTONE_DOMAIN = 'yogahacktest.kintone.com';

const app = express();
const PORT = process.env.PORT || 3000;
const APP_ID = '3';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors);// Proxy endpoint
app.get('/api/records', async (req, res) => {
    const url = `https://${KINTONE_DOMAIN}/k/v1/records.json?app=${APP_ID}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Cybozu-API-Token': API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch records from Kintone');
        }

        const data = await response.json();
        console.log(data);
        res.send(data.records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


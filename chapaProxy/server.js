// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Allows your HTML page to call localhost
app.use(express.json());

// 🔑 REPLACE WITH YOUR CHAPA *SECRET* TEST KEY (from Dashboard → Test Keys)
const CHAPA_SECRET_KEY = "CHASECK_TEST-kLIdYFsafapMuWopGdxiBlcPnc0KZdwO";

app.post('/chapa/init', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
        }
      }
    );
    
    // ✅ Return ONLY the checkout_url (safe for frontend)
    res.json({ checkout_url: response.data.data.checkout_url });
  } catch (error) {
    console.error("Chapa error:", error.response?.data || error.message);
    res.status(500).json({ error: "Checkout failed" });
  }
});

app.listen(3000, () => {
  console.log('✅ Proxy running at http://localhost:3000');
  console.log('→ Open your HTML file in browser');
});
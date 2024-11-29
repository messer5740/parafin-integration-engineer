const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session Management
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// Base URLs
const PARAFIN_BASE_URL = "https://api.parafin.com/v1";
const PARAFIN_SANDBOX_URL = `${PARAFIN_BASE_URL}/sandbox`;

// Function to configure Parafin API Auth
const getParafinAuthConfig = () => ({
  auth: {
    username: process.env.PARAFIN_CLIENT_ID,
    password: process.env.PARAFIN_CLIENT_SECRET,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

// Routes

/**
 * Fetch Parafin Token
 */
app.get("/parafin/token/:id/:isDev?", async (req, res) => {
  const personId = req.params.id;
  const isDev = req.params.isDev === "true";
  const url = `${isDev ? `${PARAFIN_SANDBOX_URL}/auth/redeem_token` : `${PARAFIN_BASE_URL}/auth/redeem_token`}`;

  try {
    const result = await axios.post(url, { person_id: personId }, getParafinAuthConfig());
    res.send({ parafinToken: result.data.bearer_token });
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send({
      errorCode: error.response?.status || 500,
      message: error.response?.data || "Failed to fetch token",
    });
  }
});

/**
 * Fund Capital Product
 */
app.post("/fund-capital-product", async (req, res) => {
  const url = `${PARAFIN_SANDBOX_URL}/fund_capital_product`;
  const data = { business_id: req.body.business_id };

  try {
    const result = await axios.post(url, data, getParafinAuthConfig());
    res.status(200).send(result.data);
  } catch (error) {
    console.error("Error funding capital product:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send({
      error: error.response?.data || "Failed to fund capital product",
    });
  }
});

/**
 * Send Sandbox Offer
 */
app.post("/parafin/send-sandbox-offer", async (req, res) => {
  const url = `${PARAFIN_SANDBOX_URL}/capital_product_offers`;

  const data = {
    business_parafin_id: "business_58db8134-0f6b-4bd6-9892-0bc098ea34f0", // Hardcoded Business ID
    product_type: req.body.product_type || "flex_loan",
    fee_discount_factor: req.body.fee_discount_factor || 0,
    fee_discount_offer_amount_multiplier: req.body.fee_discount_offer_amount_multiplier || 0,
    max_offer_amount: req.body.max_offer_amount || 50000,
  };

  try {
    const result = await axios.post(url, data, getParafinAuthConfig());
    res.status(200).send(result.data);
  } catch (error) {
    console.error("Error sending sandbox offer:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send({
      error: error.response?.data || "Failed to send sandbox offer",
    });
  }
});

/**
 * Proxy Segment API Call
 * Proxies Segment API requests to avoid client-side blocking
 */
app.post("/api/segment", async (req, res) => {
  const url = "https://api.segment.io/v1/t";
  const payload = req.body;

  try {
    const response = await axios.post(url, payload, {
      auth: {
        username: process.env.SEGMENT_WRITE_KEY, // Replace with your Segment Write Key
        password: "", // No password needed
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error forwarding Segment request:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send({
      error: error.response?.data || "Failed to forward Segment request",
    });
  }
});

// Starting the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

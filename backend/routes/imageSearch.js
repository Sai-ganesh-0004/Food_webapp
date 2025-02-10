const express = require("express");
const multer = require("multer");
const axios = require("axios");
const client = require("../db");
const foodToCuisine = require("../utils/foodToCuisine"); // Import the mapping
const router = express.Router();

// Configure Multer for in-memory image storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Image Search Route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Ensure API Key is available
    const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;
    if (!GOOGLE_VISION_API_KEY) {
      console.error("Google Vision API key is missing.");
      return res
        .status(500)
        .json({ error: "Internal Server Error: API key missing" });
    }

    // Step 1: Call Google Vision API for image analysis
    const visionAPIResponse = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: req.file.buffer.toString("base64") },
            features: [{ type: "LABEL_DETECTION", maxResults: 10 }],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract detected food labels
    const detectedFoodItems =
      visionAPIResponse.data.responses[0]?.labelAnnotations?.map((label) =>
        label.description.toLowerCase()
      ) || [];

    if (detectedFoodItems.length === 0) {
      return res
        .status(404)
        .json({ error: "No food items detected in the image" });
    }
    console.log("Detected food items:", detectedFoodItems);

    // Step 2: Map detected food items to cuisines
    const matchedCuisines = new Set();
    detectedFoodItems.forEach((food) => {
      const cuisine = foodToCuisine[food];
      if (cuisine) matchedCuisines.add(cuisine);
    });

    if (matchedCuisines.size === 0) {
      return res.status(404).json({ error: "No matching cuisines found" });
    }
    console.log("Mapped cuisines:", Array.from(matchedCuisines));

    // Step 3: Search MongoDB for restaurants with matched cuisines
    const db = client.db("restaurant");
    const collection = db.collection("restaurantList");

    const results = await collection
      .aggregate([
        { $unwind: "$restaurants" },
        {
          $match: {
            "restaurants.cuisines": { $in: Array.from(matchedCuisines) },
          },
        },
        { $limit: 10 },
      ])
      .toArray();

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No restaurants found for the detected cuisines" });
    }

    res.json({ results: results.map((r) => r.restaurants) });
  } catch (error) {
    console.error(
      "Error in image search:",
      error.response?.data || error.message
    );

    if (error.response?.status === 403) {
      return res
        .status(403)
        .json({ error: "Google Vision API access forbidden. Check API key." });
    } else if (error.response?.status === 400) {
      return res
        .status(400)
        .json({ error: "Invalid request to Google Vision API." });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

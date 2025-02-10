require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const restaurantRoutes = require("./routes/Restaurantroutes");
const locationRoutes = require("./routes/LocationRoute");
const imageSearchRoutes = require("./routes/imageSearch"); // Correct import

const db = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Food WebApp Backend is running!");
});

// Define API routes
app.use("/api/restaurants", locationRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/image-search", imageSearchRoutes); // Corrected this line

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

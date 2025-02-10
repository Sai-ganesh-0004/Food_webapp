const client = require("../db");

const allrestaurants = async (req, res) => {
  try {
    const db = client.db("restaurant"); // Your database name
    const collection = db.collection("restaurantList"); // Your collection name

    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit 10
    const searchQuery = req.query.search || ""; // Get the search query from request
    const cityQuery = req.query.city || ""; // Get the city query from request

    const skip = (page - 1) * limit;

    // Build the query object for name and city search
    const query = {};
    if (searchQuery) {
      query["restaurants.restaurant.name"] = {
        $regex: searchQuery,
        $options: "i", // Case-insensitive search by name
      };
    }
    if (cityQuery) {
      query["restaurants.restaurant.location.city"] = {
        $regex: cityQuery,
        $options: "i", // Case-insensitive search by city
      };
    }

    // Fetch paginated and filtered data
    const restaurants = await collection
      .aggregate([
        { $unwind: "$restaurants" },
        { $match: query }, // Apply the search query for name and city
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    const totalRestaurants = await collection
      .aggregate([
        { $unwind: "$restaurants" },
        { $match: query },
        { $count: "total" },
      ])
      .toArray();

    const total = totalRestaurants.length ? totalRestaurants[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      restaurants: restaurants.map((r) => r.restaurants),
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = allrestaurants;

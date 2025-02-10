const client = require("../db");

const getRestaurantsByLocation = async (req, res) => {
  try {
    const db = client.db("restaurant");
    const collection = db.collection("restaurantList");

    const { lat, lng, radius, city } = req.query;

    // Check if city is provided or lat, lng, and radius are provided
    if (!city && (!lat || !lng || !radius)) {
      return res
        .status(400)
        .json({
          message: "City or Latitude, Longitude, and Radius are required.",
        });
    }

    if (city) {
      // If city is provided, search restaurants by city
      const restaurants = await collection
        .find({ "restaurants.restaurant.city": city })
        .toArray();

      if (restaurants.length > 0) {
        return res.json(restaurants);
      } else {
        return res
          .status(404)
          .json({ message: "No restaurants found in the specified city." });
      }
    }

    // If lat, lng, and radius are provided, use the location-based search
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius) / 6378.1;

    // Validate if latitude, longitude, and searchRadius are valid numbers
    if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
      return res
        .status(400)
        .json({ message: "Invalid latitude, longitude, or radius." });
    }

    // Ensure the radius is positive
    if (searchRadius <= 0) {
      return res
        .status(400)
        .json({ message: "Radius must be a positive number." });
    }

    const restaurants = await collection
      .aggregate([
        { $unwind: "$restaurants" },
        {
          $addFields: {
            "restaurants.restaurant.location.coordinates": {
              $map: {
                input: [
                  "$restaurants.restaurant.location.longitude",
                  "$restaurants.restaurant.location.latitude",
                ],
                as: "coord",
                in: { $toDouble: "$$coord" },
              },
            },
          },
        },
        {
          $match: {
            "restaurants.restaurant.location.coordinates": {
              $geoWithin: {
                $centerSphere: [[longitude, latitude], searchRadius],
              },
            },
          },
        },
        { $replaceRoot: { newRoot: "$restaurants" } },
      ])
      .toArray();

    // Return the results if found, otherwise send a no results message
    if (restaurants.length > 0) {
      res.json(restaurants);
    } else {
      res
        .status(404)
        .json({ message: "No restaurants found in the given area." });
    }
  } catch (error) {
    console.error("Error in location search:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getRestaurantsByLocation };

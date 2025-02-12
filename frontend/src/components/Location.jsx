import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const Location = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5); // Default radius set to 5 km
  const [searchParams] = useSearchParams();

  const fetchRestaurants = useCallback(async (lat, lng, radius) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://restaurant-production-06c2.up.railway.app/api/restaurants/location?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      const data = await response.json();

      console.log("API Response:", JSON.stringify(data, null, 2));

      if (response.ok && Array.isArray(data)) {
        setRestaurants(data);
      } else {
        console.error("Invalid data format or error from API:", data);
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radiusFromParams = searchParams.get("radius");

    if (lat && lng) {
      setLatitude(lat);
      setLongitude(lng);
      if (radiusFromParams) {
        setRadius(radiusFromParams); // Set radius from URL if available
      }
      fetchRestaurants(lat, lng, radiusFromParams || radius); // Use radius from URL or default
    } else {
      console.error("Latitude and Longitude not provided");
    }
  }, [searchParams, fetchRestaurants, radius]);

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    fetchRestaurants(latitude, longitude, newRadius);
  };

  if (!latitude || !longitude) {
    return (
      <div className="container mx-auto p-4 text-center">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center text-teal-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          No location parameters found
        </motion.h1>
        <motion.div
          className="text-xl text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Please provide valid latitude and longitude in the URL.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto p-10 bg-gray-900 rounded-3xl shadow-xl space-y-6 text-white">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center text-teal-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Restaurants Around You
          <div className="ml-4 flex items-center space-x-4">
            {[3, 5, 10].map((radiusOption) => (
              <button
                key={radiusOption}
                onClick={() => handleRadiusChange(radiusOption)}
                className={`py-2 px-4 text-white rounded-full text-sm transition-colors duration-300 ease-in-out ${
                  radius === radiusOption
                    ? "bg-teal-600"
                    : "bg-gray-500 hover:bg-teal-400"
                }`}
              >
                {radiusOption} km
              </button>
            ))}
          </div>
        </motion.h1>

        {loading ? (
          <motion.div
            className="text-center text-xl text-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {restaurants.length > 0 ? (
              restaurants.map((restaurant, index) => {
                const rest = restaurant.restaurant;
                return (
                  <motion.div
                    key={index}
                    className="bg-gray-700 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {rest?.featured_image ? (
                      <motion.img
                        src={rest.featured_image}
                        alt={rest.name}
                        className="w-full h-48 object-cover rounded-t-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-xl">
                        No image available
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2 text-gray-100">
                        {rest?.name || "Unknown Restaurant"}
                      </h2>
                      <p className="text-gray-400 mb-2">
                        {rest?.location?.address || "No address available"}
                      </p>
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="ml-1 text-gray-300">
                          {rest?.user_rating?.aggregate_rating || "N/A"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                className="text-center text-gray-400 col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No restaurants found within {radius} km.
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Location;

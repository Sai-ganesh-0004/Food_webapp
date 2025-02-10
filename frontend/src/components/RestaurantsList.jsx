import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const city = new URLSearchParams(location.search).get("city");

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://food-webapp-backend-jrdu.onrender.com/api/restaurants?limit=1000${
          city ? `&city=${city}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const allRestaurants = data.restaurants.map((res) => res.restaurant);
      setRestaurants(allRestaurants);
      setFilteredRestaurants(allRestaurants);
      setTotalPages(Math.ceil(allRestaurants.length / 12));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [city]);

  // Filter restaurants based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredRestaurants(
        restaurants.filter(
          (restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (restaurant.location?.city &&
              restaurant.location.city
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredRestaurants(restaurants);
    }
    setTotalPages(Math.ceil(filteredRestaurants.length / 12)); // Adjust total pages based on filtered results
    setCurrentPage(1); // Reset to the first page when the search query changes
  }, [searchQuery, restaurants]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * 12;
    const endIndex = startIndex + 12;
    return filteredRestaurants.slice(startIndex, endIndex);
  }, [currentPage, filteredRestaurants]);

  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-400";
    if (rating >= 3) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8">
      <div className="max-w-7xl mx-auto p-8 bg-gray-900 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-center text-teal-300">
            Restaurant Listings
          </h1>
          <div className="flex items-center border border-teal-500 rounded-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-80 text-gray-200 focus:outline-none bg-gray-800"
              placeholder="Search restaurants or city..."
            />
            <button className="px-4 py-2 bg-teal-500 text-white hover:bg-teal-600">
              🔍
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-xl text-gray-500">Loading...</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {!loading && paginatedRestaurants.length > 0
            ? paginatedRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-600"
                >
                  <img
                    src={
                      restaurant.featured_image ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-100">
                      {restaurant.name}
                    </h2>
                    <p className="text-gray-400">
                      {restaurant.location?.city || "Unknown City"}
                    </p>
                    <div className="flex items-center mt-4">
                      <span
                        className={`px-4 py-1 rounded-full ${getRatingColor(
                          restaurant.user_rating?.aggregate_rating
                        )} text-white`}
                      >
                        ⭐ {restaurant.user_rating?.aggregate_rating || "N/A"}
                      </span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/restaurant/${restaurant.id}`}
                        className="block text-center mt-6 bg-teal-500 text-white rounded-lg py-2 px-4 hover:bg-teal-600"
                      >
                        View Details
                      </Link>
                    </motion.div>
                  </div>
                </div>
              ))
            : !loading && (
                <p className="text-center text-gray-400 col-span-full">
                  No restaurants found.
                </p>
              )}
        </div>

        <div className="flex justify-center mt-8">
          <motion.button
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
          <span className="px-4 py-2 text-xl text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsList;

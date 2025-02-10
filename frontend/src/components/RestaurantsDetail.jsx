import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantsDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `https://food-webapp-backend-jrdu.onrender.com/api/restaurants/${id}`
        );
        const data = await response.json();
        setRestaurant(data.restaurant);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return (
      <div className="text-center text-gray-600 text-xl mt-10">Loading...</div>
    );
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-400";
    if (rating >= 3) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black flex items-center justify-center px-6 py-12">
      {/* Main Container with elegant rounded edges */}
      <div className="max-w-4xl mx-auto p-10 bg-gray-800 rounded-3xl shadow-xl space-y-6 text-white">
        {/* Image and Info */}
        <div className="relative">
          <img
            src={
              restaurant.featured_image || "https://via.placeholder.com/600x300"
            }
            alt={restaurant.name}
            className="w-full h-72 object-cover rounded-2xl"
          />
          <div className="absolute top-6 left-6 bg-teal-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold">{restaurant.name}</h1>
            <p className="text-lg">{restaurant.location?.locality_verbose}</p>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">
            Cuisine: {restaurant.cuisines || "N/A"}
          </p>
          <p className="text-xl font-bold">
            {restaurant.user_rating?.aggregate_rating || "N/A"} ⭐
          </p>

          {/* Rating Section */}
          <div className="flex justify-center items-center gap-6">
            <span
              className={`px-6 py-3 rounded-full ${getRatingColor(
                restaurant.user_rating?.aggregate_rating
              )} text-white`}
            >
              {restaurant.user_rating?.aggregate_rating || "N/A"} Rating
            </span>
            <span className="text-lg text-gray-300">
              {restaurant.user_rating?.votes || 0} votes
            </span>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <p className="text-lg">
            <strong>Address: </strong>
            {restaurant.location?.address || "N/A"}
          </p>
          <p className="text-lg">
            <strong>Online Delivery: </strong>
            {restaurant.has_online_delivery ? "✅ Yes" : "❌ No"}
          </p>
          <p className="text-lg">
            <strong>Table Booking: </strong>
            {restaurant.has_table_booking ? "✅ Yes" : "❌ No"}
          </p>
          <p className="text-lg">
            <strong>Price Range: </strong>
            {"💰".repeat(restaurant.price_range)}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-center gap-8 mt-8">
          <a
            href={restaurant.menu_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            📜 View Menu
          </a>
          <a
            href={`https://www.google.com/maps/search/?q=${restaurant.location?.latitude},${restaurant.location?.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            📍 Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsDetail;

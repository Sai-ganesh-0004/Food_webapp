import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleRestaurantsNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          navigate(`/restaurants/location?lat=${lat}&lng=${lng}&radius=20`);
        },
        () => {
          alert(
            "Unable to retrieve your location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("image", file);

      fetch(
        "https://restaurant-production-06c2.up.railway.app/api/image-search",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            navigate(`/restaurants/search?query=${data.restaurant}`);
          } else {
            alert("No matching restaurant found.");
          }
        })
        .catch(() => {
          alert("Error processing the image.");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black flex items-center justify-center px-6 py-12">
      {/* Long Container with a sleek rounded edge and gradient */}
      <div className="max-w-4xl w-full p-10 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-3xl shadow-xl flex flex-col items-center text-white">
        {/* Header Section with more dynamic animation */}
        <motion.h2
          className="text-6xl font-extrabold text-center mb-6 tracking-wide"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Discover The Best Restaurants Near You
        </motion.h2>
        <motion.p
          className="text-lg text-center mb-12 max-w-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Explore the top-rated eateries, uncover hidden gems, and satisfy your
          cravings with ease!
        </motion.p>

        {/* Action Buttons */}
        <div className="flex w-full gap-8 justify-center">
          <motion.button
            onClick={() => navigate("/restaurants")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-teal-600 text-white py-4 px-8 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            View All Restaurants
          </motion.button>
          <motion.button
            onClick={handleRestaurantsNearMe}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 text-white py-4 px-8 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            Restaurants Near Me
          </motion.button>
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            Search by Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </motion.label>
        </div>
      </div>
    </div>
  );
};

export default Home;

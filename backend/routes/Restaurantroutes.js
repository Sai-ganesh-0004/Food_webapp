//Restaurantroutes.js
const express = require("express");
const router = express.Router();

const getRestaurantById = require("../controllers/getrestaurantcontroller");
const allrestaurants = require("../controllers/allrestaurantcontroller");

router.get("/:id", getRestaurantById);
router.get("/", allrestaurants);

module.exports = router;

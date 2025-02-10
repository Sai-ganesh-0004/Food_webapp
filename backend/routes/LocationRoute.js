const express = require("express");
const router = express.Router();
const {
  getRestaurantsByLocation,
} = require("../controllers/locationcontroller");

router.get("/location", getRestaurantsByLocation);
module.exports = router;

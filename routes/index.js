const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// Redirect to different sites depends on URL
router.get("/", restaurantController.homePage);
router.get("/add", restaurantController.addRestaurant);
router.get("/tags", restaurantController.restaurantTags);
router.get("/map", restaurantController.restaurantMap);
router.get("/top", restaurantController.topRestaurants);
router.get("/restaurants", restaurantController.allRestaurants);

module.exports = router;

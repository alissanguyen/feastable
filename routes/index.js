const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");


const { catchErrors } = require('../handlers/errorHandlers');

// Redirect to different sites depends on URL
router.get("/", restaurantController.homePage);

router.get("/add", restaurantController.addRestaurant);
router.post('/add', catchErrors(restaurantController.createRestaurant));


router.get("/tags", restaurantController.restaurantTags);
router.get("/map", restaurantController.restaurantMap);
router.get("/top", restaurantController.topRestaurants);
router.get("/categories", restaurantController.restaurantCategories);
router.get("/restaurants", restaurantController.allRestaurants);

module.exports = router;

const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

const { catchErrors } = require("../handlers/errorHandlers");

// Redirect to different sites depends on URL
router.get("/", catchErrors(restaurantController.getRestaurants));
router.get("/restaurants", catchErrors(restaurantController.getRestaurants));
router.get("/add", restaurantController.addRestaurant);
router.post("/add", catchErrors(restaurantController.createRestaurant));

router.post("/add/:id", catchErrors(restaurantController.updateRestaurant));
router.get(
  "/restaurants/:id/edit",
  catchErrors(restaurantController.editRestaurant)
);

router.get("/tags", restaurantController.restaurantTags);
router.get("/map", restaurantController.restaurantMap);
router.get("/top", restaurantController.topRestaurants);
router.get("/categories", restaurantController.restaurantCategories);

module.exports = router;

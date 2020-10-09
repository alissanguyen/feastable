const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");

// Redirect to different sites depends on URL
router.get("/", catchErrors(restaurantController.getRestaurants));
router.get("/restaurants", catchErrors(restaurantController.getRestaurants));
router.get("/add", authController.isLoggedIn, restaurantController.addRestaurant);

router.post(
  "/add",
  restaurantController.upload,
  catchErrors(restaurantController.resize),
  catchErrors(restaurantController.createRestaurant)
);

router.post(
  "/add/:id",
  restaurantController.upload,
  catchErrors(restaurantController.resize),
  catchErrors(restaurantController.updateRestaurant)
);

router.get(
  "/restaurants/:id/edit", 
  authController.isLoggedIn,
  catchErrors(restaurantController.editRestaurant)
);

router.get(
  "/restaurants/:slug",
  catchErrors(restaurantController.getRestaurantBySlug)
);

router.get("/tags", restaurantController.getRestaurantByTag);
router.get("/tags/:tag", restaurantController.getRestaurantByTag);

router.get("/categories", restaurantController.getRestaurantByCategory);
router.get(
  "/categories/:category",
  restaurantController.getRestaurantByCategory
);

router.get("/map", restaurantController.restaurantMap);
router.get("/top", restaurantController.topRestaurants);

//User Accounts
router.get("/register", userController.registerForm);
router.post(
  "/register",
  userController.validateRegister,
  userController.userRegister,
  authController.login
);
router.get('/logout', authController.logout)

router.get("/login", userController.loginForm);
router.post('/login', authController.login);


module.exports = router;

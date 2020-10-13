const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");

// Redirect to different sites depends on URL
router.get("/", catchErrors(restaurantController.getRestaurants));
router.get("/restaurants", catchErrors(restaurantController.getRestaurants));

// Adding restaurants
router.get(
  "/add",
  authController.isLoggedIn,
  restaurantController.addRestaurant
);

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

// Edit individual restaurant
router.get(
  "/restaurants/:id/edit",
  authController.isLoggedIn,
  catchErrors(restaurantController.editRestaurant)
);

// View individual restaurant
router.get(
  "/restaurants/:slug",
  catchErrors(restaurantController.getRestaurantBySlug)
);

// View restaurants with tags and categories
router.get("/tags", restaurantController.getRestaurantByTag);
router.get("/tags/:tag", restaurantController.getRestaurantByTag);

router.get("/categories", restaurantController.getRestaurantByCategory);
router.get(
  "/categories/:category",
  restaurantController.getRestaurantByCategory
);

router.get("/map", restaurantController.restaurantMap);
router.get("/top", restaurantController.topRestaurants);

//User Accounts Register and Sign In
router.get("/register", userController.registerForm);
router.post(
  "/register",
  userController.validateRegister,
  userController.userRegister,
  authController.login
);
router.get("/logout", authController.logout);

router.get("/login", userController.loginForm);
router.post("/login", authController.login);

// Personal User Accounts
router.get("/account", authController.isLoggedIn, userController.account);
router.post("/account", catchErrors(userController.updateAccount));

// Reset Password
router.post(
  "/account/resetpassword",
  catchErrors(authController.resetPassword)
);
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post(
  "/account/reset/:token",
  authController.confirmedPasswords,
  catchErrors(authController.passwordUpdate)
);

/* 
  API
*/
router.get("/api/search", catchErrors(restaurantController.searchRestaurants));

module.exports = router;

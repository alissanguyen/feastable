const { Store } = require("express-session");
const mongoose = require("mongoose");

const Restaurant = mongoose.model("Restaurant");

exports.homePage = (req, res) => {
  console.log(req.name);
  req.flash("error", "<strong>Error 404 Restaurant not found. Add?</strong>");
  req.flash(
    "info",
    "Sorry there was a problem loading this page. Please retry in about 30 seconds."
  );
  res.render("homePage"); //render index file.
};

exports.addRestaurant = (req, res) => {
  res.render("addRestaurant", { title: "Add Restaurant" });
};

exports.createRestaurant = async (req, res) => {
  const restaurant = await new Restaurant(req.body).save();
  req.flash(
    "success",
    `Successfully created ${restaurant.name}. Care to leave a review?`
  );
  res.redirect(`/restaurant/${restaurant.slug}`);
};

exports.getRestaurants = async (req, res) => {
  // 1. Query the database for a list of all stores
  const restaurants = await Restaurant.find();

  res.render("restaurants", { title: "Restaurants", restaurants });
};

exports.restaurantTags = (req, res) => {
  res.render("restaurantTags");
};

exports.restaurantMap = (req, res) => {
  res.render("restaurantMap");
};

exports.topRestaurants = (req, res) => {
  res.render("topRestaurants");
};

exports.restaurantCategories = (req, res) => {
  res.render("restaurantCategories");
};

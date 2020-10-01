const { Store } = require("express-session");
const mongoose = require("mongoose");

const Restaurant = mongoose.model("Restaurant");

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render("homePage"); //render index file.
};

exports.addRestaurant = (req, res) => {
  res.render("addRestaurant", { title: "Add Restaurant" });
};

exports.createRestaurant = async (req, res) => {
  const restaurant = new Restaurant(req.body);
  await restaurant.save();
  res.redirect("/");
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

exports.allRestaurants = (req, res) => {
  res.render("allRestaurants");
};

exports.restaurantCategories = (req, res) => {
  res.render("restaurantCategories");
};

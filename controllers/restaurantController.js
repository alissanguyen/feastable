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
  const restaurant = new Restaurant(req.body);
  await restaurant.save();
  req.flash(
    "success",
    `Successfully created ${restaurant.name}. Care to leave a review?`
  );
  res.redirect("/add");
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

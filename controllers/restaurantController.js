const { Store } = require("express-session");
const mongoose = require("mongoose");
const multer = require("multer");
const jimp = require("jimp"); // resize photos before save into database
const uuid = require("uuid"); // give unique identifiers for image files
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed" }, false);
    }
  },
};

const Restaurant = mongoose.model("Restaurant");

exports.homePage = (req, res) => {
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

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // Check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // Resize the photo
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  // Once we have written the photo to our filesystem, continue processing
  next();
};

exports.createRestaurant = async (req, res) => {
  const restaurant = await new Restaurant(req.body).save();
  req.flash(
    "success",
    `Successfully created ${restaurant.name}. Care to leave a review?`
  );
  res.redirect(`/restaurants/${restaurant.slug}`);
};

exports.getRestaurants = async (req, res) => {
  // 1. Query the database for a list of all stores
  const restaurants = await Restaurant.find();
  res.render("restaurants", { title: "Restaurants", restaurants });
};

exports.editRestaurant = async (req, res) => {
  //1. Find the store given by the ID
  const restaurant = await Restaurant.findOne({ _id: req.params.id });

  //TODO: 2. Confirm they are the real owner of the store.
  //3. Render out the edit form so the user can update their store.
  res.render("editRestaurant", {
    title: `Edit ${restaurant.name}`,
    restaurant,
  });
};

exports.updateRestaurant = async (req, res) => {
  // Set the location data to be a point.
  req.body.location.type = "Point";
  // 1. Find and update the restaurant.
  const restaurant = await Restaurant.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true, // return the new restaurant instead of the old one.
      runValidators: true,
    }
  ).exec();
  // 2. Reflect user the restaurant and tell them it worked.
  req.flash(
    "success",
    `Successfully updated <strong>${restaurant.name}</strong>. <a href="/restaurants/${restaurant.slug}">View Restaurant -></a>`
  );
  res.redirect(`/restaurants/${restaurant._id}/edit`);
};

exports.displayRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findOne({ _id: req.params.id });
  res.render("singleRestaurant", {
    title: `${restaurant.name}`,
    restaurant,
  });
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

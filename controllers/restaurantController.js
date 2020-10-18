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
const User = mongoose.model("User");

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
  req.body.author = req.user._id;
  const restaurant = await new Restaurant(req.body).save();
  req.flash(
    "success",
    `Successfully created ${restaurant.name}. Care to leave a review?`
  );
  res.redirect(`/restaurants/${restaurant.slug}`);
};

exports.getRestaurants = async (req, res) => {
  // Query the database for a list of all stores
  const restaurants = await Restaurant.find();
  res.render("restaurants", { title: "Restaurants", restaurants });
};

const confirmOwner = (restaurant, user) => {
  if (!restaurant.author.equals(user._id)) {
    throw Error("You must own a store in order to edit it!");
  }
};

exports.editRestaurant = async (req, res) => {
  //1. Find the store given by the ID
  const restaurant = await Restaurant.findOne({ _id: req.params.id });

  //2. Confirm they are the real owner of the store.
  confirmOwner(restaurant, req.user);

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

exports.getFavoriteRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find({
    _id: { $in: req.user.hearts },
  });
  res.render("restaurants", { title: "Favorite Restaurants", restaurants });
};

exports.getRestaurantBySlug = async (req, res, next) => {
  const restaurant = await Restaurant.findOne({
    slug: req.params.slug,
  }).populate("author reviews");
  if (!restaurant) return next();

  // To display latest review first
  restaurant.reviews.sort((review1, review2) => {
    return review2.created.valueOf() - review1.created.valueOf();
  });

  res.render("singleRestaurant", { restaurant, title: `${restaurant.name}` });
};

exports.getRestaurantByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Restaurant.getTagsList();
  const restaurantsPromise = Restaurant.find({ tags: tagQuery });
  const [tags, restaurants] = await Promise.all([
    tagsPromise,
    restaurantsPromise,
  ]);
  res.render("restaurantTag", { tags, title: "Tags", tag, restaurants });
};

exports.getRestaurantByCategory = async (req, res) => {
  const category = req.params.category;
  const categoryQuery = category || { $exists: true };
  const categoriesPromise = Restaurant.getCategoriesList();
  const restaurantsPromise = Restaurant.find({ categories: categoryQuery });
  const [categories, restaurants] = await Promise.all([
    categoriesPromise,
    restaurantsPromise,
  ]);

  res.render("restaurantCategory", {
    categories,
    title: "Categories",
    category,
    restaurants,
  });
};

exports.searchRestaurants = async (req, res) => {
  const restaurants = await Restaurant
    // Find restaurants that match
    .find(
      { $text: { $search: req.query.q } },
      // Create a new field (objecting) to keep track of how good the matches are
      { score: { $meta: "textScore" } }
    )
    // Sort and load best matched restaurants first
    .sort({
      score: { $meta: "textScore" },
    })
    // Only show 20 best matched restaurants.
    .limit(20);

  res.json(restaurants);
};

exports.getTopRestaurants = async (req, res) => {
  const restaurants = await Restaurant.getTopRestaurants();
  res.render("topRestaurants", {restaurants, title: 'Top Restaurants'});
};

exports.mapRestaurants = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  console.log("IN HERE.....", coordinates);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates,
        },
        $maxDistance: 10000, //10km
      },
    },
  };

  const restaurants = await Restaurant.find(q)
    .select("slug name description location photo")
    .limit(10);

  console.log(restaurants);
};

exports.mapPage = (req, res) => {
  res.render("restaurantMap", { title: "Map" });
};

exports.heartRestaurant = async (req, res) => {
  const hearts = req.user.hearts.map((obj) => obj.toString());
  const operator = hearts.includes(req.params.id) ? "$pull" : "$addToSet";
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { [operator]: { hearts: req.params.id } },
    { new: true }
  );
  res.json(user);
};

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render("homePage"); //render index file.
};

exports.editRestaurant = (req, res) => {
  res.render("editRestaurant", { title: "Add Restaurant" });
};

exports.createRestaurant = (req, res) => {
  res.json(req.body)
}

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

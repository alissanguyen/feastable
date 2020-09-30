const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const slug = require("slugs");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please enter a restaurant name",
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  categories: [String],
});

restaurantSchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    next();
    return;
  }
  this.slug = slug(this.name);

  //TODO: have unique slug for each restaurant.
  next();
});

module.exports = mongoose.model("Restaurant", restaurantSchema);

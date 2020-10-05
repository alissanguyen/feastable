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
  photo: String,
  contact: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  categories: [String],
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [{ type: Number, required: " You must supply coordinates!" }],
    address: {
      type: String,
      required: "You must supply an address!", //TODO: Auto-generate address when users add a restaurant.
    },
  },
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

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const restaurantSchema = new mongoose.Schema(
  {
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
      coordinates: [
        { type: Number, required: " You must supply coordinates!" },
      ],
      address: {
        type: String,
        required: "You must supply an address!", //TODO: Auto-generate address when users add a restaurant.
      },
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "You must supply an author",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define indexes
restaurantSchema.index({
  name: "text",
  description: "text",
});

// For displaying markers on map
restaurantSchema.index({ location: "2dsphere" });

restaurantSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    next();
    return;
  }
  this.slug = slug(this.name);
  // Create unique slug for restaurants that have the same name.
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i"); //"i" stands for case insensitive
  const restaurantWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (restaurantWithSlug.length) {
    this.slug = `${this.slug}-${restaurantWithSlug.length + 1}`;
  }
  next();
});

restaurantSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

restaurantSchema.statics.getCategoriesList = function () {
  return this.aggregate([
    { $unwind: "$categories" },
    { $group: { _id: "$categories", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

// Get top restaurants
restaurantSchema.statics.getTopRestaurants = function () {
  return this.aggregate([
    //1. Lookup restaurants and populate their reviews
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurant",
        as: "reviews",
      },
    },
    //2. Filter for only restaurants that have 2 or more reviews
    {
      $match: {
        "reviews.1": { $exists: true },
      },
    },
    //3. Add the average reviews field
    {
      $set: {
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    //4. Sort it by our new field, highest reviews first
    {
      $sort: {
        averageRating: -1,
      },
    },
    //5. Limit to at most 10
    { $limit: 10 }
  ]);
};

// Find reviews where the restaurants '_id' property === reviews 'restaurant' property
restaurantSchema.virtual("reviews", {
  ref: "Review", // link to 'Review' model
  localField: "_id", // which field on the restaurant?
  foreignField: "restaurant", // which field on the review?
});

function autopopulate(next) {
  this.populate('reviews');
  next();
}

restaurantSchema.pre('find', autopopulate);
restaurantSchema.pre('findOne', autopopulate);

module.exports = mongoose.model("Restaurant", restaurantSchema);

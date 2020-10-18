const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "You must provide an author name",
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: "You must provide a restaurant' name",
  },
  text: {
    type: String,
    required: "You must provide a review",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

function autopopulate(next) {
  this.populate('author');
  next();
}

// Add hooks
reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model("Review", reviewSchema);

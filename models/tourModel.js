const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

// Define the Mongoose schema for the Tour model
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'Name is too long!! Max length is 40']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a Group Size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Wrong input `{VALUE}` is not supported! Only easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 1,
      max: [5, '`{VALUE}` is not supported, maximum is 5'],
      min: [1, '`{VALUE}` is not supported, must be at least 1']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [1, '`{VALUE}` must be non-neagtive number']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary']
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  }
  // removes non-schema properties from filter
  // { strictQuery: true }
);

// Pre-save middleware to generate a slug from the tour name
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Create and export the Tour model based on the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

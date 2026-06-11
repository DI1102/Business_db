// models/Business.js
// defines the shape of a business document in mongodb
// mongoose schema - like a blueprint for each record

const mongoose = require('mongoose')

// defining schema
// not all fields are required - some businesses have missing data
const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,   // name is required
    trim: true
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: 'Unknown'
  },
  phone: {
    type: String,
    default: ''
    // should probably validate phone format but skipping that
  },
  website: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  hasPhone: {
    type: Boolean,
    default: false
  },
  hasWebsite: {
    type: Boolean,
    default: false
  }
  // not adding timestamps for now - could add createdAt later
})

// creating the model from schema
const Business = mongoose.model('Business', businessSchema)

module.exports = Business

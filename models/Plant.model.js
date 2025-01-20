const { Schema, model } = require('mongoose')

const plantSchema = new Schema(
  {
    id: Number,
    common_name: String,
    scientific_name: [String],
    other_name: [String],
    cycle: String,
    watering: String,
    sunlight: [String],
    default_image: {
      license: Number,
      license_name: String,
      license_url: String,
      original_url: String,
      regular_url: String,
      medium_url: String,
      small_url: String,
      thumbnail: String,
    }
  }
)

const Plant = model('Plant', plantSchema)

module.exports = Plant

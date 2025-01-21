const { Schema, model } = require('mongoose')
// Sub-schema for description
const descriptionSchema = new Schema({
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
});

// Sub-schema for solutions
const solutionSchema = new Schema({
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
});

// Sub-schema for images
const imageSchema = new Schema({
  license: { type: Number, required: true },
  original_url: { type: String, required: true },
  license_name: { type: String},
  medium_url: { type: String },
  license_url: { type: String },
  regular_url: { type: String },
  small_url: { type: String },
  thumbnail: { type: String },
});

// Main schema
const plantDiseaseSchema = new Schema(
  {
    id: { type: Number, required: true },
    scientific_name: { type: [String], required: false },
    common_name: { type: String, required: true },
    family: { type: String, default: null },
    description: { type: [descriptionSchema], required: true },
    solution: { type: [solutionSchema], required: true },
    images: { type: [imageSchema] },
    host: { type: [String], required: true },
    other_name: { type: [String], required: false  },
  },
  { timestamps: true }
);
  



const PlantDisease = model('PlantDisease', plantDiseaseSchema)

module.exports = PlantDisease

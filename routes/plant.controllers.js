const PlantDisease = require("../models/PlantDisease.model");
const fs = require("fs");

const importPlantDiseaseData = async () => {
  try {
    const data = fs.readFileSync("./db/plantDiseases.json", "utf-8");
    const plantdiseases = JSON.parse(data);

    // Insert data into MongoDB
    await PlantDisease.deleteMany();
    await PlantDisease.insertMany(plantdiseases);
    console.log("Plant Disease Data imported successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
  }
};

module.exports = importPlantDiseaseData;

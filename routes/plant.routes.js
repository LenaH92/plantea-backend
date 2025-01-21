const Plant = require("../models/Plant.model");
const fs = require("fs");

const importPlantData = async () => {
    try {
      const data = fs.readFileSync('./db/plantSpecies.json', 'utf-8');
      const plants = JSON.parse(data);
      
      // Insert data into MongoDB
      await Plant.insertMany(plants);
      console.log('PlantSpecies Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
    }
  };

module.exports = importPlantData;



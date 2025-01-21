/*const mongoose = require("mongoose");
const Plant = require("../models/Plant.model");

const importPlantData = async () => {
    try {
      const data = fs.readFileSync('./db/plantSpecies.json', 'utf-8');
      const plants = JSON.parse(data);
      
      // Insert data into MongoDB
      await Plant.insertMany(plants);
      console.log('Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      mongoose.connection.close();
    }
  };

module.exports = importPlantData;*/
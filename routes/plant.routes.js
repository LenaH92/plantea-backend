
const express = require("express");
const router = express.Router();
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

  router.get("/api/plants", async (req, res) => {
    const query = req.query.query?.toLowerCase() || ""; // Extract query parameter

    try {
      // Perform a case-insensitive search directly in MongoDB
      const matchingPlants = await Plant.find({
        common_name: { $regex: query, $options: "i" }, // Case-insensitive partial match
      })
  
      res.json(matchingPlants);
     // console.log(matchingPlants)
    } catch (error) {
      console.error("Error fetching plant species:", error);
      res.status(500).send("Internal server error");
    }
  });
  
  // Export Both the Function and Router
  module.exports = {
    importPlantData,
    plantRoutes: router,
  };




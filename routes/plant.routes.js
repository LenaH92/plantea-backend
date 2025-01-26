
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
  
  router.get("/api/plants/random", async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    try {
      const plants = await Plant.aggregate([{ $sample: { size: limit } }]);
      res.json(plants);
    } catch (error) {
      console.error("Error fetching random plants:", error);
      res.status(500).send("Internal server error");
    }
  });
  
  router.get("/api/plants/search", async (req, res) => {
    const query = req.query.query?.toLowerCase() || "";
    try {
      const plants = await Plant.find({
        $or: [
          { common_name: { $regex: query, $options: "i" } },
          { scientific_name: { $regex: query, $options: "i" } },
        ],
      });
      res.json(plants);
    } catch (error) {
      console.error("Error fetching search results:", error);
      res.status(500).send("Internal server error");
    }
  });
  

  // Export Both the Function and Router
  module.exports = {
    importPlantData,
    plantRoutes: router,
  };




const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant.model");
const fs = require("fs");

const importPlantData = async () => {
  try {
    const data = fs.readFileSync("./db/plantSpecies.json", "utf-8");
    const plants = JSON.parse(data);

    // Insert data into MongoDB
    await Plant.deleteMany();
    await Plant.insertMany(plants);
    console.log("PlantSpecies Data imported successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
  }
};

router.get("/", async (req, res) => {
  const query = req.query.query?.toLowerCase() || ""; // Extract query parameter

  try {
    // Perform a case-insensitive search directly in MongoDB

    const matchingPlants = await Plant.find({
      common_name: { $regex: query, $options: "i" }, // Case-insensitive partial match
    });

    res.status(200).json(matchingPlants);

    // console.log(matchingPlants)
  } catch (error) {
    console.error("Error fetching plant species:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/random", async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  try {
    const plants = await Plant.aggregate([{ $sample: { size: limit } }]);
    res.json(plants);
  } catch (error) {
    console.error("Error fetching random plants:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.query?.toLowerCase() || "";
  try {
    // find all crashed the backend, so regex is used to query the db to find the plants
    //that include the user typed value in the common_name or scientific_name field
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

router.get("/:plantId", async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plantId);
    if (!plant) {
      return res.status(404).send("Plant not found");
    }
    res.json(plant);
  } catch (error) {
    console.error("Error fetching plant details:", error);
    res.status(500).send("Internal server error");
  }
});

// Export Both the Function and Router
module.exports = {
  importPlantData,
  plantRoutes: router,
};

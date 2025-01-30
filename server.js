const app = require("./app");
//const withDB = require('./db')
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5005;
const withDB = require("./db");
const { importPlantData, plantRoutes } = require("./routes/plant.routes");
const importPlantDiseaseData = require("./routes/plant.controllers"); // Adjust the path if necessary

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
withDB(async () => {
  try {
    // Import plant data into the database
    await importPlantData();
    await importPlantDiseaseData();
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during server setup:", error);
  }
});

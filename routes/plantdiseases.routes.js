const PlantDisease = require("../models/PlantDisease.model");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const randomDiseases = await PlantDisease.aggregate([
      { $match: { images: { $ne: null, $not: { $size: 0 } } } }, // Exclude null or empty images
      { $sample: { size: count } },
    ]);

    console.log("==== randomDiseases ====", randomDiseases);
    res.status(200).json(randomDiseases);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// the following 3 packages are needed in order for cloudinary to run
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// your three cloudinary keys will be passed here from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bananarama",
    allowedFormats: ["jpg", "png"],
    public_id: (req, file) => file.originalname, // Use `file`, not `res`
  },
});

module.exports = multer({ storage });

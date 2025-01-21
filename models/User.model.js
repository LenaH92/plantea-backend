const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the Book model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is required."],
    },
    surname: {
      type: String,
      required: [true, "Surname is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
    },
    profilePicture: {
      type: String,
      required: true,
      default: "https://cdn-icons-png.flaticon.com/512/8801/8801434.png",
    },
    passwordHash: {
      type: String,
      required: [true, "Pasword is required."],
    },
    greenhouse: {
      type: [String], //will work  on it later in life
      default: [],
    },
    bioDescription: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

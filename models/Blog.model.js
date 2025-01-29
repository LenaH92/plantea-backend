const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required."],
      trim: true,
    },
    tags: {
      type: [String],
    },
    categories: {
      //(such as a family of the plant)
      type: [String],
    },
    views: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["blogPost", "question"],
      default: "blogPost",
    },
    textContent: {
      type: String,
      required: [true, "Content is required."],
    },
    mediaContent: {
      type: [String], //if NOT array of URLS or just one image change
    },
    other: {
      type: String, //other plant not in db
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    selectedSpecies: [
      {
        plantId: { type: Schema.Types.ObjectId, ref: "Plant" },
        name: { type: String },
        default_image: { type: String }
      },
    ],
  },
  {
    timestamps: true, //useful to add when created and when updatedAt the post
  }
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;

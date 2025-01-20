const { Schema, model } = require('mongoose')

const blogSchema = new Schema(

  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Author is required.'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [true, 'Title is required']
    },
    categories: { //(such as a family of the plant)
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    textContent: {
      type: String,
      required: [true, 'Content is required.'],
    },
    mediaContent: {
      type: [String], //if NOT array of URLS or just one image change
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
  },
  {
    timestamps: true, //useful to add when created and when updatedAt the post
  }
)

const Blog = model('Blog', blogSchema)

module.exports = Blog

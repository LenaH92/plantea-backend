const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogPostId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: { // added this for seeing the timestamps
      type: Date,
      default: Date.now,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Comment = model('Comment', commentSchema)

module.exports = Comment

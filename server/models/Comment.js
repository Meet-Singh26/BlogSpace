import mongoose, { Schema } from "mongoose";

// Mongoose schema for a comment.
const commentSchema = mongoose.Schema(
  {
    // The ID of the blog post that this comment belongs to.
    blog_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },
    // The author of the blog post.
    blog_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs", // Should this be 'users'?
    },
    // The content of the comment.
    comment: {
      type: String,
      required: true,
    },
    // An array of replies to this comment (child comments).
    children: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    // The user who posted the comment.
    commented_by: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "users",
    },
    // A boolean flag to indicate if this is a reply to another comment.
    isReply: {
      type: Boolean,
      default: false,
    },
    // The parent comment if this is a reply.
    parent: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  },
  {
    // Enable timestamps and alias 'createdAt' to 'commentedAt'.
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

export default mongoose.model("comments", commentSchema);

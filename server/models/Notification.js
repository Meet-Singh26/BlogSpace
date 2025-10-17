import mongoose, { Schema } from "mongoose";

// Mongoose schema for a notification.
const notificationSchema = mongoose.Schema(
  {
    // The type of notification, which can be 'like', 'comment', or 'reply'.
    type: {
      type: String,
      enum: ["like", "comment", "reply"], // The type must be one of these values.
      required: true,
    },
    // The blog post that the notification is related to.
    blog: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },
    // The user who the notification is for (the recipient).
    notification_for: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    // The user who triggered the notification (e.g., the one who liked or commented).
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    // The comment that the notification is related to (if applicable).
    comment: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    // The reply that the notification is related to (if applicable).
    reply: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    // The comment that was replied to (if applicable).
    replied_on_comment: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    // A boolean flag to indicate if the notification has been seen by the user.
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Enable timestamps to automatically add 'createdAt' and 'updatedAt' fields.
    timestamps: true,
  }
);

export default mongoose.model("notification", notificationSchema);

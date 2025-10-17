import mongoose, { Schema } from "mongoose";

// Mongoose schema for a blog post.
const blogSchema = mongoose.Schema({
    // A unique identifier for the blog post, generated from the title.
    blog_id: {
        type: String,
        required: true,
        unique: true,
    },
    // The title of the blog post.
    title: {
        type: String,
        required: true,
    },
    // The URL of the banner image for the blog post.
    banner: {
        type: String,
        // required: true,
    },
    // A short description of the blog post.
    des: {
        type: String,
        maxlength: 200,
        // required: true
    },
    // The content of the blog post, stored as an array of blocks (from Editor.js).
    content: {
        type: [],
        // required: true
    },
    // An array of tags associated with the blog post.
    tags: {
        type: [String],
        // required: true
    },
    // The author of the blog post, referenced from the 'users' collection.
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    // An object containing activity metrics for the blog post.
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    // An array of comment ObjectIds, referenced from the 'comments' collection.
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    // A boolean flag to indicate if the blog post is a draft.
    draft: {
        type: Boolean,
        default: false
    }
},
{
    // Enable timestamps, which automatically adds 'createdAt' and 'updatedAt' fields.
    // 'createdAt' is aliased to 'publishedAt' for clarity.
    timestamps: {
        createdAt: 'publishedAt'
    }
})

export default mongoose.model("blogs", blogSchema);
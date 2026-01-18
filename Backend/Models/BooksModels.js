import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: ["Technical", "Mythology", "Hindi", "Historical", "Other"]
    },

    description: {
      type: String,
      default: ""
    },

    coverImage: {
      type: String, // Cloudinary URL / local path
      default: ""
    },

    // 📦 Inventory
    totalCopies: {
      type: Number,
      required: true,
      min: 1
    },

    availableCopies: {
      type: Number,
      required: true,
      min: 0
    },

    // 📊 Analytics
    borrowCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

bookSchema.index({ title: "text", author: "text", category: "text" })
export default mongoose.model("Book", bookSchema);

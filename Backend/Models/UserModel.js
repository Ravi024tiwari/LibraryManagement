import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      default: "STUDENT"
    },

    // 🔹 Profile related
    profileImage: {
      type: String, // Cloudinary / local path
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    about: {
      type: String,
      maxlength: 300,
      default: ""
    },

    // 🔹 Student specific
    issuedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue"
      }
    ],

    totalFineDue: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);

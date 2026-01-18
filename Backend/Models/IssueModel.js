import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    issueDate: {
      type: Date,
      default: Date.now
    },

    expectedReturnDate: {
      type: Date,
      required: true
    },

    actualReturnDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["ISSUED", "RETURNED"],
      default: "ISSUED"
    },

    lateDays: {
      type: Number,
      default: 0
    },

    fineAmount: {
      type: Number,
      default: 0
    },

    fineStatus: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID"
    }
  },
  {
    timestamps: true
  }
);

issueSchema.index({student:1,status:1})
issueSchema.index({book:1})

export default mongoose.model("Issue", issueSchema);

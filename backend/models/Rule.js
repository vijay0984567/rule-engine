const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    rootNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rule", RuleSchema);

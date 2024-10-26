const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["operator", "operand"],
      required: true,
    },
    operator: {
      type: String,
      enum: ["AND", "OR", ">", "<", "=", ">=", "<=", "!="],
      required: function () {
        return this.type === "operator";
      },
    },
    field: {
      type: String,
      required: function () {
        return this.type === "operand";
      },
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: function () {
        return this.type === "operand";
      },
    },
    left: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
    right: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Node", NodeSchema);

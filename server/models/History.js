
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    tool: {
      type: String,
      enum: [
        "README_GENERATOR",
        "PORTFOLIO_ANALYZER",
        "DEBUG_ASSISTANT",
        "CODE_REVIEWER",
        "AI_CHAT"
      ],
      required: true
    },

    action: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    input: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null
    },

    file: {
      name: String,
      path: String,
      mimeType: String,
      size: Number
    }
  },
  {
    timestamps: true
  }
);

// Index pour récupérer rapidement l'historique d'un utilisateur
historySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("History", historySchema);


const History = require("../models/History");
const fs = require("fs");
const path = require("path");

// GET : récupérer l'historique de l'utilisateur connecté
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve history."
    });
  }
};

// GET : consulter une activité précise
exports.getHistoryById = async (req, res) => {
  try {
    const item = await History.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "History item not found."
      });
    }

    res.status(200).json({
      success: true,
      history: item
    });
  } catch (error) {
    console.error("Get history item error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve this activity."
    });
  }
};

// DELETE : supprimer une activité
exports.deleteHistory = async (req, res) => {
  try {
    const item = await History.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "History item not found."
      });
    }

    // Supprimer le fichier associé, s'il existe
    if (item.file?.path) {
      const filePath = path.resolve(item.file.path);
      const uploadDirectory = path.resolve(
        __dirname,
        "../uploads/history"
      );

      if (
        filePath.startsWith(uploadDirectory + path.sep) &&
        fs.existsSync(filePath)
      ) {
        fs.unlinkSync(filePath);
      }
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully."
    });
  } catch (error) {
    console.error("Delete history error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete this activity."
    });
  }
};

// GET : télécharger le fichier associé à une activité
exports.downloadHistoryFile = async (req, res) => {
  try {
    const item = await History.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item || !item.file?.path) {
      return res.status(404).json({
        success: false,
        message: "File not found."
      });
    }

    const filePath = path.resolve(item.file.path);
    const uploadDirectory = path.resolve(
      __dirname,
      "../uploads/history"
    );

    if (
      !filePath.startsWith(uploadDirectory + path.sep) ||
      !fs.existsSync(filePath)
    ) {
      return res.status(404).json({
        success: false,
        message: "Stored file is unavailable."
      });
    }

    res.download(filePath, item.file.name);
  } catch (error) {
    console.error("Download history file error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to download this file."
    });
  }
};

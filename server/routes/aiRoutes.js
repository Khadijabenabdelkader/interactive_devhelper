const express = require("express");

const {
    chat,
    review,
    debugError,
    readme,
    portfolio
} = require("../controllers/aiController");
const {
  getHistory,
  getHistoryById,
  deleteHistory,
  downloadHistoryFile
} = require("../controllers/historyController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
    "/chat",
    protect,
    chat
);

router.post(
    "/review",
    protect,
    review
);

router.post(
    "/debug",
    protect,
    debugError
);

router.post(
    "/readme",
    protect,
    readme
);

router.post(
    "/portfolio",
    protect,
    portfolio
);

router.get("/",protect, getHistory);
router.get("/:id/download",protect, downloadHistoryFile);
router.get("/:id",protect, getHistoryById);
router.delete("/:id",protect, deleteHistory);

module.exports = router;
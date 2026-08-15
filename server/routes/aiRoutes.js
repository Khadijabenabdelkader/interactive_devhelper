const express = require("express");

const {
    chat,
    review,
    debugError,
    readme,
    portfolio
} = require("../controllers/aiController");

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

module.exports = router;
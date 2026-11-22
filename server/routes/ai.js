const express = require("express");
const multer = require("multer");

const protect = require("../middlewares/authMiddleware");

const {
    chat,
    review,
    readme,
    portfolio,
    debugError
} = require("../controllers/aiController");

const router = express.Router();


// ==========================================
// FILE UPLOAD (memory only, nothing written to disk)
// ==========================================

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

const uploadFile = (req, res, next) =>
    upload.single("file")(req, res, (err) => {

        if (err) {
            return res.status(400).json({
                message:
                    err.code === "LIMIT_FILE_SIZE"
                        ? "File too large (10 MB max)."
                        : err.message
            });
        }

        // Temporary debug line: remove once everything works
        console.log(
            "UPLOAD CHECK:",
            req.headers["content-type"]?.split(";")[0],
            "| file:",
            req.file?.originalname || "none"
        );

        next();
    });


// ==========================================
// ROUTES
// ==========================================

router.post("/chat", protect, uploadFile, chat);

router.post("/review", protect, review);
router.post("/readme", protect, readme);
router.post("/portfolio", protect, portfolio);
router.post("/debug", protect, debugError);

module.exports = router;

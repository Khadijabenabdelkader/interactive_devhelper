const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// Exécute multer une seule fois, quelle que soit la route qui appelle chat
const uploadFile = (req, res, next) => {

    if (req._multerDone) return next();

    upload.single("file")(req, res, (err) => {

        req._multerDone = true;

        if (err) {
            return res.status(400).json({
                message:
                    err.code === "LIMIT_FILE_SIZE"
                        ? "File too large (10 MB max)."
                        : err.message
            });
        }

        next();
    });
};
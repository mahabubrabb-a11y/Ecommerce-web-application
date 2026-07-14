const multer = require("multer");

// Configure storage engine
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s+/g, ""); // Removes spaces
    cb(null, "api-img-" + Date.now() + "-" + sanitizedFilename);
  },
});

// Set file size limits and file filter
const upload = multer({
  storage: fileStorageEngine,
  limits: { fileSize: 200 * 1024 }, // 200 KB
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

// ✅ Middleware wrapper to handle Multer errors inside this file
const fileUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    console.log(err?.code);

    if (err) {
      if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large! Maximum size is 200 KB.",
        });
      }
      return res.status(400).json({
        success: false,
        message: "File upload failed00.",
      });
    }
    next(); // continue if no error
  });
};

module.exports = fileUpload;

const multer = require("multer");
const path = require("path");

// 1. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. File Filter (to accept only jpg, png, jpeg)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true); // Accept the file
  } else {
    // --- THIS IS THE FIX ---
    // Instead of throwing an error, we just reject the file.
    // This stops the server from crashing.
    cb(null, false);
    // -----------------------
  }
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

module.exports = upload.single("image");
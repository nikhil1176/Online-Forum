// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // Assumes your config is in /config
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path if needed

// Configure multer to store files in memory (as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }

    // Use upload_stream to upload the file buffer from multer
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // Automatically detect file type
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ msg: 'Cloudinary upload failed.' });
        }
        
        // Send back the secure URL
        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    // Pipe the file buffer from memory into the Cloudinary stream
    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
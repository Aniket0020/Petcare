// middleware/upload.js
const multer = require('multer');
const storage = multer.memoryStorage(); // Keep image in memory
const upload = multer({ storage });
module.exports = upload;

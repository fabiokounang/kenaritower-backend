const multer = require("multer");
const path = require("path");
const fs = require("fs");

function makeUploader(folder) {
  const uploadPath = path.join(__dirname, "../public/uploads", folder);
  fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: uploadPath,
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, name + ext);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }
  });
}

module.exports = {
  heroUpload: makeUploader("hero"),
  galleryUpload: makeUploader("gallery")
};

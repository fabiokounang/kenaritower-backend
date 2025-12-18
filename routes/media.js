const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// simple in-memory list
let mediaItems = []; // {id, url, filename, createdAt}
let nextId = 1;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^\w.\-]+/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

router.get('/', auth, (req, res) => {
  res.render('media', { items: mediaItems });
});

router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (req.file) {
    const url = `/public/uploads/${req.file.filename}`;
    mediaItems.unshift({
      id: nextId++,
      url,
      filename: req.file.filename,
      createdAt: new Date().toISOString()
    });
  }
  res.redirect('/media');
});

router.post('/:id/delete', auth, (req, res) => {
  const id = Number(req.params.id);
  const item = mediaItems.find(x => x.id === id);
  if (item) {
    const filePath = path.join(uploadDir, item.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    mediaItems = mediaItems.filter(x => x.id !== id);
  }
  res.redirect('/media');
});

module.exports = router;

const router = require('express').Router();
const auth = require('../middlewares/auth');

// sementara dummy (nanti bisa ambil dari DB)
let settingsStore = {
  hotelName: 'Kenari Tower Hotel',
  phone: '+62411xxxx',
  email: 'info@kenaritower.com',
  whatsapp: '6241112345678',
  address: 'Jl. Yosep Latumahina No.30, Makassar',
  mapsEmbedUrl: 'https://www.google.com/maps?q=Jl.+Yosep+Latumahina+No.30,+Makassar&output=embed'
};

router.get('/', auth, (req, res) => {
  res.render('settings', { data: settingsStore, saved: false });
});

router.post('/', auth, (req, res) => {
  settingsStore = {
    ...settingsStore,
    hotelName: req.body.hotelName || '',
    phone: req.body.phone || '',
    email: req.body.email || '',
    whatsapp: req.body.whatsapp || '',
    address: req.body.address || '',
    mapsEmbedUrl: req.body.mapsEmbedUrl || ''
  };
  res.render('settings', { data: settingsStore, saved: true });
});

module.exports = router;

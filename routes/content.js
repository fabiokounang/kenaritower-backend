const router = require('express').Router();
const auth = require('../middlewares/auth');

// dummy in-memory store
// structure: { en: { hero: { headline: '...', tagline: '...' } }, id: {...} }
const contentStore = { en: {}, id: {} };

router.get('/', auth, (req, res) => {
  const lang = (req.query.lang === 'id') ? 'id' : 'en';
  res.render('content', { lang, content: contentStore[lang] || {}, saved: false });
});

router.post('/', auth, (req, res) => {
  const lang = (req.body.lang === 'id') ? 'id' : 'en';
  const section = String(req.body.section || '').trim();
  const key = String(req.body.key || '').trim();
  const value = String(req.body.value || '').trim();

  if (section && key) {
    contentStore[lang] = contentStore[lang] || {};
    contentStore[lang][section] = contentStore[lang][section] || {};
    contentStore[lang][section][key] = value;
  }

  res.render('content', { lang, content: contentStore[lang] || {}, saved: true });
});

module.exports = router;

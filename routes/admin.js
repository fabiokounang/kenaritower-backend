const router = require("express").Router();
const { requireAuthJWT } = require("../controllers/auth");
const { renderHotelProfile, saveHotelProfile } = require("../controllers/hotel");
const { renderHomeCMS, saveHomeCMS } = require("../controllers/home");
const { renderHeroImages, saveHeroImages, addHeroImage, removeHeroImage } = require("../controllers/hero");
const { renderGallery, saveGallery } = require("../controllers/gallery");
const { renderFacilities, saveFacilities } = require("../controllers/facilities");

const { heroUpload, galleryUpload } = require("../utils/uploader");

router.get("/", requireAuthJWT, (req, res) => res.render("admin/dashboard", { user: req.user }));


router.get("/hotel", requireAuthJWT, renderHotelProfile);
router.post("/hotel", requireAuthJWT, saveHotelProfile);

router.get("/home", requireAuthJWT, renderHomeCMS);
router.post("/home", requireAuthJWT, saveHomeCMS);

router.get("/hero-images", requireAuthJWT, renderHeroImages);
router.post("/hero-images", requireAuthJWT, heroUpload.any(), saveHeroImages);
router.post("/hero-images/add", requireAuthJWT, heroUpload.single("image"), addHeroImage);
router.post("/hero-images/:id/delete", requireAuthJWT, removeHeroImage);



router.get("/gallery", requireAuthJWT, renderGallery);
router.post("/gallery", requireAuthJWT,galleryUpload.any(), saveGallery);

router.get("/facilities", requireAuthJWT, renderFacilities);
router.post("/facilities", requireAuthJWT, saveFacilities);

module.exports = router;

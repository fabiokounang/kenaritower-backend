const router = require("express").Router();
const { requireAuthJWT } = require("../controllers/auth");
const { renderHotelProfile, saveHotelProfile } = require("../controllers/hotel");
const { renderHomeCMS, saveHomeCMS } = require("../controllers/home");
const { renderHeroImages, saveHeroImages, addHeroImage, removeHeroImage } = require("../controllers/hero");
const { renderGalleryList, renderGalleryDetail, saveGalleryDetail, addGalleryItem, removeGalleryItem } = require("../controllers/gallery");
const { renderServices, addService, saveServices, deleteService, apiServices } = require("../controllers/services");
const {
  renderFacilities,
  addFacility,
  saveFacilities,
  deleteFacility,
} = require("../controllers/facilities");
const { renderAbout, saveAbout } = require("../controllers/about");

const { heroUpload, galleryUpload, aboutUpload } = require("../utils/uploader");

router.get("/", requireAuthJWT, (req, res) => res.render("admin/dashboard", { user: req.user }));

router.get("/hotel", requireAuthJWT, renderHotelProfile);
router.post("/hotel", requireAuthJWT, saveHotelProfile);

router.get("/home", requireAuthJWT, renderHomeCMS);
router.post("/home", requireAuthJWT, saveHomeCMS);

router.get("/about", requireAuthJWT, renderAbout);
router.post(
  "/about",
  requireAuthJWT,
  aboutUpload.single("image"),
  saveAbout
);


router.get("/hero-images", requireAuthJWT, renderHeroImages);
router.post("/hero-images", requireAuthJWT, heroUpload.any(), saveHeroImages);
router.post("/hero-images/add", requireAuthJWT, heroUpload.single("image"), addHeroImage);
router.post("/hero-images/:id/delete", requireAuthJWT, removeHeroImage);

router.get("/gallery", requireAuthJWT, renderGalleryList);
router.post("/gallery/add", requireAuthJWT, galleryUpload.single("image"), addGalleryItem);
router.get("/gallery/:id", requireAuthJWT, renderGalleryDetail);
router.post("/gallery/:id", requireAuthJWT, galleryUpload.single("image"), saveGalleryDetail);
router.post("/gallery/:id/delete", requireAuthJWT, removeGalleryItem);

// ✅ Facilities CMS
router.get("/facilities", requireAuthJWT, renderFacilities);
router.post("/facilities/add", requireAuthJWT, addFacility);
router.post("/facilities", requireAuthJWT, saveFacilities);
router.post("/facilities/:id/delete", requireAuthJWT, deleteFacility);

router.get("/services", requireAuthJWT, renderServices);
router.post("/services/add", requireAuthJWT, addService);
router.post("/services", requireAuthJWT, saveServices);
router.post("/services/:id/delete", requireAuthJWT, deleteService);

module.exports = router;

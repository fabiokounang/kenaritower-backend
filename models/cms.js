"use strict";

const { getPool } = require("../utils/db");

async function getPublicCMS() {
  const pool = getPool();
  const [hotelRows] = await pool.query(
    `SELECT hotel_name, tagline, phone, whatsapp, address, maps_embed_url, instagram, footer_about, updated_at
     FROM hotel_profile
     WHERE id = ?
     LIMIT ?`,
    [1, 1]
  );

  const [homeRows] = await pool.query(
    `SELECT hero_title, hero_subtitle, cta_text, cta_link, updated_at
     FROM home
     WHERE id = ?
     LIMIT ?`,
    [1, 1]
  );

  const hotel = hotelRows[0] || null;
  const home = homeRows[0] || null;

  const [heroImages] = await pool.query(
    `SELECT image_path, alt_text
    FROM hero_images
    WHERE is_active = ?
    ORDER BY sort_order ASC
    LIMIT ?`,
    [1, 10]
  );

  const [galleryRows] = await pool.query(
    `SELECT id, image_path, alt_text, overlay_label, title, description
    FROM gallery_items
    WHERE is_active = ?
    ORDER BY sort_order ASC
    LIMIT ?`,
    [1, 200]
  );

  // ✅ FACILITIES
  const [facilityRows] = await pool.query(
    `SELECT icon, title, subtitle
     FROM facilities
     WHERE is_active = ?
     ORDER BY sort_order ASC
     LIMIT ?`,
    [1, 50]
  );

  // ✅ SERVICES
  const [serviceRows] = await pool.query(
    `SELECT title, description
     FROM services
     WHERE is_active = ?
     ORDER BY sort_order ASC
     LIMIT ?`,
    [1, 100]
  );

  const [about] = await pool.query(
    `SELECT title, description, image_path
     FROM about LIMIT ?`,
    [1]
  );

  return {
    site: {
      hotelName: hotel?.hotel_name || "",
      tagline: hotel?.tagline || "",
      phone: hotel?.phone || "",
      email: hotel?.email || "",
      whatsapp: hotel?.whatsapp || "",
      address: hotel?.address || "",
      mapsEmbedUrl: hotel?.maps_embed_url || "",
      instagram: hotel?.instagram || "",
      footerAbout: hotel?.footer_about || ""
    },
    home: {
      heroTitle: home?.hero_title || "",
      heroSubtitle: home?.hero_subtitle || "",
      ctaText: home?.cta_text || "",
      ctaLink: home?.cta_link || ""
    },
    hero: {
      images: heroImages.map(i => ({
        imageUrl: i.image_path,
        alt: i.alt_text
      }))
    },
    gallery: galleryRows.map(g => ({
        id: g.id,
        imageUrl: g.image_path,
        alt: g.alt_text,
        overlay: g.overlay_label,
        title: g.title,
        description: g.description
    })),
    // ✅ NEW
    facilities: facilityRows.map(f => ({
      icon: f.icon,
      title: f.title,
      subtitle: f.subtitle
    })),
    about: {
      title: about[0].title,
      description: about[0].description,
      imageUrl: about[0].image_path
    },
    // ✅ NEW
    services: serviceRows.map(s => ({
      title: s.title,
      description: s.description
    })),
    meta: {
      updatedAt: home?.updated_at || hotel?.updated_at || null
    }
  };
}

module.exports = { getPublicCMS };


module.exports = { getPublicCMS };

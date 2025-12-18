"use strict";

const { getPool } = require("../utils/db");

async function getPublicCMS() {
  const pool = getPool();
  const [hotelRows] = await pool.query(
    `SELECT hotel_name, tagline, phone, whatsapp, address, maps_embed_url, instagram, updated_at
     FROM cms_hotel_profile
     WHERE id = ?
     LIMIT ?`,
    [1, 1]
  );

  const [homeRows] = await pool.query(
    `SELECT hero_title, hero_subtitle, cta_text, cta_link, updated_at
     FROM cms_home
     WHERE id = ?
     LIMIT ?`,
    [1, 1]
  );

  const hotel = hotelRows[0] || null;
  const home = homeRows[0] || null;

  const [heroImages] = await pool.query(
    `SELECT image_path, alt_text
    FROM cms_hero_images
    WHERE is_active = ?
    ORDER BY sort_order ASC
    LIMIT ?`,
    [1, 10]
  );

  const [galleryRows] = await pool.query(
    `SELECT id, image_path, alt_text, overlay_label, title, description
    FROM cms_gallery_items
    WHERE is_active = ?
    ORDER BY sort_order ASC
    LIMIT ?`,
    [1, 200]
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
    gallery: {
      items: galleryRows.map(g => ({
        id: g.id,
        imageUrl: g.image_path,
        alt: g.alt_text,
        overlay: g.overlay_label,
        title: g.title,
        description: g.description
      }))
    },
    meta: {
      updatedAt: home?.updated_at || hotel?.updated_at || null
    }
  };
}

module.exports = { getPublicCMS };


module.exports = { getPublicCMS };

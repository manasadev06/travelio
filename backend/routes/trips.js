import express from "express";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/trips
 * Upload a trip with day-wise itinerary
 */
router.post("/", auth, async (req, res) => {
  const {
    title,
    destination,
    duration,
    description,
    cover_image_url,
    trip_days,
  } = req.body;

  // ---- BASIC VALIDATION ----
  if (
    !title ||
    !destination ||
    !duration ||
    !description ||
    !Array.isArray(trip_days) ||
    trip_days.length === 0
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    /* 1️⃣ INSERT INTO trips */
    const [tripResult] = await conn.query(
      `
      INSERT INTO trips
      (creator_id, title, destination, duration, description, cover_image_url)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id, // creator_id from JWT
        title,
        destination,
        duration,
        description,
        cover_image_url || null,
      ]
    );

    const tripId = tripResult.insertId;

    /* 2️⃣ INSERT trip_days */
    for (const day of trip_days) {
      if (!day.title || !day.content) {
        throw new Error("Invalid day data");
      }

      await conn.query(
        `
        INSERT INTO trip_days
        (trip_id, day_number, title, content, image_urls)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          tripId,
          day.day_number,
          day.title,
          day.content,
          JSON.stringify(day.image_urls || []),
        ]
      );
    }

    await conn.commit();
    res.status(201).json({
      message: "Trip uploaded successfully",
      trip_id: tripId,
    });
  } catch (err) {
    await conn.rollback();
    console.error("UPLOAD TRIP ERROR:", err);
    res.status(500).json({ message: "Failed to upload trip" });
  } finally {
    conn.release();
  }
});

export default router;

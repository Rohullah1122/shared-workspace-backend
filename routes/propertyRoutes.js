const express = require("express");
const router = express.Router();
const pool = require("../db");

// CREATE PROPERTY
router.post("/", async (req, res) => {
  try {
    const {
      owner_id,
      title,
      description,
      address,
      city,
      sqft,
      garage,
      transport,
      building_image
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties 
        (owner_id, title, description, address, city, sqft, garage, transport, building_image)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
      [
        owner_id,
        title,
        description,
        address,
        city,
        sqft,
        garage,
        transport,
        building_image
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL PROPERTIES
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM properties");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch properties error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE PROPERTY
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM properties WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Fetch property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PROPERTY
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      sqft,
      garage,
      transport,
      building_image
    } = req.body;

    const result = await pool.query(
      `UPDATE properties
       SET title=$1, description=$2, address=$3, city=$4,
           sqft=$5, garage=$6, transport=$7, building_image=$8
       WHERE id=$9
       RETURNING *`,
      [
        title,
        description,
        address,
        city,
        sqft,
        garage,
        transport,
        building_image,
        req.params.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE PROPERTY
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM properties WHERE id=$1", [req.params.id]);
    res.json({ message: "Property deleted" });
  } catch (err) {
    console.error("Delete property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

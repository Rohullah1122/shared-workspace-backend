const express = require("express");
const router = express.Router();
const pool = require("../db");

// CREATE PROPERTY
router.post("/", async (req, res) => {
  try {
    const { owner_id, title, description, address, city, price_per_day } = req.body;

    const result = await pool.query(
      `INSERT INTO properties (owner_id, title, description, address, city, price_per_day)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [owner_id, title, description, address, city, price_per_day]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL PROPERTIES
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM properties");
  res.json(result.rows);
});

// UPDATE PROPERTY
router.put("/:id", async (req, res) => {
  try {
    const { title, description, address, city, price_per_day } = req.body;

    const result = await pool.query(
      `UPDATE properties
       SET title=$1, description=$2, address=$3, city=$4, price_per_day=$5
       WHERE id=$6
       RETURNING *`,
      [title, description, address, city, price_per_day, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE PROPERTY
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM properties WHERE id=$1", [req.params.id]);
  res.json({ message: "Property deleted" });
});

module.exports = router;

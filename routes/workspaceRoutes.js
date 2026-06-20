const express = require("express");
const router = express.Router();
const pool = require("../db");

// CREATE WORKSPACE
router.post("/", async (req, res) => {
  try {
    const { property_id, name, capacity, amenities, price_per_hour } = req.body;

    const result = await pool.query(
      `INSERT INTO workspaces (property_id, name, capacity, amenities, price_per_hour)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [property_id, name, capacity, amenities, price_per_hour]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create workspace error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL WORKSPACES
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM workspaces");
  res.json(result.rows);
});

// UPDATE WORKSPACE
router.put("/:id", async (req, res) => {
  try {
    const { name, capacity, amenities, price_per_hour } = req.body;

    const result = await pool.query(
      `UPDATE workspaces
       SET name=$1, capacity=$2, amenities=$3, price_per_hour=$4
       WHERE id=$5
       RETURNING *`,
      [name, capacity, amenities, price_per_hour, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update workspace error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE WORKSPACE
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM workspaces WHERE id=$1", [req.params.id]);
  res.json({ message: "Workspace deleted" });
});

module.exports = router;

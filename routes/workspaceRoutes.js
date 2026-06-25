const express = require("express");
const router = express.Router();
const pool = require("../db");

// CREATE WORKSPACE
router.post("/", async (req, res) => {
  try {
    const {
      property_id,
      name,
      capacity,
      price_per_hour,
      smoking,
      availability,
      term,
      type,
      room_image
    } = req.body;

    const result = await pool.query(
      `INSERT INTO workspaces 
      (property_id, name, capacity, price_per_hour, smoking, availability, term, type, room_image)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        property_id,
        name,
        capacity,
        price_per_hour,
        smoking,
        availability,
        term,
        type,
        room_image
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create workspace error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// GET ALL WORKSPACES
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM workspaces ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch workspaces error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE WORKSPACE
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM workspaces WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Fetch workspace error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE WORKSPACE
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      capacity,
      price_per_hour,
      smoking,
      availability,
      term,
      type,
      room_image
    } = req.body;

    const result = await pool.query(
      `UPDATE workspaces
       SET name=$1, capacity=$2, price_per_hour=$3,
           smoking=$4, availability=$5, term=$6, type=$7, room_image=$8
       WHERE id=$9
       RETURNING *`,
      [
        name,
        capacity,
        price_per_hour,
        smoking,
        availability,
        term,
        type,
        room_image,
        req.params.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update workspace error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE WORKSPACE
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM workspaces WHERE id=$1", [req.params.id]);
    res.json({ message: "Workspace deleted" });
  } catch (err) {
    console.error("Delete workspace error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

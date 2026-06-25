// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Insert a user with just a name
router.post("/add-name", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.json({
      message: "User inserted successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

module.exports = router;

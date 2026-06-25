const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, phone, password, role, security_question, security_answer } = req.body;

    if (!full_name || !email || !password || !role || !security_question || !security_answer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const answerHash = await bcrypt.hash(security_answer.toLowerCase(), 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, security_question, security_answer_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, full_name, email, role`,
      [full_name, email, phone, passwordHash, role, security_question, answerHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/recover/start", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      "SELECT id, security_question FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found" });
    }

    res.json({
      user_id: result.rows[0].id,
      security_question: result.rows[0].security_question
    });

  } catch (err) {
    console.error("Recover start error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/recover/verify", async (req, res) => {
  try {
    const { user_id, answer } = req.body;

    const result = await pool.query(
      "SELECT security_answer_hash FROM users WHERE id=$1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(answer.toLowerCase(), result.rows[0].security_answer_hash);

    if (!match) {
      return res.status(401).json({ message: "Incorrect answer" });
    }

    // Create short‑lived reset token
    const resetToken = jwt.sign(
      { user_id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({ resetToken });

  } catch (err) {
    console.error("Recover verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/recover/reset", async (req, res) => {
  try {
    const { resetToken, new_password } = req.body;

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    const hash = await bcrypt.hash(new_password, 10);

    await pool.query(
      "UPDATE users SET password_hash=$1 WHERE id=$2",
      [hash, decoded.user_id]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Recover reset error:", err);
    res.status(500).json({ message: "Invalid or expired reset token" });
  }
});

 


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

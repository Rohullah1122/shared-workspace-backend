const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");

const app = express();

// FIXED CORS — only ONE declaration
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// FIXED JSON LIMIT (Base64 images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/workspaces", workspaceRoutes);

app.get("/", (req, res) => {
  res.send("Shared Workspace API is running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

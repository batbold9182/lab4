const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Serve images from public/images
app.use("/images", express.static("public/images"));

// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/game")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Character model (was Enemy)
const Hero = mongoose.model(
  "Hero",
  new mongoose.Schema({
    name: String,
    profile: String,
    type: String,
    stats: { hp: Number, agi: Number, str: Number, int: Number },
    icons: {
      hp: String,
      agi: String,
      str: String,
      int: String,
    }
  }),
  "heroes" // points to 'heroes' collection
);
const Character = mongoose.model(
  "Character",
  new mongoose.Schema({
    name: String,
    profile: String, // URL to image
    
    type: String,
    stats: { hp: Number, agi: Number, str: Number, int: Number },
    icons: {
      hp: String,
      agi: String,
      str: String,
      int: String,
    }
  }),
  "characters" // collection name
);
const Equipment = mongoose.model(
  "Equipment",
  new mongoose.Schema({
    name: String,
    type: String,
    stats: { hp: Number, agi: Number, str: Number, int: Number },
    profile: String,
    icons: {
      hp: String,
      agi: String,
      str: String,
      int: String,
    }
  }),
  "equipment" // collection name
);

// GET all characters
app.get("/heroes", async (req, res) => {
  try {
    const heroes = await Hero.find();
    res.json(heroes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/characters", async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/equipment", async (req, res) => {
  try {
    const items = await Equipment.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single character by ID
app.get("/characters/:id", async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.json(character);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

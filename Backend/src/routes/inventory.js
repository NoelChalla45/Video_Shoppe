import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ── GET ALL DVDS (Catalog View) ───────────────────────────────
router.get("/", async (req, res) => {
  try {
    const dvds = await prisma.inventory.findMany({
      orderBy: { id: "asc" }, 
    });
    res.json(dvds);
  } catch (err) {
    console.error("Error fetching all DVDs:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// ── GET SINGLE DVD BY ID (Detail View) ────────────────────────
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const dvd = await prisma.inventory.findUnique({
      where: { 
        id: parseInt(id)
      },
    });

    if (!dvd) {
      return res.status(404).json({ error: "DVD not found in database" });
    }

    res.json(dvd);
  } catch (err) {
    console.error(`Error fetching DVD ID ${id}:`, err);
    res.status(500).json({ error: "Server error fetching movie details" });
  }
});

// ── ADD NEW DVD ───────────────────────────────────────────────
router.post("/add", async (req, res) => {
  const { name, price, category, stock, year, rating, director, cast, image, description } = req.body;

  try {
    const dvd = await prisma.inventory.create({
      data: {
        name,
        price: Number(price),
        category,
        stock: Number(stock) || 0,
        year: year ? Number(year) : null,
        rating: rating ? String(rating) : null, 
        director: director || null,
        cast: cast || null,
        image,
        description: description || null,
      },
    });

    res.status(201).json(dvd);
  } catch (err) {
    console.error("Error creating DVD:", err);
    res.status(400).json({ error: "Error adding DVD" });
  }
});

// ── UPDATE DVD ────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id); 

  try {
    const updated = await prisma.inventory.update({
      where: { id }, 
      data: {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        stock: req.body.stock !== undefined ? parseInt(req.body.stock) : undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating DVD:", err);
    res.status(404).json({ error: "DVD not found or update failed" });
  }
});

// ── DELETE DVD ────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await prisma.inventory.delete({
      where: { id: parseInt(req.params.id) }, 
    });
    res.json({ message: "DVD removed" });
  } catch (err) {
    console.error("Error deleting DVD:", err);
    res.status(404).json({ error: "DVD not found" });
  }
});

export default router;
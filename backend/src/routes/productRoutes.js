import express from "express";
import pool from "../db.js";


const router = express.Router();

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Failed to fetch products:", error.message);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

// ✅ Add new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const result = await pool.query(
      "INSERT INTO products (name, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
});

// ✅ Update product
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const result = await pool.query(
      "UPDATE products SET name=$1, description=$2, price=$3, image=$4 WHERE id=$5 RETURNING *",
      [name, description, price, image, req.params.id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product", error: error.message });
  }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [
      req.params.id,
    ]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete product", error: error.message });
  }
});

export default router;


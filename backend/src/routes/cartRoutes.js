// src/routes/cartRoutes.js
import express from "express";
const router = express.Router();

let cart = [];

// Add to cart
router.post("/", (req, res) => {
  const { id, name, price, image, quantity } = req.body;
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name, price, image, quantity });
  }
  res.json(cart);
});

// Get cart
router.get("/", (req, res) => {
  res.json(cart);
});

// Remove one quantity
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const product = cart.find((item) => item.id == id);

  if (!product) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart = cart.filter((item) => item.id != id);
  }

  res.json(cart);
});

// Remove full product (all quantities)
router.delete("/:id/all", (req, res) => {
  const { id } = req.params;
  cart = cart.filter((item) => item.id != id);
  res.json(cart);
});

// ✅ Clear full cart
router.delete("/", (req, res) => {
  cart = []; // पूरे cart को empty कर दो
  res.json({ message: "Cart cleared", cart });
});

export default router;

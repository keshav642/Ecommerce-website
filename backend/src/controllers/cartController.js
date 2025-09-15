import pool from "../db.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM cart WHERE user_id=$1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  // ✅ Debug logs
  console.log("=== ADD TO CART CALLED ===");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  try {
    const userId = req.user.id;
    const { id, name, price, image, description } = req.body;

    // Check if product already in cart
    const existing = await pool.query(
      "SELECT * FROM cart WHERE user_id=$1 AND product_id=$2",
      [userId, id]
    );

    if (existing.rows.length > 0) {
      // Increment quantity
      await pool.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id=$1 AND product_id=$2",
        [userId, id]
      );
    } else {
      // Insert new product
      await pool.query(
        "INSERT INTO cart (user_id, product_id, name, price, image, description, quantity) VALUES ($1,$2,$3,$4,$5,$6,1)",
        [userId, id, name, price, image, description]
      );
    }

    res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// Remove one item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const existing = await pool.query(
      "SELECT * FROM cart WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    if (existing.rows.length === 0)
      return res.status(404).json({ message: "Product not in cart" });

    if (existing.rows[0].quantity > 1) {
      await pool.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE user_id=$1 AND product_id=$2",
        [userId, productId]
      );
    } else {
      await pool.query(
        "DELETE FROM cart WHERE user_id=$1 AND product_id=$2",
        [userId, productId]
      );
    }

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// Remove all of a product
export const removeAllOfProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    await pool.query(
      "DELETE FROM cart WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    res.json({ message: "All items of product removed" });
  } catch (err) {
    console.error("Error removing all of product:", err);
    res.status(500).json({ message: "Failed to remove product" });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query("DELETE FROM cart WHERE user_id=$1", [userId]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

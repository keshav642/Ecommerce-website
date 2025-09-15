import db from "../db.js"; // ✅ ध्यान रहे सही path use करना है

export const getProducts = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await db.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const result = await db.query(
      "INSERT INTO products (name, price, image, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, image, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await db.query("DELETE FROM products WHERE id = $1", [productId]);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

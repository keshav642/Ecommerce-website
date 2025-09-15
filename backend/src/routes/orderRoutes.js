import express from "express";
const router = express.Router();

let orders = []; // ✅ यहाँ :any[] हटाया

// Place an order
router.post("/", (req, res) => {
  const { name, email, mobile, address, pincode, city, paymentMethod, product, products } = req.body;

  if (!name || !mobile || !address || !pincode || !city || !paymentMethod || (!product && !products)) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const newOrder = {
    id: orders.length + 1,
    name,
    email: email || "",
    mobile,
    address,
    pincode,
    city,
    paymentMethod,
    product: product || undefined,
    products: products || undefined,
    status: "Pending",
    date: new Date(),
  };

  orders.push(newOrder);

  res.json({ message: "Order placed successfully ✅", order: newOrder });
});

// Get all orders
router.get("/", (req, res) => {
  res.json(orders);
});

// Get order by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const order = orders.find((o) => o.id == id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// Update order status
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find((o) => o.id == id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status || order.status;
  res.json({ message: "Order status updated ✅", order });
});

// Delete an order
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex((o) => o.id == id);
  if (index === -1) return res.status(404).json({ message: "Order not found" });

  orders.splice(index, 1);
  res.json({ message: "Order deleted successfully ✅" });
});

export default router;

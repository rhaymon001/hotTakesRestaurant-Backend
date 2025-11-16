import Order from "../model/Order.js";

// 🔹 Fetch all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Fetch orders for a specific user (Customer)
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.foodId", "name price imageUrl");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Fetch a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.foodId", "name price imageUrl");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Optional: Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllOrders, getUserOrders, getOrderById, updateOrderStatus };

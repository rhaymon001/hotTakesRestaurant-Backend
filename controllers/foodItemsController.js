import FoodItem from "../model/FoodItem.js";

const getAllfoods = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    if (!foodItems.length) {
      return res.status(204).json([]);
    }

    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createFoodItem = async (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "no name and price!" });
  }

  const imageUrl = req.file?.path;
  try {
    const newFood = await FoodItem.create({
      name,
      price,
      description,
      imageUrl,
    });

    res.status(201).json(newFood);
  } catch (error) {
    console.error("Error from createFood controller:", JSON.stringify(error));
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateFoodItem = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "food id required!" });
  }

  const foodId = req.params.id;
  const { name, price, description } = req.body;
  const updateData = {
    name,
    price,
    description,
  };
  console.log(req.body);

  if (req.file) {
    updateData.imageUrl = req.file.path;
  }

  try {
    const updatedFood = await FoodItem.findByIdAndUpdate(foodId, updateData, {
      new: true,
    });
    if (!updatedFood) {
      return res.status(404).json({ message: "food item not found" });
    }
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFoodItem = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "food id required!" });
  }

  const foodId = req.params.id;

  try {
    const deletedFoodItem = await FoodItem.findByIdAndDelete(foodId);
    if (!deletedFoodItem) {
      return res.status(404).json({ message: "food item not found!" });
    }
    res.json(deletedFoodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllfoods, createFoodItem, updateFoodItem, deleteFoodItem };

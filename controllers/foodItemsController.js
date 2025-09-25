import FoodItem from "../model/FoodItem.js";

const getAllfoods = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    if (!foodItems.length) {
      return res.status(204).json({ message: "no food items available" });
    }

    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createFoodItem = async (req, res) => {
  const { name, price, description, category } = req.body;
  if (!name || !price) {
    return res.status(401).json({ message: "no name and price!" });
  }

  const imageUrl = req.file?.path;

  try {
    const newFood = await FoodItem.create({
      name,
      price,
      description,
      category,
      imageUrl,
    });

    res.status(201).json(newFood);
  } catch (error) {
    console.log(error.message);
    console("error from createFood controller");
  }
};

const updateFoodItem = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "food id required!" });
  }

  const foodId = req.params.id;

  try {
    const { name, price, description, category, imageUrl } = req.body;
    const updatedFood = await FoodItem.findByIdAndUpdate(
      foodId,
      { name, price, description, category, imageUrl },
      { new: true }
    );
    if (!updatedFood) {
      return res.status().json({ message: "food item not found" });
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

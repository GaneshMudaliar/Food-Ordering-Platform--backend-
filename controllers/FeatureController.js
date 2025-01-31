const Food = require("../models/Food");
const User = require("../models/User");


// add item to cart

const addToCart = async(req,res) => {
  try {

    const userId = req.params.id;

    const { id, name, price, rating, image, quantity } = req.body;

    let existingItem = await Food.findOne({ id, userId: userId });

    if (existingItem) {
      let updatedItem = await Food.findOneAndUpdate(
        { id, userId },
        {
          $set: {
            quantity: existingItem.quantity + 1,
            totalPrice: existingItem.price * (existingItem.quantity + 1),
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      if (!updatedItem) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to add to cart" });
      }

      return res.status(200).json({ success: true, message: "Added to cart" });
    }

    let newFood = await Food.create({
      id,
      name,
      price,
      rating,
      image,
      quantity,
      userId,
      totalPrice: price * quantity,
    });

    const savedFood = await newFood.save();

    let user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          cartItems: savedFood._id,
        },
      }
    );

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to add to cart" });
    }

    return res.status(200).json({ success: true, message: "Added to cart" });



  } catch (err) {
    res.status(500).json({
      message : err.message
    })
  }
}


// get items


const getCart = async (req, res) => {

  try {
  const userId = req.params.id;

    const cartItems = await Food.find({ userId });

    if (!cartItems) {
      return res
        .status(400)
        .json({ success: false, message: "No items found" });
    }

    return res.status(200).json({
       success: true,
        cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// emove item fom carts

const removeFromCart = async (req, res) => {

  try {
  const id = req.params.id;

    let food = await Food.findOneAndDelete({ _id: id });

    if (!food) {
      return res
        .status(400)
        .json({ success: false, 
          message: "Food not found" });
    }
    return res
      .status(200)
      .json({ success: true, 
        message: "Food Removed from cart" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// increment qty

const incrementQuantity = async (req, res) => {

  try {
  const id = req.params.id;

    let food = await Food.findOneAndUpdate(
      { _id: id },
      [
        {
          $set: {
            quantity: { $add: ["$quantity", 1] },
            totalPrice: { $multiply: ["$price", { $add: ["$quantity", 1] }] },
          },
        },
      ],
      {
        upsert: true,
        new: true,
      }
    );

    if (!food) {
      return res
        .status(400)
        .json({ success: false, 
          message: "Food not found" });
    }

    return res
      .status(200)
      .json({ success: true, 
        message: "Food quantity incremented", food });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// decrement qty

const decrementQuantity = async (req, res) => {

  try {
  const id = req.params.id;

    let food = await Food.findOneAndUpdate(
      { _id: id, quantity: { $gt: 0 } },
     [ {
        $set: {
          quantity: { $subtract: ["$quantity", 1] },
          totalPrice: { $subtract: ["$totalPrice", "$price"] },
        },
      }],
      {
        upsert: true,
        new: true,
      }
    );

    if (!food) {
      return res.status(400).json({
        success: false,
        message: "Food not found or quantity already at the maximum",
      });
    }
    return res
      .status(200)
      .json({ success: true, 
        message: "Food quantity decremented", food });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// clear cart

const clearCart = async (req, res) => {
  const userId = req.id;

  try {
    const deletedItems = await Food.deleteMany({ userId });
    const deletedList = await User.findOneAndUpdate(
      { _id: userId },
      {
        cartItems: [],
      }
    );

    if (!deletedItems) {
      return res
        .status(400)
        .json({ success: false, 
          message: "Failed to clear cart" });
    }

    return res.status(200).json({ success: true,
       message: "Order Confirmed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  decrementQuantity,
  incrementQuantity,
  clearCart
}
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartItems: {
    type: Array,
    default: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
      },
    ],
  },

});


const User = mongoose.model("user", userSchema);
module.exports = User;


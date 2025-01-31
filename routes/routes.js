const express = require("express");
const router = express.Router();

const {signup , login , logout ,getUser} = require( "../controllers/AuthController");
const verifyToken = require("../middlewares/verifyToken");

const {addToCart,getCart,removeFromCart,incrementQuantity,decrementQuantity,clearCart} = require("../controllers/FeatureController");


// auth routes

router.post("/signup" , signup);
router.post("/login" , login);
router.get("/logout"  , logout);
router.get("/getuser" , verifyToken , getUser);

// feature routes

router.post("/add-to-cart/:id", addToCart)
router.get("/get-cart/:id", getCart)
router.delete("/remove-from-cart/:id", removeFromCart)
router.put("/increment-quantity/:id", incrementQuantity)
router.put("/decrement-quantity/:id", decrementQuantity)
router.get("/clear-cart",verifyToken,clearCart)



module.exports = router;
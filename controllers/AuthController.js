const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const signup = async (req,res) => {
  try {

    const {name , email , password} = req.body;

    let user = await User.findOne({email});

    // check existing user

    if(user) {
      return  res.status(400).json({
        message : "PLease Login "
      })
    }

    // to secure password

    const hashPassword = await  bcrypt.hash(password , 10);

    user = await User.create({
      name,
      email,
      password : hashPassword
    })

    res.status(201).json({
      message :"Account Created"
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message : error.message
    })
  }
}


// login 

const login = async(req,res) => {
  try {
  const {email,password} = req.body;

  // check existing user
  const user = await User.findOne({email});

  if(!email) {
    return res.status(400).json({
      message : "Please signup"
    })
  }

//  check password

const isMatch = await bcrypt.compare(password , user.password);

if(!isMatch) {
  return res.status(400).json({
    message : "invalid input"
  })
}

const tokenData = {
  userId : user._id
}


 const token = await jwt.sign(tokenData, process.env.JWT_SECRET,
{
  expiresIn : "1h",
})

res.cookie("token" , token , {
  httpOnly : true,
  secure : true,
  sameSite : "none"
}).status(200).json({
  message : "Login Successfully"

})




  } catch (err) {
    console.log(err);
    res.status(500).json({
      message : "Internal ERROR"
    })
  }
}


//  logout

const logout = async(req,res) => {
  try {
    res.clearCookie("token").json({
      message:"Logout Successfully"
    })
   
  } catch (err) {
return res.status(500).json({
  message: err.message
})
  }
}

//  getUser

const getUser = async(req,res) => {
  try {
   const reqId = req.id;

   const user = await User.findById(reqId).select("-password");

   if(!user) {
    res.status(400).json({
      message : "User not found"
    })
   }

   return res.status(200).json({
    message: "User found",
    user
   })

  } catch (err) {
    return res.status(500).json({
      message : error.message
    })
  }
}


module.exports = {
  signup,
  login,
  logout,
  getUser
}
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


//  sign up

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



// Rest password route


const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const generateOtp = Math.floor(Math.random() * 10000); // Generate a 4 digit OTP

    let user = User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Please Signup" });
    }

    
       var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: process.env.Mail_User,
        pass: process.env.Mail_Pass
     }
    });

    const info = await transporter.sendMail({
      from: process.env.Email, // sender address
      to: email, // list of receivers
      subject: "New Otp has been generated", // Subject line
      html: `<h3>Your Generated Otp is : <i>${generateOtp}</i></h3>`, // html body
    });

    if (info.messageId) {
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            otp: generateOtp,
          },
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Otp has been sent to your email" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Otp Route



const verifyOtp = async (req, res) => {
  const { otp, newPassword } = req.body;

  try {

    //   to secure new password

    const securePassword = await bcrypt.hash(newPassword, 10);

    let user = await User.findOneAndUpdate(
      { otp },
      {
        $set: {
          password: securePassword,
          otp: 0,
        },
      }
    );

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Otp" });
    }

    return res.status(200).json({ success: true, message: "Password Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  signup,
  login,
  logout,
  getUser,
  resetPassword, 
  verifyOtp
}


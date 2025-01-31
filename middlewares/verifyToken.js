const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next) => {
  try {

    const token = req.cookies.token;
    // const token = req.header('Authorization');

    if(!token) {
      return res.status(400).json({
        message : "invalid input"
      })
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET);

    req.id = decoded.userId;
    next();

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message : "Internal server"
    })
  }
}


module.exports = verifyToken
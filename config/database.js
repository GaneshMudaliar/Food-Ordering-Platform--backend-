const mongoose = require("mongoose");

const dbConnect = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connectedsuccessfully")

  } catch (err) {

    console.log(err);

  }
}

module.exports = dbConnect;
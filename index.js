const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/routes");




//  connect to db

dbConnect();

//  middlewares

app.use(express.json());
app.use(cors());
app.use(cookieParser())



// routes

app.use("/api" , routes)


app.listen(PORT , () => {
  console.log("Server listen port" , PORT);


})


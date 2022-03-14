const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const  path  = require("path");
const auth = require("./auth");
const condidate = require('./condidate')
const mongoose = require("mongoose");
const isAuthenticatedUser = require('./midleware/auth')
const cors = require('cors')

if(!process.env.NODE_PRODUCTION){
  require("dotenv").config({ path: "./.env" });
}
/*********************************************************** */


process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

/*********************************************************** */

const app = express();
app.use(cors({credentials:true,origin:process.env.HOST}));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

/******************************************** */
// CONNECTING TO MONGO DATABASE AT ATLAS
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) =>
    console.log("MONGO DB CONNECTED WITH SERVER ", data.connection.host)
  )
  .catch((e) => {
    console.log(e.message);
    server.close(()=>{
      process.exit(1);
    })
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on ${process.env.HOST}`);
});

/*********************************************************** */

process.on("unhandledRejection", (err) => {
  console.log(`Error:`, err);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});

app.use("/api/auth", auth);
app.use("/api/condidates",isAuthenticatedUser,condidate);

app.use(express.static(path.join(__dirname,"../client/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../client/build/index.html"))
})


module.exports = app;

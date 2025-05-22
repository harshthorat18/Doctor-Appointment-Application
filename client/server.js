const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const path = require("path")

//dotenv conig
dotenv.config();


//mongodb connection
connectDB();


//rest obejct
const app = express();

//middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(moragan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRout"));
app.use('/api/v1/admin',require('./routes/adminRouters'))
app.use('/api/v1/doctor',require('./routes/doctorRouters'))

app.use(express.json());

//STATIC FILE
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*' , function(req,res){
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

//port
const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});





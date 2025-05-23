const express = require("express");
const colors = require("colors");
const morgan = require("morgan"); // fix typo here
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev")); // fixed typo

// routes
app.use("/api/v1/user", require("./routes/userRout"));
app.use("/api/v1/admin", require("./routes/adminRouters"));
app.use("/api/v1/doctor", require("./routes/doctorRouters"));

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, "client", "build")));

// The "catchall" handler for SPA routing
app.get("/:wildcard*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// port
const port = process.env.PORT || 8080;

// listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${port}`
      .bgCyan.white
  );
});

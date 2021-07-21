const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const quesRoutes = require("./routes/quesRoutes");
const ansRoutes = require("./routes/ansRoutes");
const searchRoutes = require("./routes/searchRoutes");

const { checkUser } = require('./middleware/authMiddleware');

// Create an Express Application
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set the view engine to EJS
app.set("view engine", "ejs");

// Connect ot MongoDB Database
mongoose.set('runValidators', true); 

mongoose
  .connect("mongodb://192.168.29.221:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    (res) => {
      console.log("Connected to database");
    },
    (err) => console.log(err)
  );

// Starting the server
app.listen(8080, () => {
  console.log("Listening on port 8080");
})

// Routing
app.use('*', checkUser);
app.use(authRoutes);
app.use(quesRoutes);
app.use(ansRoutes);
app.use(searchRoutes);



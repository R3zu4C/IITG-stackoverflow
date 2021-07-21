const Users = require("../models/users");
const Posts = require("../models/posts");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Error Handling
const handleErrors = (err) => {
  // Logging the errors
  console.log(err.message, err.code);

  let errors = { name: "", email: "", password: "" };

  // Duplicate email
  if (err.code === 11000) {
    if (err.message.includes("email")) {
      errors.email = "that email is already registered";
    }
    if (err.message.includes("name")) {
      errors.name = "that name is already taken";
    }
    return errors;
  }
  // Incorrect email
  if (err.message == "email not registered") {
    errors.email = "that email is not registered";
  }

  // Incorrect password
  if (err.message == "incorrect password") {
    errors.password = "password is incorrect";
  }

  // Validation error
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
};

// Creating a jwt token for authentication
function createToken(id) {
  return jwt.sign({ id }, "random secret code", {
    expiresIn: 1 * 60 * 60,
  });
}

// Signup
//GET
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
//POST
module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Creating a new User
    const newUser = await Users.create({ name, email, password });
    // Creating a token for new user
    const token = createToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 });
    res.status(201).json({ user: newUser._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Login
//GET
module.exports.login_get = (req, res) => {
  res.render("login");
};
//POST
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Home GET
module.exports.home_get = (req, res) => {
  Posts.find({})
    .populate("author")
    .exec((err, data) => {
      if (err) console.log(err);
      else
        res.render("index", {
          data: data,
        });
    });
};

// Users GET
module.exports.users_get = (req, res) => {
  Users.find({}, (err, data) => {
    if (err) console.log(err);
    else
      res.render("users", {
        data: data,
      });
  });
};

// About GET
module.exports.about_get = (req, res) => {
  res.render("about");
};

// Profile Edit
//GET
module.exports.profile_get = (req, res) => {
  res.render("profile");
};
//PUT
module.exports.profile_put = async (req, res) => {
  let { name, email, Oldpassword, Newpassword } = req.body;
  const salt = await bcrypt.genSalt();
  Newpassword = await bcrypt.hash(Newpassword, salt);

  try {
    let user = await Users.login(email, Oldpassword);
    user = await Users.findOneAndUpdate(
      { _id: user._id },
      { $set: { name: name, email: email, password: Newpassword} }
    );
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

// Logout GET
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};


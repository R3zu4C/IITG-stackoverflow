const Users = require("../models/users");
const Posts = require("../models/posts");

// Error Handling
const handleErrors = (err) => {
  // Logging the errors
  console.log(err.message, err.code);

  let errors = {};

  // Validation error
  if (err.message.includes("posts validation failed") || err.message.includes("Validation failed")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
};

// Add Post
//GET
module.exports.addpost_get = (req, res) => {
  res.render("addpost");
};
//POST
module.exports.addpost_post = async (req, res) => {
  const { title, author, body } = req.body;
  try {
    const newPost = await Posts.create({ author, title, body });
    res.status(201).json({ post: newPost._id });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Show Post
module.exports.show = (req, res) => {
  Posts.findByIdAndUpdate(req.params.id, {
    $push: { answers: { $each: [], $sort: { updatedAt: -1 } } },
  })
    .populate("author")
    .populate("answers.author")
    .sort({ "answers.createdAt": 1 })
    .exec((err, data) => {
      if (err) console.log(err);
      else {
        res.render("show", { data: data });
      }
    });
};

// Edit Post
//GET
module.exports.edit_get = (req, res) => {
  const post = Posts.findById(req.params.id, (err, data) => {
    if (err) console.log(err);
    else {
      res.render("edit", { data: data });
    }
  });
};
//PUT
module.exports.edit_put = async (req, res) => {
  const { title, body } = req.body;
  try {
    const updPost = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { title: title, body: body } }
    );
    res.status(200).json({ post: updPost._id });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
//DELETE
module.exports.post_delete = async (req, res) => {
  try {
    await Posts.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

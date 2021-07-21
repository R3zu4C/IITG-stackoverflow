const Users = require("../models/users");
const Posts = require("../models/posts");

// Error Handling
const handleErrors = (err) => {
  // Logging the errors
  console.log(err.message, err.code);

  let errors = {};

  // Validation error
  if (err.message.includes("posts validation failed")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
};

//Add Answer
//PUT
module.exports.ans_put = async (req, res) => {
  const { author, body } = req.body;
  try {
    const ans = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          answers: {
            author: author,
            body: body,
          },
        },
      },
      { runValidators: true }
    );
    res.status(200).json({ post: ans._id });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

//Edit Answer
//GET
module.exports.ans_edit_get = (req, res) => {
  const post = Posts.findById(req.params.id, (err, data) => {
    if (err) console.log(err);
    else {
      const ans = data.answers.id(req.params.id2);
      res.render("edit_ans", { data: data, ans: ans });
    }
  });
};
//PUT
module.exports.ans_edit_put = async (req, res) => {
  const { body } = req.body;
  try {
    const updAns = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { "answers.$[elem].body": body } },
      { arrayFilters: [{ "elem._id": req.params.id2 }] }
    );
    res.status(200).json({ ans: updAns });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

//Delete Answer
module.exports.ans_delete = async (req, res) => {
  try {
    await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { answers: { _id: req.params.id2 } } }
    );
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

module.exports.upvote = async (req, res) => {
  const id = req.user;
  const post = Posts.findById(req.params.question, async (err, data) => {
    if (err) console.log(err);
    else {
      let ans = data.answers.id(req.params.answer);
      if (ans) {
        ans = ans.vote(id, 1);
        console.log(ans);
        const updAns = await Posts.findOneAndUpdate(
          { _id: req.params.question },
          { $set: { "answers.$[elem].score": ans.score, "answers.$[elem].votes": ans.votes }},
          { arrayFilters: [{ "elem._id": req.params.answer }] }
        );
        res.redirect('/posts/' + req.params.question);
      }
    }
  });
  
};

module.exports.downvote = async (req, res) => {
  const id = req.user;
  const post = Posts.findById(req.params.question, async (err, data) => {
    if (err) console.log(err);
    else {
      let ans = data.answers.id(req.params.answer);
      if (ans) {
        ans = ans.vote(id, -1);
        console.log(ans);
        const updAns = await Posts.findOneAndUpdate(
          { _id: req.params.question },
          { $set: { "answers.$[elem].score": ans.score, "answers.$[elem].votes": ans.votes }},
          { arrayFilters: [{ "elem._id": req.params.answer }] }
        );
        res.redirect('/posts/' + req.params.question);
      }
    }
  });
};

module.exports.unvote = async (req, res) => {
  const id = req.user;
  const post = Posts.findById(req.params.question, async (err, data) => {
    if (err) console.log(err);
    else {
      let ans = data.answers.id(req.params.answer);
      if (ans) {
        ans = ans.vote(id, 0);
        console.log(ans);
        const updAns = await Posts.findOneAndUpdate(
          { _id: req.params.question },
          { $set: { "answers.$[elem].score": ans.score},
            $pull: {
              "answers.$[elem].votes": {
                user: id
              },
            },
          },
          { arrayFilters: [{ "elem._id": req.params.answer }] }
        );
        res.redirect('/posts/' + req.params.question);
      }
    }
  });
};

const Users = require("../models/users");
const Posts = require("../models/posts");

// Search
//GET
module.exports.search_get = async (req, res) => {
  const query = req.params.query;
  try {
    await Posts.fuzzySearch(query)
      .populate("author")
      .exec((err, data) => {
        if (err) console.log(err);
        else {
          res.render("search", { data: data });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};
//POST
module.exports.search_post = async (req, res) => {
  const { query } = req.body;
  try {
    query.replace(/ /g, "%20");
    res.redirect("/search/" + query);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

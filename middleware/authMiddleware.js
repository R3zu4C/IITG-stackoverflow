const jwt = require("jsonwebtoken");
const _ = require('lodash');
const Users = require("../models/users");
const Posts = require("../models/posts");

// Middleware for checking authentication of user
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "random secret code", (err, dToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// Middleware for getting credentials of logged in user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "random secret code", async (err, dToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        req.user = dToken.id;
        let user = await Users.findById(dToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const postOwnershipAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if(req.path == "/posts/" + req.params.id + "/edit") {
    if (token) {
      jwt.verify(token, "random secret code", async (err, dToken) => {
        if (err) {
          console.log(err.message);
          res.locals.owner = null;
        res.redirect("/login");  
        } else {
            let owner = await Users.findById(dToken.id);
            let post = await Posts.findById(req.params.id).populate("author");
            if(_.isEqual(post.author._id, owner._id)) {
              res.locals.owner = owner;
              next();
            }
            else {
              res.locals.owner = null;
              res.redirect('/posts/' + post._id);
            }
          }
      });
    } else {
      res.locals.owner = null;
      res.redirect("/login");
    }
  }
  else {
    if (token) {
      jwt.verify(token, "random secret code", async (err, dToken) => {
        if (err) {
          console.log(err.message);
          res.locals.owner = null;
          next();
        } else {
            let owner = await Users.findById(dToken.id);
            let post = await Posts.findById(req.params.id).populate("author").populate("answers.author");
            if(_.isEqual(post.author._id, owner._id)) {
              res.locals.owner = owner;
              next();
            }
            else {
              res.locals.owner = null;
              next();
            }
          }
      });
    } else {
      res.locals.owner = null;
      next();
    }
  }
};

const searchPost = async (req, res, next) => {
  const { query } = req.body;

  res.locals.search = null;

  try {
    await Posts.fuzzySearch(query, (err, data) => {
      if(err) console.log(err);
      else {
        res.locals.search = data;
        next();
      }
    });
  }
  catch (err) {
    console.log(err);
    next();
  }
};

module.exports = { requireAuth, checkUser, postOwnershipAuth, searchPost };

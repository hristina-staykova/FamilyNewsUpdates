// all routes to be put here
var express = require("express");
var router = express.Router();
var comment = require("../models/comment.js");
var user = require("../models/user.js");
var news = require("../models/news.js");

// var orm = require("../config/orm.js");

// Create all our routes and set up logic within those routes where required.

//ADMIN pages
router.get("/admin", function(req, res) {
  res.render("admin");
});

//admin page - get and display users from the db - OK
router.get("/admin/users", function(req, res) {
  console.log("admin users page");
  user.selectAllUsers(function(allUsers) {
    console.log(allUsers);
    res.render("admin", { allUsers });
  });
});

//admin page - get and display news from the db - OK
router.get("/admin/news", function(req, res) {
  news.selectAllNews(function(allNews) {
    console.log(allNews);
    res.render("admin", { allNews });
  });
});

//admin page - get and display comments from the db - OK
router.get("/admin/comments", function(req, res) {
  comment.selectAllComments(function(allComments) {
    console.log(allComments);
    res.render("admin", { allComments });
  });
});

//admin page - delete user from the db - OK
router.delete("/admin/users/:id", function(req, res) {
  var user_id = req.params.id;
  user.deleteUser(user_id, function(result) {
    console.log(result);
    res.end();
  });
});

//admin page - delete comment by id from the db - OK
router.delete("/admin/comments/:id", function(req, res) {
  var comment_id = req.params.id;
  comment.deleteComment(comment_id, function(comments) {
    console.log(comments);
    res.end();
  });
});

//admin page - update/edit user by id from the db - OK
router.put("/admin/users/:id", function(req, res) {
  var user_id = req.params.id;
  var objColVals = {};
  if (req.body.user_password != null) {
    objColVals["user_password"] = req.body.user_password;
  }
  if (req.body.is_admin != null) {
    objColVals["is_admin"] = req.body.is_admin;
  }
  user.updateUser(objColVals, user_id, function(comments) {
    console.log(comments);
    res.end();
  });
});

//admin page - delete news by id from the db + its comments - OK
router.delete("/admin/news/:id", function(req, res) {
  var news_id = req.params.id;
  news.deleteNews(news_id, function(news) {
    console.log(news);
    res.end();
  });
});

//adding new news - OK
router.post("/api/news", function(req, res) {
  //check the request - the news content and the logged user id
  news.insertNews(
    ["content", "user_id"],
    [req.body.content, req.body.user_id],
    function(result) {
      res.json({ id: result.insertId });
      //we display the new news entry as a first entry?
      // res.render("index");
    }
  );
});

//adding a comment to news - OK
router.post("/api/comments", function(req, res) {
  //check the request - the content and the logged user_id and the news_id
  comment.insertComment(
    ["content", "user_id", "news_id"],
    [req.body.content, req.body.user_id, req.body.news_id],
    function(result) {
      res.json({ id: result.insertId });
      // res.render("index");
    }
  );
});

//on "/" we see the login page - OK
router.get("/", function(req, res) {
  res.render("login");
});

//OK
router.get("/signup", function(req, res) {
  res.render("signup");
});

//OK
router.get("/login", function(req, res) {
  res.render("login");
});

//"index" is the main page after login/sign up - to be continued
router.get("/index", function(req, res) {
  news.selectRecentNews(10, function(recentNews) {
    user.selectUser(1, function(user) {
      console.log({ recentNews, user });
      res.render("index", { recentNews, user });
    });
  });
});

router.post("/api/login", function(req, res) {
  //selectUser()
  //- if user exists
  //- if password is correct
  //- if user is admin
  res.render("login");
});

//create new user and enter the page
router.post("/api/signup", function(req, res) {
  //check the request - how do we pass the email & password in insertUser(), check if the user exists - selectUser()
  user.insertUser(req.body.user, cb);
  //what do we render on signup - main page?
  res.render("index");
});

// Export routes for server.js to use.
module.exports = router;

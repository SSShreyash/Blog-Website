const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/blogDB");

const blogSchema = new mongoose.Schema({
    head: String,
    body: String
});

const Post = mongoose.model("Post", blogSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const homeStartingContent = "Welcome to the Blog Website.";
const aboutContent = "This is a blog website where you may share your thoughts with anyone who accesses this site." +"\n" + "Click on Compose to make post.";
const contactContent = "Made by Shreyash Patil.";

app.get("/", function (req, res){

    Post.find().then(function (posts){
        res.render("home", {StartingContent : homeStartingContent,
                            posts : posts});
    }).catch(function (err){
        console.log(err);
    });
    
});

app.get("/about", function(req, res){

  res.render("about", {StartingContent: aboutContent});
});

app.get("/contact", function(req, res){

  res.render("contact", {StartingContent: contactContent});
});

app.get("/compose", function(req, res){

  res.render("compose", {});
});

app.post("/compose", function(req, res){

  const newPost = {
      head : req.body.newContentHead,
      body : req.body.newContent
  }

  Post.create(newPost).then(function (){
    res.redirect("/");
  }).catch(function (err){
    console.log(err);
  });

});

app.get("/posts/:id", function(req, res){
  
  const postId = _.lowerCase(req.params.id);

  Post.find().then(function (posts){
    posts.forEach(function(post){
        if(_.lowerCase(post._id)===postId){
            res.render("post", {PostHeading: post.head,
                                PostContent: post.body});
        }
    });
  }).catch(function (err){
    console.log(err);
  });
  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

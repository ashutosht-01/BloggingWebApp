require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require('lodash');
const session = require('express-session');
const passport = require("passport");
const md5=require('md5');   
const passportLocalMongoose = require("passport-local-mongoose");
const ejs = require("ejs");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const contactcontent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutcontent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const port=3000;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: 'Oue little secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/blogdb", {useNewUrlParser: true,useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const postSchema = new mongoose.Schema({
  title: String,
  image: String,
  content: String
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  googleId: String,
  photo: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    User.findOrCreate({ googleId: profile.id, name: profile.displayName, photo: profile.photos[0].value }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/',function(req,res){
   Post.find({},function(err,posts){
       if(posts){
       res.render('home',{post:posts});
       }
       else if(err){
       console.log(err);
       }
   })
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/compose",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/compose");
  });

app.get('/about',function(req,res){
    res.render('about',{about:aboutcontent});
})

app.get('/comp',function(req,res){
    res.render('comp');
})
app.get('/contact',function(req,res){
    res.render('contact',{contact:contactcontent});
})

app.get('/compose',function(req,res){
    res.render('compose');
})

app.get('/login',function(req,res){
    res.render('login');
})

app.get('/register',function(req,res){
    res.render('register');
})

app.post('/register',function(req,res){
    const newuser=new User({
        email:req.body.email,                //DataBase Encryption
        passward:md5(req.body.passward)      //md5= is a js package for safr hashing of passward   
    })
    newuser.save(function(err){
        if(!err)
        res.render('login');
    });

})

app.post('/login',function(req,res){
   const username=req.body.username;
   const passward=req.body.passward;
   User.findOne({email:username},function(err,founduser){
       if(err)  
       console.log(err);
       else
       {
           if(founduser)
           {
               if(founduser.passward === passward)  //correct user
                res.render('compose');
           }
       }
   })
})

app.post('/compose',function(req,res){
    const Title=req.body.posttitle;
    const Image=req.body.imginfo;
    const Content=req.body.postcontent;
const post= new Post({
    title:Title,
    image:Image,
    content:Content
});
post.save(function(err){
    if(!err)
    res.redirect('/');
    else
    console.log(err);
});
})

//using route parameters
app.get('/posts/:postid',function(req,res){
    var requestedpostid=(req.params.postid);
    Post.findOne({_id:requestedpostid},function(err,post){
        if(!err)
        res.render('post',{title:post.title,image:post.image,content:post.content});
        else
        console.log(err);
    })
})

app.listen(port,function(){
    console.log(`server started running on port ${port}`);
}) 

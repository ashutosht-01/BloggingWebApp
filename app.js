const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const _=require('lodash');
const mongoose=require('mongoose');
const aboutcontent='this is about page content';
const contactcontent='this is contact page content';
const port=3000;
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
//set up the view engine
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost/blogdb', {useNewUrlParser: true, useUnifiedTopology: true});
const postSchema=new mongoose.Schema({
    title:String,
    image:String,
    content:String
});

const Post=mongoose.model('post',postSchema);
app.get('/',function(req,res){
   Post.find({},function(err,posts){
       if(posts)
       {
           console.log(posts);
       res.render('home',{post:posts});
       }
       else if(err)
       console.log(err);
   })
});

app.get('/about',function(req,res){
    res.render('about',{about:aboutcontent});
})

app.get('/contact',function(req,res){
    res.render('contact',{contact:contactcontent});
})

app.get('/compose',function(req,res){
    res.render('compose');
})

app.get('/register',function(req,res){
    res.render('register');
})

app.get('/login',function(req,res){
    res.render('login');
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

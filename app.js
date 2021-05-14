const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const _=require('lodash');
const homecontent='this is home page content';
const aboutcontent='this is about page content';
const contactcontent='this is contact page content';
const port=3000;
const app=express();
const posts=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
//set up the view engine
app.set('view engine','ejs');

app.get('/',function(req,res){
    res.render('home',
    {
    home:homecontent,
    post:posts
    })
})

app.get('/about',function(req,res){
    res.render('about',{about:aboutcontent});
})

app.get('/contact',function(req,res){
    res.render('contact',{contact:contactcontent});
})

app.get('/compose',function(req,res){
    res.render('compose');
})

app.post('/compose',function(req,res){
var post={
    title:req.body.posttitle,
    content:req.body.postbody
};
posts.push(post);
res.redirect('/');
})
//route parameters 
app.get('/posts/:postname',function(req,res){
    var requestedtitle=_.lowerCase(req.params.postname);
    for(let i=0;i<posts.length;i++)
    {
        if(_.lowerCase(posts[i].title)==requestedtitle)
        res.render('post',{title:posts[i].title,content:posts[i].content});
    }
})
app.listen(port,function(){
    console.log(`server started running on port ${port}`);
}) 
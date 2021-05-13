const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const homecontent='this is home about content';
const aboutcontent='this is about page content';
const contactcontent='this is about page content';
const port=3000;
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
//set up the view engine
app.set('view engine','ejs');
app.get('/',function(req,res){
    res.render('home',{home:homecontent});
})
app.get('/about',function(req,res){
    res.render({about:aboutcontent});
})
app.get('/contact',function(req,res){
    res.render({contact:contactcontent});
})



app.listen(port,function(){
    console.log(`server started running on port ${port}`);
}) 
//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser  = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB");

const articleSchema = {
    title : String , 
    content : String
};

const Article = mongoose.model("Article", articleSchema);
// /////////////////requests targetting all articles///////////////////////////
app.route("/articles")

.get(function(req,res){
    Article.find(function(err , foundArticles){
        if(!err){
        res.send(foundArticles);
        }
        else{
            res.send(err);
        }
    });

})

.post(function(req,res){
    const newArticle = new Article({
        title : req.body.title ,
        content : req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
    });
   
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Items deleted successfully");
        }else{
            res.send(err);
        }

    });
});


// /////////////////requests targetting Specific articles///////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){

    Article.findOne({title : req.params.articleTitle} , function(err , foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles matching that title was found.");
        }
    });

})

.put(function(req,res){
    Article.updateMany(
        {title : req.params.articleTitle},
        {$set : {title : req.body.title , content : req.body.content}},
        { overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }else{
                res.send(err);
            }
        }

    );

})

.patch(function(req,res){
    Article.updateMany(
        {titile : req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article.")
            }else{
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Deleted Successfully");
            }else{
                console.log(err);
            }
        }
    );

});









app.listen(3000,function(){
    console.log("server started on port 3000");
});


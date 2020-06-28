// Require section
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

// Initialize the express server
const app = express()

// Initialize body parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

// Set server to view ejs
app.set("view engine", "ejs")

// Connect to mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

// DB item Schema
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// Articles requests
app.route("/articles")

    .get(function(req, res) {

        Article.find(function(err, foundArticles) {
            if(err) {
                res.send(err);
            } else {
                res.render("index", {articlesList: foundArticles});
            }
        });
    })

    .post(function(req, res) {
        const title = req.body.title;
        const content = req.body.content;
    
        const newArticle = new Article({
            title: title,
            content: content
        });
    
        newArticle.save();
    })

    .delete(function(req, res){
        Article.deleteMany(function(err) {
            if(err) {
                res.send(err);
            } else {
                console.log("Articles deleted successfully");
                res.redirect("/articles");
            }
        })
    });

// Post requests
app.route("/post")

    .get(function(req, res) {
        res.render("post");
    })

    .post(function(req, res) {
        const title = req.body.title;
        const content = req.body.content;
    
        const newArticle = new Article({
            title: title,
            content: content
        });
    
        newArticle.save();
    
        res.redirect("/articles");
    });

// Spesific Articles requests
app.route("/articles/:articleTitle")

    .get(function(req, res) {
        const title = req.params.articleTitle;

        Article.findOne({title: title}, function(err, foundArticle) {
            if(err) {
                console.log(err);
            } else {
                if(foundArticle) {
                    res.render("index", {articlesList: [foundArticle]});
                } else {
                    res.send("No article was found");
                }
            }
        })
    })

    .put(function(req, res) {
        const title = req.params.articleTitle;
        const newTitle = req.body.title;
        const newContent = req.body.content;

        Article.update(
            {title: title},
            {
                title: newTitle,
                content: newContent
            },
            {overwrite: true},
            function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully updated the article");
                    res.redirect("/articles");
                }
            }
        )
    })

    .patch(function(req, res) {
        const title = req.params.articleTitle;
        const changes = req.body;

        Article.update(
            {title: title},
            {$set: changes},
            function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully updated " + title);
                    res.redirect("/articles/" + title);
                }
            }
        );
    })

    .delete(function(req, res) {
        const title = req.params.articleTitle;

        Article.deleteOne({title: title}, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log(title + " was deleted");
                res.redirect("/articles");
            }
        });
    });

// Set server to listen on port 3000
app.listen(3000, function() {
    console.log("Server listens on port 3000");
});
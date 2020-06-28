//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {

    let day = date.getDate();

    res.render("list", {listTitle: day, newListItems: items});
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/", function(req, res) {
    let item = req.body.newItem;

    let listName = req.body.list;

    switch(listName) {
        case "Work":
            workItems.push(item);
            res.redirect("/work");
            break;
        default:
            items.push(item);
            res.redirect("/");
            break;
    }
});

app.post("/remove", function(req, res) {
    let removeItemIndex = req.body.index;
    let listName = req.body.removeList;

    console
    switch(listName) {
        case "Work":
            workItems.splice(removeItemIndex, 1);
            res.redirect("/work");
            break;
        default:
            items.splice(removeItemIndex, 1);
            res.redirect("/");
            break;
    }
});

app.listen(3000, function() {
    console.log("Server listen to port 3000");
});
//jshint esversion:6

/* Require Section */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");

// create the express app
const app = express();

// use body parser and static folder
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Set views folder for the EJS
app.set("view engine", "ejs");

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// create DB schema
const itemsSchema = {
    name: String
};

// Create item model
const Item = mongoose.model("Item", itemsSchema);

// Create default items in the list
const task1 = new Item({
        name: "Do more code!"
});
const task2 = new Item({
        name: "Eat!"
});
const task3 = new Item({
        name: "Don't do sports!!!"
});
const defaultItems = [task1, task2, task3];

// Create List Schema
const ListSchema = {
    name: {
        type: String,
        required: true
    },
    items: [itemsSchema]
};

// Create the list model
const List = mongoose.model("List", ListSchema);

app.get('/favicon.ico', (req, res) => res.status(204));

/* Get requests Section */
app.get("/", function(req, res) {    

    // Find all tasks in the itmes collection in the DB and send to the EJS page
    Item.find(function(err, results) {
        if(err) {
            console.log(err);
        } else {
            // Check if default items are in the database, otherwise add them to the DB
            if(results.length === 0) {
                Item.insertMany(defaultItems, function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Default items added");
                    }
                });
                // redirect to the root in order to show the default items
                res.redirect("/");
            } else {
                // If the DB is not empty, simply render the page with the results
                res.render("list", {listTitle: "Today", newListItems: results});
            }
        }
    });
});

app.get("/:listName", function(req, res) {
    const listName = lodash.capitalize(req.params.listName);

    List.findOne({name: listName}, function(err, foundList) {
        if(err) {
            console.log(err);
        } else {
            if(!foundList) {
                // Create a new list
                const list = new List({
                    name: listName,
                    items: defaultItems
                });

                list.save();

                // Redirect to the same page to show the new list
                res.redirect("/" + listName);
            } else {
                // Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });
});


/* Post requests Section */
app.post("/", function(req, res) {
    let itemName = req.body.newItem;

    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    // Check if the request was from the default page
    if(listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        // Otherwise - the request was from a list page.
        // We want to get that list.
        List.findOne({name: listName}, function(err, foundList) {
            if(err) {
                console.log(err);
            } else {               
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
});

// Remove item from the list
app.post("/delete", function(req, res) {
    let removeItemId = req.body.checkbox;
    let listName = req.body.listName;

    if(listName === "Today") {
        Item.findByIdAndRemove(removeItemId, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("Successfully removed item of id: " + removeItemId);
            }
    
            res.redirect("/");
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: removeItemId}}}, function(err, results) {
            if(err) {
                console.log(err);
            } else {
                res.redirect("/" + listName);
            }
        });
    }

    
});


/* Listen Section */
app.listen(3000, function() {
    console.log("Server listen to port 3000");
});
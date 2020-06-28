const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

// Listen section
app.listen(3000, function() {
    console.log("Server listens to port 3000");
});

// Get first page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// post form data
app.post("/", function(req, res) {
    // parse requst data
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    // convert to json
    var jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/";

    var options = {
        method: "POST",
        auth: "dude:b570e973c3ded"
    };

    // use mailchimp api in order to sign up the user
    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            // check status code in order to see if the submit succeeded or not
            if(response.statusCode === 200) {
                success(res);
            } else {
                failure(res);
            }
            console.log(JSON.parse(data));
        });
    });

    // send to signup request
    // request.write(jsonData);
    request.end();
});


function success(res) {
    res.sendFile(__dirname + "/success.html");
}

function failure(res) {
    res.sendFile(__dirname + "/failure.html");
}

app.post("/failure", function(req, res) {
    res.redirect("/");
});
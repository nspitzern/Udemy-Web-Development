const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

// First request returns the main page
app.get("/bmicalculator", function(req, res) {
    res.sendFile(__dirname + "/bmiCalculator.html");
});


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/calculator.html");
});

// Get the request and calculate the BMI
app.post("/bmicalculator", function(req, res) {
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);

    var bmi = weight / Math.pow(height, 2);

    res.send("Your BMI is: " + bmi);
});

app.post("/", function(req, res) {
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var oper = req.body.oper;

    var result = calculate(num1, num2, oper);

    res.send("Result: " + result);
})

// Listen to port 3000
app.listen(3000, function() {
    console.log("server listens to port 3000");
});


function calculate(num1, num2, oper) {
    switch(oper) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num1 / num2;
        default:
            return "None";
    }
}
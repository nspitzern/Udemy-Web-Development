const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    // send the main page
    res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res) {
    // get the city name from the request
    var query = req.body.cityName;
    var unit = req.body.unit;

    const appId = "e72ca729af228beabd5d20e3b7749713";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appId + "&units=" + unit;

    // get the data from the weather API
    https.get(url, function(response) {

        response.on("data", function(data) {
            var weatherData = JSON.parse(data);
            
            var temp = weatherData.main.temp;
            var description = weatherData.weather[0].description;
            var icon = weatherData.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            res.write("<p>The weather is currently " + description + "</p>")
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees</h1>");
            res.write("<img src=" + iconUrl + " alt=" + description + ">");

            res.send();
        });
    });
})


app.listen(3000, function() {
    console.log("Server listen to port 3000");
});
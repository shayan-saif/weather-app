const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {

    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
    const city = req.body.city;
    // Retrieve API key from OpenWeather
    const apiKey = "";
    const units = "metric"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + apiKey
    https.get(url, (apiResponse) => {
        console.log(apiResponse.statusCode);

        apiResponse.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

            res.writeHead(200,{"Content-Type" : "text/html"});
            res.write("<h2>" + city + "</h2>");
            res.write("<p>The current temperature (celcius) is: <strong>" + temp + "</strong> </p>");
            res.write("<p>The weather is currently " + weatherDescription + ".</p>");
            res.write("<img src=" + imgUrl + ">");
            res.send();
        });
    });
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});
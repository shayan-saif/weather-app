const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    res.sendFile(__dirname + "/index.html");
});

app.post('/result', (req, res) => {
    // Retrieve API key from OpenWeather
    const apiKey = "";
    const city = req.body.city.toLowerCase()
    const units = req.body.units.toLowerCase();
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + apiKey
    console.log(url);

    https.get(url, (apiResponse) => {
        apiResponse.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

            const cityF = city.slice(0, 1).toUpperCase() + city.slice(1, city.length).toLowerCase();
            var unitsF = "";
            if(units === "metric") {
              unitsF = "celcius";
            } else if(units === "imperial") {
              unitsF = "farenheit";
            } else {
              unitsF = "kelvin";
            }

            const tempF = Math.round(temp) + "° " + unitsF;
            res.render('result', {
              city: cityF,
              temp: tempF,
              weatherDescription: "The weather is currently " + weatherDescription + ".",
              imgUrl: imgUrl
            });
        });
    });
});

app.get('/master.css', (req, res) => {
  res.sendFile(__dirname + "/master.css");
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
}); 

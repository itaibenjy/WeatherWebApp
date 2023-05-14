const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const apikey = "b6efcdabcbaf1fee5eb2f8c5f68ed3ae"
const units = "metric"

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile("index.html")
})


app.post('/api/weather/', (req, res) => {
  console.log(req)
  // get the city name from the request body
  var city = req.body.city;
  // get the weather data from an external API
  // and send the response back to the client
  fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&q=${city}&units=${units}`)
    .then(response => response.json())
    .then(data => { res.json(data) })
    .catch(error => { res.json({ error }) });
})

app.listen(3000, () => console.log('Servereready listening on port 3000'))

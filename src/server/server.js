let dataObj = {};

const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fetch = require('node-fetch');

// ============= DEPENDENCIES ====================
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuring express to use the following as middle-ware

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// Telling body-parser to use JSON
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

app.use(express.static('dist'));

// ============= SERVER SET UP ================
app.listen(port, () => console.log(`Server running on port: ${port}`));

// ===== GEONAMES API =====
const geonamesAPI = async (cityParam, dateParam, weather) => {
  const username = process.env.GEONAMES_USERNAME;

  await fetch(`http://api.geonames.org/searchJSON?name=${cityParam}&maxRows=1&username=${username}`)
    .then(res => res.json())
    .then(data => {
      // dataObj['city'] = data['geonames'][0]['name'];
      dataObj['city'] = cityParam;
      dataObj['country'] = data['geonames'][0]['countryName'];
      dataObj['lat'] = data['geonames'][0]['lat'];
      dataObj['lng'] = data['geonames'][0]['lng'];
      dataObj['date'] = dateParam;
      // Had to set the weather property in here because I'm chaining the API calls &
      // the weatherbit api needs to know which type of weather to show
      dataObj['weather_to_get'] = weather;
      // console.log('%cInside Geonames API', 'color: #D44942');
      // console.log(dataObj);
    })
    .catch(err => console.log(err));
    console.log(' ======= GEONAMES API ======'); 
    console.log(dataObj);
  return dataObj;
};

// ===== WEATHERBIT API =====
const weatherbitAPI = async dataParam => {
  const wbAPIKey = process.env.WEATHERBIT_APIKEY;
  const urlCurrentBase = 'http://api.weatherbit.io/v2.0/current';
  const urlForecastBase = ' http://api.weatherbit.io/v2.0/forecast/daily';
  const urlParameters = `?lat=${dataParam['lat']}&lon=${dataParam['lng']}&units=I&key=${wbAPIKey}`;
  const urlFull = dataParam['weather_to_get'] === 'current' ?
    `${urlCurrentBase}${urlParameters}` : `${urlForecastBase}${urlParameters}`;

  await fetch(urlFull)
    .then(res => res.json())
    .then(apiData => {
      dataObj['weather'] = [];

      if (dataParam['weather_to_get'] === 'current') {
        dataObj['weather'].push({
          temp: apiData['data'][0]['temp'],
          description: apiData['data'][0]['weather']['description']
        });
      } else {
        apiData['data'].forEach((entry, index, thisArr) => {
          dataObj['weather'].push(
            {
              desc: entry['weather']['description'],
              high: entry['max_temp'],
              low: entry['min_temp'],
              precip_pct: entry['pop']
            }
          );
        });
      }
    })
    .catch(err => console.log(err));
    console.log(' ======= WEATHERBIT API ======');  
    console.log(dataObj);
    return dataObj['city'];
};

// ===== PIXABAY API ===============
const pixabayAPI = async cityParam => {
  const pxAPIKey = process.env.PIXABAY_APIKEY;
  const urlBase = 'https://pixabay.com/api/?&safesearch=true';

  await fetch(`${urlBase}&key=${pxAPIKey}&q=${cityParam}`)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      const randomNum = Math.floor(Math.random() * 20)
      // console.log(data['hits'].length);
      dataObj['imageURL'] = data['hits'][randomNum]['webformatURL'];
      // console.log(data['hits'][0]['webformatURL']);
      // console.log(dataObj);
    })
    console.log(' ======= PIXABAY API ======');  
    console.log(dataObj);
    return dataObj;
}

// ===== RETURN FINAL DATA ===============
const returnFinalData = () => {
  dataObj['id'] = Math.floor(Math.random() * (199 - 100) + 100);
  console.log(dataObj);
  return dataObj;
}

// ============= ROUTING ======================
app.get('/', (req, res) => {
  // This file reference below was before implementing the dist folder
  // res.sendFile(path.resolve('../client/views/index.html'));
  // Now that we're using the dist folder, we use this file reference below
  res.sendFile('dist/index.html');
});

app.get('/data', (req, res) => {
  console.log('Get that data!');
  res.send(dataObj);
});

app.post('/', (req, res) => {
  console.log('Server...');

  const city = req.body.city;
  const date = req.body.trip_date;
  const weather = req.body.weather_data;

  geonamesAPI(city, date, weather)
    .then(data => weatherbitAPI(data))
    .then(data => pixabayAPI(data))
    .then(() => returnFinalData())
    .then(() => res.send('Posted data received'))
});

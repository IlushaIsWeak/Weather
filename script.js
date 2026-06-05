async function searchCity(){

const city =
document.getElementById("city").value;

if(!city) return;

const geoUrl =
`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru&format=json`;

const geoResponse =
await fetch(geoUrl);

const geoData =
await geoResponse.json();

if(!geoData.results){

document.getElementById("weather").innerHTML =
"<h2>Город не найден</h2>";

return;
}

const lat =
geoData.results[0].latitude;

const lon =
geoData.results[0].longitude;

const cityName =
geoData.results[0].name;

loadWeather(lat,lon,cityName);
}

async function loadWeather(lat,lon,cityName){

const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

const response =
await fetch(url);

const data =
await response.json();

const current =
data.current;

document.getElementById("weather").innerHTML =

`
<h2>${cityName}</h2>

<div class="temp">
${Math.round(current.temperature_2m)}°C
</div>

<div class="info">

<div>
💧<br>
${current.relative_humidity_2m}%
</div>

<div>
💨<br>
${current.wind_speed_10m} км/ч
</div>

<div>
📊<br>
${current.surface_pressure}
</div>

<div>
🕒<br>
Сейчас
</div>

</div>
`;

let forecastHTML = "";

for(let i=0;i<7;i++){

forecastHTML +=

`
<div class="day">

<p>
${data.daily.time[i]}
</p>

<p>
⬆ ${Math.round(data.daily.temperature_2m_max[i])}°
</p>

<p>
⬇ ${Math.round(data.daily.temperature_2m_min[i])}°
</p>

</div>
`;
}

document.getElementById("forecast").innerHTML =
forecastHTML;

changeBackground(current.weather_code);
}

function changeBackground(code){

let bg = "sunny.jpg";

if(code >= 51)
bg = "rain.jpg";

if(code >= 71)
bg = "snow.jpg";

if(code >= 95)
bg = "storm.jpg";

document.body.style.backgroundImage =
`url(images/${bg})`;
}

function getLocationWeather(){

navigator.geolocation.getCurrentPosition(

async(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

loadWeather(lat,lon,"Моё местоположение");

}

);

}
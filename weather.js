const submitBtn = document.querySelector("button");
const formSection = document.querySelector("form");
const inputArea = document.querySelector("input");

formSection.addEventListener("submit", addCityHandler);
let lat;
let lon;
let countryCode;
let cityName;
let APICode = "953bc5137dc75c2350b34981a79761f7";

function addCityHandler(e) {
  e.preventDefault();
  console.log("clicked");

  let cityName = inputArea.value;
  inputArea.value = "";

  let arr = [];
  if (cityName.trim()) {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APICode}`
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        let newArr = [];
        console.log(data[0].name, data[0].country), console.log(data);
        lat = data[0].lat;
        lon = data[0].lon;
        cityName = data[0].name;
        console.log(lat);
        countryCode = data[0].country;
        newArr.push(lat, lon, countryCode, cityName);

        return newArr;
      })
      .then((data) => gettingGeoInfo(data));

    console.log(arr);
  } else {
    alert("Please enter a valid city name");
  }
}

function gettingGeoInfo(data) {
  lat = data[0];
  lon = data[1];
  countryCode = data[2];
  cityName = data[3];
  //   console.log(cityName);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APICode}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      const { weather, main } = data;
      const { description, icon } = weather[0];
      console.log(weather, description);
      console.log(data, cityName, main.temp, icon);
    });
}
const submitBtn = document.querySelector("button");
const formSection = document.querySelector("form");
const inputArea = document.querySelector("input");
const citiesUl = document.querySelector(".cities");
const msgSpan = document.querySelector(".msg");

const popUp = document.getElementById("popUp-container");
const searchAgainBtn = document.getElementById("search-again");
const finalMessage = document.getElementById("final-Message");

formSection.addEventListener("submit", addCityHandler);
searchAgainBtn.addEventListener("click", () => {
  popUp.style.display = "none";
  window.location.reload();
});
let lat;
let lon;
let countryCode;
let cityName;
let APICode = "953bc5137dc75c2350b34981a79761f7";
let cityNames = [];
let count = {};
function addCityHandler(e) {
  e.preventDefault();

  let cityName = inputArea.value;

  cityNames.push(cityName);
  console.log(cityNames);

  inputArea.value = "";

  if (cityName.trim()) {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APICode}`
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        lat = data[0].lat;
        lon = data[0].lon;
        cityName = data[0].name;
        let newArr = [];
        countryCode = data[0].country;
        newArr.push(lat, lon, countryCode, cityName);
        if (lat === undefined) {
          console.log("patpat");
          return;
        }

        return newArr;
      })
      .then((data) => gettingGeoInfo(data))
      .catch((error) => {
        console.log(error);
        finalMessage.innerText = `Dou you really think that such  "${cityName}" name exists🙄`;
        popUp.style.display = "flex";
      });
  } else {
    alert("Please enter a valid city name");
  }
}

function gettingGeoInfo(data) {
  lat = data[0];
  lon = data[1];
  countryCode = data[2];
  cityName = data[3];
  console.log(cityName);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APICode}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      cityNames.forEach((names) => {
        count[names] = (count[names] || 0) + 1;
        if (count[names] <= 1) {
          msgSpan.innerHTML = ``;
          console.log(names);
          console.log("yay");
          renderTODom(data);
          return;
        } else {
          msgSpan.innerHTML = `
          <h2>You have already search weather condition of  ${names.toUpperCase()}🧐 </h2>
          `;
        }
      });
    });
}

function renderTODom(data) {
  const { weather, main } = data;
  const { description, icon } = weather[0];
  citiesUl.innerHTML += `
  <li class="city">
 
     <p class="city-name">${cityName}<sup>${countryCode}</sup></p>
     <div class="city-temp">${main.temp}°C</div>
   
     <img class="city-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
     <figcaption>${description}</figcaption>
   </li> 
     
     `;
}

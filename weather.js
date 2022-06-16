const resetBtn = document.querySelector("#resetBtn");
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
});
resetBtn.addEventListener("click", () => {
  window.location.reload();
});
let lat;
let lon;
let countryCode;
let cityName;
let APICodeWeather = "953bc5137dc75c2350b34981a79761f7";
let cityNames = [];
let count = {};
// const x = EncryptStringAES(APICode);

function addCityHandler(e) {
  e.preventDefault();

  let cityName = inputArea.value;

  cityNames.push(cityName);
  console.log(cityNames);

  inputArea.value = "";

  if (cityName.trim()) {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APICodeWeather}`
      )
      .then((response) => {
        const data = response.data[0];
        console.log(data);
        lat = data.lat;
        lon = data.lon;

        cityName = data.name;
        let newArr = [];
        countryCode = data.country;
        newArr.push(lat, lon, countryCode, cityName);
        console.log(lat, lon, cityName);

        return gettingGeoInfo(newArr);
      })
      .catch((error) => {
        if (error) {
          cityNames.pop(cityName); //!I remove invalid city name from city name lists
        }
        console.log(error);
        formSection.getAttribute("disabled", null);
        finalMessage.innerText = `Dou you really think that such  "${cityName}"  city name exists🙄`;
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

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APICodeWeather}&units=metric`
    )
    .then((response) => {
      const { data } = response;
      //!Checking dublicate city names

      cityNames.forEach((names) => {
        if (names) count[names] = (count[names] || 0) + 1;
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
     <div class="city-temp">${parseInt(main.temp)}°C</div>
   
     <img class="city-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
     <figcaption>${description}</figcaption>
   </li> 
     
     `;
}

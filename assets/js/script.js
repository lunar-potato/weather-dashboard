$(document).ready(function () {
  function displayCurrentWeather(city) {
    let apiKey = "69282173b39812bf0a7816a3cef4915a";
    let currentWeatherAPI =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey +
      "&units=metric";

    $.ajax({
      url: currentWeatherAPI,
      method: "GET",
    }).then(function (response) {
      let cityName = response.name;
      let currentDate = day.js().format("MM/DD/YYYY");
      let iconID = response.weather[0].icon;
      let iconURL = "https://openweathermap.org/img/w/" + iconID + ".png";
      let temperature = response.main.temp;
      let humidity = response.main.humidity;
      let windSpeed = response.wind.speed;

      let currentWeatherCard = $("<div>").addClass("card");
      let cardBody = $("<div>").addClass("card-body");
      let cardTitle = $("<h2>")
        .addClass("card-title")
        .text(cityName + " (" + currentDate + ")");
      let weatherIcon = $("<img>")
        .attr("src", iconURL)
        .attr("alt", "Weather Icon");
      let tempEl = $("<p>")
        .addClass("card-text")
        .text("Temperature: " + temperature + "°C");
      let humidityEl = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + humidity + "%");
      let windEl = $("<p>")
        .addClass("card-text")
        .text("Wind Speed: " + windSpeed + " m/s");

      cardTitle.append(weatherIcon);
      cardBody.append(cardTitle, tempEl, humidityEl, windEl);
      currentWeatherCard.append(cardBody);

      $("#today").empty().append(currentWeatherCard);
    });
  }

  function displayForecast(city) {
    let apiKey = "69282173b39812bf0a7816a3cef4915a";
    let fiveForecastAPI =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      apiKey +
      "&units=metric";

    $.ajax({
      url: fiveForecastAPI,
      method: "GET",
    }).then(function (response) {
      let forecastData = response.list;

      let forecastCard = $("<div>").addClass("card");
      let cardBody = $("<div>").addClass("card-body");
      let cardTitle = $("<h2>").addClass("card-title").text("5-Day Forecast");

      let forecastRow = $("<div>").addClass("row");

      for (let i = 0; i < forecastData.length; i++) {
        if (forecastData[i].dt_txt.includes("15:00:00")) {
          let date = dayjs(forecastData[i].dt_txt).format("MM/DD/YYYY");
          let iconID = forecastData[i].weather[0].icon;
          let iconURL = "https://openweathermap.org/img/w/" + iconID + ".png";
          let temperature = forecastData[i].main.temp;
          let humidity = forecastData[i].main.humidity;

          let forecastCol = $("<div>").addClass("col-md");
          let forecastCardInner = $("<div>").addClass("card");
          let innerCardBody = $("<div>").addClass("card-body");

          let dateEl = $("<p>").addClass("card-text").text(date);
          let weatherIcon = $("<img>").attr("src", iconURL).attr("alt", "Weather Icon");
          let tempEl = $("<p>").addClass("card-text").text("Temp: " + temperature + "°C");
          let humidityEl = $("<p>").addClass("card-text").text("Humidity: " + humidity + "%");

          innerCardBody.append(dateEl, weatherIcon, tempEl, humidityEl);
          forecastCardInner.append(innerCardBody);
          forecastCol.append(forecastCardInner);
          forecastRow.append(forecastCol);
        }
      }

      cardBody.append(cardTitle, forecastRow);
      forecastCard.append(cardBody);

      $("#forecast").empty().append(forecastCard);
    });
  }

  function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    $("#history").empty();

    for (let i = 0; i < searchHistory.length; i++) {
        let listItem = $("<button>").addClass("list-group-item list-group-item-action").text(searchHistory[i]);
        $("#history").append(listItem);
    }
  }

  function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);

        if (searchHistory.length > 10) {
            searchHistory.pop();
        }

        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        displaySearchHistory();
    }
  }

  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    let city = $("#search-input").val().trim();

    if (city !== "") {
      displayCurrentWeather(city);
      displayForecast(city);
      saveSearchHistory(city);
      $("#search-input").val("");
    }
  });

  $(document).on("click", ".list-group-item", function () {
    let city = $(this).text();
    displayCurrentWeather(city);
    displayForecast(city);
  });

  displaySearchHistory();
});

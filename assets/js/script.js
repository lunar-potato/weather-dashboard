$(document).ready(function () {
  // Function which displays current weather conditions
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

      // Creating weather card (current)
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

      // Appending elements to current weather card
      cardTitle.append(weatherIcon);
      cardBody.append(cardTitle, tempEl, humidityEl, windEl);
      currentWeatherCard.append(cardBody);

      // Displaying current weather
      $("#today").empty().append(currentWeatherCard);
    });
  }

  // Function which displays the forecast for 5 days
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

      // Creating forecast card
      let forecastCard = $("<div>").addClass("card");
      let cardBody = $("<div>").addClass("card-body");
      let cardTitle = $("<h2>").addClass("card-title").text("5-Day Forecast");

      // Creating row for the forecast
      let forecastRow = $("<div>").addClass("row");

      // Looping through the forecast data and then creating cards for each day
      for (let i = 0; i < forecastData.length; i++) {
        if (forecastData[i].dt_txt.includes("15:00:00")) {
          let date = dayjs(forecastData[i].dt_txt).format("MM/DD/YYYY");
          let iconID = forecastData[i].weather[0].icon;
          let iconURL = "https://openweathermap.org/img/w/" + iconID + ".png";
          let temperature = forecastData[i].main.temp;
          let humidity = forecastData[i].main.humidity;

          // Creating a column for each of the day's forecast
          let forecastCol = $("<div>").addClass("col-md");
          let forecastCardInner = $("<div>").addClass("card");
          let innerCardBody = $("<div>").addClass("card-body");

          // Creating elements for the forecast
          let dateEl = $("<p>").addClass("card-text").text(date);
          let weatherIcon = $("<img>")
            .attr("src", iconURL)
            .attr("alt", "Weather Icon");
          let tempEl = $("<p>")
            .addClass("card-text")
            .text("Temp: " + temperature + "°C");
          let humidityEl = $("<p>")
            .addClass("card-text")
            .text("Humidity: " + humidity + "%");

          // Appending elements accordingly  
          innerCardBody.append(dateEl, weatherIcon, tempEl, humidityEl);
          forecastCardInner.append(innerCardBody);
          forecastCol.append(forecastCardInner);
          forecastRow.append(forecastCol);
        }
      }

      // Appending elements accordingly
      cardBody.append(cardTitle, forecastRow);
      forecastCard.append(cardBody);


      // Displaying the forecast
      $("#forecast").empty().append(forecastCard);
    });
  }

  // Fucntion which dispalys search history
  function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Clearing any existing history
    $("#history").empty();

    // Looping through the search history then creates list items
    for (let i = 0; i < searchHistory.length; i++) {
      let listItem = $("<button>")
        .addClass("list-group-item list-group-item-action")
        .text(searchHistory[i]);
      $("#history").append(listItem);
    }
  }

  // Function which saves seasrch history to user local storage
  function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Check if the city is in the history
    if (!searchHistory.includes(city)) {
      // Adding city to the beginning of the history array  
      searchHistory.unshift(city);

      // Limiting history to 10 items
      if (searchHistory.length > 10) {
        searchHistory.pop();
      }

      // Saving updated history to local storage
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

      // Updating the displayed serach history
      displaySearchHistory();
    }
  }

  // Event listener for the serach form 
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

  // Event listener for clicking on a city in search history
  $(document).on("click", ".list-group-item", function () {
    let city = $(this).text();
    displayCurrentWeather(city);
    displayForecast(city);
  });

  // Initializing search history on page load
  displaySearchHistory();
});

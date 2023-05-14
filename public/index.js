$("#weather-card").hide();
$("#error-message").hide();
const wind = '<svg height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 15H18.5C20.43 15 22 16.57 22 18.5C22 20.43 20.43 22 18.5 22C16.57 22 15 20.43 15 18.5V18" stroke="#fffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.4" d="M2 12H18.5C20.42 12 22 10.43 22 8.5C22 6.58 20.42 5 18.5 5C16.58 5 15 6.57 15 8.5V9" stroke="#fffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 9.00012H9.31C10.8 9.00012 12 7.79012 12 6.31012C12 4.82012 10.79 3.62012 9.31 3.62012C7.82 3.62012 6.62 4.83012 6.62 6.31012V6.69012" stroke="#fffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>'

// add enter key event listener to the search input
$("#search-term").keypress((e) => {
  if (e.which == 13) {
    $("#search-button").click();
  }
});


$("#search-button").click(() => {

  // remove error if any
  if ($("#error-message").is(":visible")) {
    $("#error-message").slideUp();
  }

  var city = $("#search-term").val();
  // fetching the weather data from the server
  fetch("/api/weather/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ city: city }),
  })
    .then(response => response.json())
    .then(data => {
      displayData(data);
    })
    .catch(error => {
      $("#error-message").html(error);
      $("#error-message").slideDown();
    });

});


function displayData(data) {
  // display data
  if (data.cod == 404) {
    $("#error-message").html(data.message.toUpperCase());
    $("#error-message").slideDown();
    return;
  }
  const card = $("#weather-card");
  if (card.is(":hidden")) {
    setData(data);
    card.slideDown();
    return;
  }
  $("#weather-card").slideUp(() => {
    setData(data);
    card.slideDown();
  })
};

function setData(data) {
  $("#weather-icon").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
  $("#degree").html(Math.round(data.main.temp) + "°C");
  $("#condition").html(data.weather[0].main);
  $("#wind").html(wind + data.wind.speed);
  $("#sunrise").html("<img src='https://www.svgrepo.com/show/276666/sunrise-morning.svg' height='30px'>" + unixTimestampToDateTimeString(data.sys.sunrise));
  $("#sunset").html("<img src='https://www.svgrepo.com/show/276661/sunset.svg' height='30px'>" + unixTimestampToDateTimeString(data.sys.sunset));
  $("#city-name").html(data.name + "," + data.sys.country);
  $("#weather-card").slideDown();
}


function unixTimestampToDateTimeString(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();
  const formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  return formattedTime;
}



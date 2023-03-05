var searchCityEl = document.querySelector('#search-form');
var currentWeatherEl = document.querySelector('.todays-weather');
var futureWeatherEl = document.querySelector('.upcoming-weather');

var cityLon = '';
var cityLat = '';

var currDay = dayjs().format('(M/D/YYYY)');

function getParams() {
    //get the search parameter from the url
    var getParams = document.location.search.split('=');
    console.log(getParams);
    var searchCity = getParams[1];
    console.log(searchCity);

    //function call to geo location api
    searchCities(searchCity);

}

function searchCities(searchCity) {

    var getGeoLoc = 'https://api.openweathermap.org/geo/1.0/direct?limit=5&appid=43b8c16645fd2e7758cee078f50a7301';
    //if searchCity Param exists it adds it to the query for the api call for the lon lat 

    if (searchCity) {
        getGeoLoc = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchCity + '&limit=5&appid=43b8c16645fd2e7758cee078f50a7301&units';
    }

    console.log(getGeoLoc);

    //Fetching lon lat parameters 
    fetch(getGeoLoc).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                //check to verify location is in the US
                for (var i = 0; i < data.length; i++) {

                    //if it is it takes the lon lat and ends the for loop
                    if (data[i].country === 'US') {
                        console.log('This location is in the US');
                        cityLon = data[i].lon;
                        cityLat = data[i].lat;

                        getcurrentWeather(cityLon, cityLat);
                        getForecastDetail(cityLon, cityLat);
                        return;
                    } else {
                        console.log('This location is not in the US');
                    }
                }
            })
        }
    })
}


//Get 5 day forecast detail using lon lat 
function getForecastDetail(cityLon, cityLat) {
    console.log(cityLon, cityLat);

    var getCityWeather = 'https://api.openweathermap.org/data/2.5/forecast?&appid=43b8c16645fd2e7758cee078f50a7301&units=imperial';

    //if lon and lat exist then add the lat to the api link
    if (cityLon) {
        getCityWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat;
    }

    //add lon to the api link
    getCityWeather = getCityWeather + '&lon=' + cityLon + '&appid=43b8c16645fd2e7758cee078f50a7301&units=imperial';
    console.log(getCityWeather);

    //call to the weather api
    fetch(getCityWeather).then(function (response) {
        if (response.ok) {
            response.json().then(function (results) {
                //logs results to the console
                console.log(results);

                // set lower date range to the start of the day after the current date
                var startDateTime = dayjs().add(1, 'day').startOf('day').unix();

                //set upper date range to the start of the day after the 5th day from the current date
                var endDateTime = dayjs().add(6, 'day').startOf('day').unix();

                console.log(startDateTime, endDateTime);

                //print results to the screen
                for (var i = 0; i < results.list.length; i++) {

                    var forecastObject = results.list[i];
                    //checks to see if the dt field falls within the start and end date date range
                    if (forecastObject.dt > startDateTime && forecastObject.dt < endDateTime) {
                        //if condition to call the display5dayWeather function only for the noon time stamp of each date within the 5 day forecast range 
                        if (forecastObject.dt_txt.includes('12:00:00')) {
                            console.log(forecastObject);
                            display5DayWeather(forecastObject);
                        }
                    }


                }
            })
        }
    })
}

//get current weather forecast using lon lat

function getcurrentWeather(cityLon, cityLat) {

    var getCurrentWeather = 'https://api.openweathermap.org/data/2.5/weather?&appid=43b8c16645fd2e7758cee078f50a7301&units=imperial';

    //if lon and lat exist then add the lat to the api link
    if (cityLon) {
        getCurrentWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat;
    }

    //add lon to the api link
    getCurrentWeather = getCurrentWeather + '&lon=' + cityLon + '&appid=43b8c16645fd2e7758cee078f50a7301&units=imperial';
    console.log(getCurrentWeather);

    //call to the weather api
    fetch(getCurrentWeather).then(function (response) {
        if (response.ok) {
            response.json().then(function (results) {
                //logs results to the console
                console.log(results);

                //create card div section
                var weatherBody = document.createElement('div');
                weatherBody.classList.add('weather-body');

                //creates h1 tag and adds current city and date 
                var selectedCity = document.createElement('h1');
                selectedCity.textContent = results.name + ' ' + currDay;

                //Get weather icon
                var currIcon = document.createElement('img');
                getIcon = 'http://openweathermap.org/img/wn/' + results.weather[0].icon + '@2x.png';
                currIcon.setAttribute('src', getIcon)

                //creates p tag and adds current temperature
                var currTemp = document.createElement('p');
                currTemp.textContent = 'Temp: ' + results.main.temp + ' °F';

                //creates p tag and adds current wind speed
                var currWind = document.createElement('p');
                currWind.textContent = 'Wind: ' + results.wind.speed + ' MPH';

                //creates p tag and adds current humidity
                var currHumidity = document.createElement('p');
                currHumidity.textContent = 'Humidity: ' + results.main.humidity + ' %';

                //adds current weather to 'todays-weather' class section of HTML
                weatherBody.append(selectedCity, currIcon, currTemp, currWind, currHumidity);
                currentWeatherEl.append(weatherBody);

            })
        }
    })
}

//Function to display the 5 day forecast

function display5DayWeather(resultObj) {
    // console.log(resultObj);

    var forecastDay = dayjs(resultObj.dt_txt).format('M/D/YYYY');

    //create card div section
    var resultCard = document.createElement('div');
    resultCard.classList.add('card');

    //create card body div and appent to result card for 5 day forecast
    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    //creates h1 tag and adds current city and date 
    var forecastDate = document.createElement('h1');
    forecastDate.textContent = forecastDay;

    //get weather icon
    var forecastIcon = document.createElement('img');
    dayIcon = 'http://openweathermap.org/img/wn/' + resultObj.weather[0].icon + '@2x.png';
    forecastIcon.setAttribute('src', dayIcon);

    //creates p tag and adds current temperature
    var forecastTemp = document.createElement('p');
    forecastTemp.textContent = 'Temp: ' + resultObj.main.temp + ' °F';

    //creates p tag and adds current wind speed
    var forecastWind = document.createElement('p');
    forecastWind.textContent = 'Wind: ' + resultObj.wind.speed + ' MPH';

    //creates p tag and adds current humidity
    var forecastHumidity = document.createElement('p');
    forecastHumidity.textContent = 'Humidity: ' + resultObj.main.humidity + ' %';

    // Add  created 5 day forecast to 'upcoming-weather' section
    resultBody.append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity);

    futureWeatherEl.append(resultCard);

}

getParams();
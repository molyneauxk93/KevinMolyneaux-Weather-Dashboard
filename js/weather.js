var searchCityEl = document.querySelector('#search-form');
var currentWeatherEl = document.querySelector('.todays-weather');
var futureWeatherEl = document.querySelector('.upcoming-weather');

var cityLon = '';
var cityLat = '';

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

    var getGeoLoc = 'http://api.openweathermap.org/geo/1.0/direct?limit=5&appid=43b8c16645fd2e7758cee078f50a7301';
    //if searchCity Param exists it adds it to the query for the api call for the lon lat 

    if(searchCity) {
        getGeoLoc = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchCity + '&limit=5&appid=43b8c16645fd2e7758cee078f50a7301';
    }

    console.log(getGeoLoc);

    //Fetching lon lat parameters 
    fetch(getGeoLoc).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);

                //check to verify location is in the US
                for (var i=0; i< data.length; i++){

                    //if it is it takes the lon lat and ends the for loop
                    if(data[i].country === 'US'){
                        console.log('This location is in the US');
                        cityLon = data[i].lon;
                        cityLat = data[i].lat;

                        getWeatherDetail(cityLon, cityLat);
                        return;
                    } else {
                        console.log('This location is not in the US');
                    }
                }
            })
        }
    })
}

function getWeatherDetail(cityLon, cityLat) {
    console.log(cityLon, cityLat);

    var getCityWeather = 'http://api.openweathermap.org/data/2.5/forecast?&appid=43b8c16645fd2e7758cee078f50a7301';

    //if lon and lat exist then add the lat to the api link
    if(cityLon) { 
        getCityWeather = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat;
    }

    //add lon to the api link
    getCityWeather = getCityWeather + '&lon=' + cityLon + '&appid=43b8c16645fd2e7758cee078f50a7301';
    console.log(getCityWeather);

    //call to the weather api
    fetch(getCityWeather).then(function(response){
        if(response.ok){
            response.json().then(function(results){
                //logs results to the console
                console.log(results);
            })
        }
    })
}

getParams();
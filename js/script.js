var searchCityEl = document.querySelector('#search-form');

function searchCitySubmit(event){
    event.preventDefault();
    //get input from search 
    var cityInputVal = document.querySelector('#weather-search').value;
    console.log(cityInputVal);

    //validate that input is not empty
    if(!cityInputVal) {
        console.error('You need to enter a city to get the weather!');
        return;
    }
    //adds query search to the weather-display.html call
    var queryString = './weather-display.html?q=' + cityInputVal;

    //assigns query string as the url
    location.assign(queryString);
}

//event listener for search button
searchCityEl.addEventListener('submit', searchCitySubmit);
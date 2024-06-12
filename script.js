const API_KEY = '3d7a17012bef44deac1453d0f9b74f19'

const STATE = {
    route: 'landingPage'
}
/* ---------- CHECK/UPDATE STATE ---------- */
const setState = (newItem, currentState = STATE) => {
    const newState = Object.assign({}, currentState, newItem);
    Object.assign(currentState, newState)

    render();
}
/* ---------- TEMPLATE HELPERS ---------- */

const createWeatherData = (response) => {
    const data = JSON.parse(response);
    const dataWeather = data.data
    console.log('data: ', data)

    let html = "";
    for (let i = 0; i < 6; ++i) {
        html += `
    <div class="box${i}">
        <p>${dataWeather[i].datetime.slice(5, 12)}</p>
        <img src="https://cdn.weatherbit.io/static/img/icons/${dataWeather[i].weather.icon}.png">
        <p>${dataWeather[i].max_temp + "/" + dataWeather[i].min_temp + "°F"}</p>
        <p>${dataWeather[i].weather.description}</p>
    </div>`

    }
    $("#forecast").append(html)

}

/* ---------- TEMPLATES ---------- */

const landingPage = (`
<div class="weather-image">
    <img src="sky.png" alt="sun and clouds" id="weather-png">
</div>
`)


const userSearch = (`
<div class="input-container">
    <form class="user-search">
        <label for="inputCity">City:</label>
        <input class="city" id="cityText" type="text" placeholder="enter city" required>
        <button type="submit" id="enterButton">Search</button>
    </form>
</div>
`)

/* ---------- RENDER FUNCTION ---------- */
const renderUserSearch = () => {
    $('#input').html(userSearch);
}

const renderLandingPage = () => {
    $('#logo').html(landingPage);
}

const renderForecast = (response) => {
    const forecastWeather = createWeatherData(response)
    $('#forecast').html(forecastWeather)
}
const render = () => {
    renderUserSearch();
    if (STATE.route === 'forecastPage') {
        $("#logo").remove();
    } else {
        renderLandingPage()
    }

};
/* ---------- AJAX REQUEST ---------- */

const getWeatherData = (query) => {
    const options = {
        type: 'GET',
        "url": `https://api.weatherbit.io/v2.0/forecast/daily?city=${query}&units=I&key=${API_KEY}`,
        success: data => {
            console.log(data);
            renderForecast(JSON.stringify(data));
        },
        error: function (err) {
            console.log(err);
        }
    }
    $.ajax(options)
}

/* ---------- EVENT HANDLERS---------- */

const inputHandler = (event) => {
    event.preventDefault();
    const userCity = $(event.currentTarget).find('.city').val();
    console.log('userCity: ', userCity);
    getWeatherData(userCity);
    setState({ route: 'forecastPage' })
}

/* ---------- EVENT LISTENERS ---------- */

$('body').on('submit', '.user-search', event => inputHandler(event));



/* ---------- LOAD PAGE ---------- */
$(render)

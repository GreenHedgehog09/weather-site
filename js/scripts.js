let intervalId; // Хранение состояния обновления данных

// Асинхронный запрос погоды
async function requestWeather(search) {
    const weatherBlock = document.querySelector('#weather-data')
    const server = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${search}&appid=e7dae89c52643080a76e20f9ec6f3231`
    const response = await fetch(server, {
        method: 'GET',
    })
    // Сохранение результата
    const resResult = await response.json()

    // Проверка ответа
    if (response.ok) {
        insertWeatherBlock(resResult, weatherBlock)
        return true
    } else {
        const template = `<div class="weather-error">ERROR: ${resResult.message}</div>`

        weatherBlock.innerHTML = template
        console.log("Ошибка")
        return false
    }
}

// Отображение погоды
function insertWeatherBlock(data, weatherBlock) {
    // console.log(data)
    // Подготовка данных
    const location = data.name
    const temp = Math.round(data.main.temp)
    const feelsLike = Math.round(data.main.feels_like)
    const weatherStatus = data.weather[0].main
    const weatherIcon = data.weather[0].icon

    // Текущее время
    const nowTime = new Date();
    const year = nowTime.getFullYear();
    const month = addFormat(nowTime.getMonth() + 1);
    const day = addFormat(nowTime.getDate());
    const time = nowTime.toLocaleTimeString();

    const strTime = `${day}.${month}.${year} ${time}`

    const template = `
    <div class="weather">
    <div class="weather-header">
        <div class="weather-main">
            <div class="weather-city">${location}</div>
            <div class="weather-status">${weatherStatus}</div>
        </div>
        <div class="weather-icon">
            <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherStatus}">
        </div>
    </div>
    <div class="weather-temp">${temp}</div>
    <div class="weather-down">
        <div class="weather-feels-like">Feels like: ${feelsLike}</div>
        <div class="weather-update">${strTime}</div>
    </div></div>`

    // Вставка
    weatherBlock.innerHTML = template

}

// Добавляем 0 вначало если нужно
function addFormat(number) {
    return number < 10 ? "0" + number : number;
}

function startInterval(search) {
    // Запускаем интервал для обновления данных каждые 20 секунд
    intervalId = setInterval(() => {
        requestWeather(search);
    }, 20000);
}

function stopInterval() {
    // Останавливаем текущий интервал
    clearInterval(intervalId);
}

// Главная функция
const main = () => {
    // Остановка обновления данных прошлого города
    stopInterval();

    const searchData = document.getElementById('search-data');
    console.log('Поиск:', searchData.value);

    // Ошибка - если поле пустое
    if (searchData.value === '') {
        alert("Error, field cannot be empty!")
        return;
    }

    // Запрос на получение данных
    let check = requestWeather(searchData.value)

    if (check) {
        // Обновление данных погоды
        startInterval(searchData.value)
    }

    // Очистка поля поиска
    searchData.value = ''
}
document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    const apiKey = '75a8f48a5d6eee6708814290c6b93443'; // Замените на свой API-ключ
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Город не найден');
            }
            return response.json();
        })
        .then(data => {
            const weatherResult = document.getElementById('weatherResult');
            weatherResult.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Температура: ${data.main.temp} °C</p>
                <p>Влажность: ${data.main.humidity}%</p>
            `;

            // Показываем кнопку "Закрепить"
            document.getElementById('pinWeather').style.display = 'inline-block';

            // Обработчик для кнопки "Закрепить"
            document.getElementById('pinWeather').onclick = function() {
                const pinnedData = {
                    name: data.name,
                    country: data.sys.country,
                    temp: data.main.temp,
                    description: data.weather[0].description,
                    humidity: data.main.humidity
                };

                // Сохраняем карточку в localStorage
                savePinnedWeather(pinnedData);
                renderPinnedWeather(pinnedData);
            };
        })
        .catch(error => {
            const weatherResult = document.getElementById('weatherResult');
            weatherResult.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
});

// Восстанавливаем закрепленную погоду при загрузке страницы
window.onload = function() {
    const pinnedWeathers = JSON.parse(localStorage.getItem('pinnedWeathers')) || [];
    pinnedWeathers.forEach(renderPinnedWeather);
};

// Функция для рендеринга закрепленной погоды
function renderPinnedWeather(data) {
    const pinnedWeather = document.getElementById('pinnedWeather');
    const pinnedCard = document.createElement('div');
    pinnedCard.className = 'pinned-card';
    pinnedCard.innerHTML = `
        <h2>${data.name}, ${data.country}</h2>
        <p>Температура: ${data.temp} °C</p>
        <p>Влажность: ${data.humidity}%</p>
        <button class="removeWeather">Убрать</button>
    `;
    
    // Добавляем обработчик для кнопки "Убрать"
    pinnedCard.querySelector('.removeWeather').onclick = function() {
        removePinnedWeather(data);
        pinnedWeather.removeChild(pinnedCard);
    };

    pinnedWeather.appendChild(pinnedCard);
}

// Функция для сохранения закрепленной погоды в localStorage
function savePinnedWeather(data) {
    const pinnedWeathers = JSON.parse(localStorage.getItem('pinnedWeathers')) || [];
    pinnedWeathers.push(data);
    localStorage.setItem('pinnedWeathers', JSON.stringify(pinnedWeathers));
}

// Функция для удаления закрепленной погоды из localStorage
function removePinnedWeather(data) {
    let pinnedWeathers = JSON.parse(localStorage.getItem('pinnedWeathers')) || [];
    pinnedWeathers = pinnedWeathers.filter(item => 
        item.name !== data.name || 
        item.country !== data.country || 
        item.temp !== data.temp || 
        item.description !== data.description || 
        item.humidity !== data.humidity
    );
    localStorage.setItem('pinnedWeathers', JSON.stringify(pinnedWeathers));
}



// створення масиву обєктів за прикладом з лаби 3 але з моїми фільмами
const movieAfisha = [
  { id: 1, "movie title": "Проєкт «Аве Марія»", info: { director: "Філ Лорд", year: 2024 }, rating: 8.5, "is 3D": true },
  { id: 2, "movie title": "Хранителі лісу 2", info: { director: "Свен Унтервальдт мол.", year: 2023 }, rating: 6.5, "is 3D": false },
  { id: 3, "movie title": "Колючка Голлі", info: { director: "Анонс", year: 2024 }, rating: 7.2, "is 3D": false },
  { id: 4, "movie title": "Голос океану", info: { director: "Реза Мемарі", year: 2024 }, rating: 7.0, "is 3D": true },
  { id: 5, "movie title": "Сезон полювання 2", info: { director: "Фредерік Форестьє", year: 2024 }, rating: 6.9, "is 3D": false },
  { id: 6, "movie title": "Кутюр", info: { director: "Аліс Винокур", year: 2023 }, rating: 6.8, "is 3D": false },
  { id: 7, "movie title": "Асистент патологоанатома", info: { director: "Джеремі Кіпп", year: 2024 }, rating: 4.1, "is 3D": true },
  { id: 8, "movie title": "На Драйві", info: { director: "Dream Film", year: 2024 }, rating: 5.5, "is 3D": true }
];

// робота з масивами використовую методи filter та map як у прикладі
// фільтрую фільми з високим рейтингом більше 7
const topMovies = movieAfisha.filter(m => m.rating > 7.0);
// створюю список назв моїх фільмів через метод map
const movieTitles = movieAfisha.map(m => m["movie title"]);

// робота з set для отримання унікальних форматів за зразком з файлу
const formats = new Set(movieAfisha.map(m => m["is 3D"]));

// робота з map для швидкого пошуку цін на квитки
const priceList = new Map();
// заповнюю мап назвами своїх фільмів та цінами як у методичці
movieAfisha.forEach(m => priceList.set(m["movie title"], 150));
// отримую ціну для конкретного мого фільму за ключем
const ticketPrice = priceList.get("Проєкт «Аве Марія»");

// доступ до полів обєкта з пробілами через квадратні дужки
const landmark = {
  "landmark name": "Оперний Театр",
  geo: { lat: 50.44, lng: 30.51 }
};

const name = landmark["landmark name"];

// лр4 динамічний каталог
document.addEventListener('DOMContentLoaded', function() {
  const catalogBody = document.getElementById('catalog-body');
  if (!catalogBody) return;

  // створення фрагмента та наповнення його картками фільмів через createelement
  const fragment = document.createDocumentFragment();

  movieAfisha.forEach(function(movie) {
    const card = document.createElement('article');
    card.className = 'bg-white rounded-lg shadow-lg p-4 transition duration-300 hover:scale-105 hover:shadow-xl';
    card.dataset.id = movie.id;

    const title = document.createElement('h4');
    title.className = 'font-bold text-lg mb-1 text-ink-soft';
    title.textContent = movie['movie title'];
    card.appendChild(title);

    const director = document.createElement('p');
    director.className = 'text-sm text-copper-dim mb-1';
    director.textContent = 'Режисер: ' + movie.info.director;
    card.appendChild(director);

    const rating = document.createElement('p');
    rating.className = 'text-sm text-ink';
    rating.textContent = 'Рейтинг: ' + movie.rating;
    card.appendChild(rating);

    const btn = document.createElement('button');
    btn.className = 'mt-2 px-3 py-1 bg-copper text-white rounded';
    btn.textContent = 'Детальніше';
    btn.dataset.id = movie.id;
    card.appendChild(btn);

    fragment.appendChild(card);
  });

  catalogBody.appendChild(fragment);
});

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

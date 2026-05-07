// база даних афіши фільмів варіант 15
const movieAfisha = [
  {
    "movie title": "проєкт аве марія",
    rating: 8.5,
    "is 3d": true
  },
  {
    "movie title": "хранителі лісу 2",
    rating: 6.5,
    "is 3d": false
  },
  {
    "movie title": "колючка голлі",
    rating: 7.2,
    "is 3d": false
  },
  {
    "movie title": "голос океану",
    rating: 7.0,
    "is 3d": true
  },
  {
    "movie title": "сезон полювання 2",
    rating: 6.9,
    "is 3d": false
  },
  {
    "movie title": "кутюр",
    rating: 6.8,
    "is 3d": false
  },
  {
    "movie title": "асистент патологоанатома",
    rating: 4.1,
    "is 3d": true
  },
  {
    "movie title": "на драйві",
    rating: 5.5,
    "is 3d": true
  }
];

// фільтрація фільмів з рейтингом вище 8.0
const topRated = movieAfisha.filter(function(movie) {
  return movie.rating > 8.0;
});

// трансформація в масив назв через мап
const topTitles = topRated.map(function(movie) {
  return movie["movie title"];
});

console.log("фільми з рейтингом вище 8.0:", topTitles);

// отримання унікальних форматів перегляду через сет
const formats = new Set(movieAfisha.map(function(movie) {
  return movie["is 3d"];
}));

console.log("унікальні формати перегляду:", formats);

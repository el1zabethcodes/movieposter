// пошук контейнера каталогу та перевірка його наявності в дом дереві
const catalogBody = document.querySelector('#catalog-body');
if (!catalogBody) {
  // зупинка виконання скрипту якщо контейнер не знайдено
  console.warn('контейнер каталогу не знайдено на сторінці');
}

// повний масив обєктів з дванадцяти фільмів кіноафіші
const movies = [
  { id: 1, title: 'Проєкт Аве Марія', director: 'Філ Лорд, Крістофер Міллер', rating: '8.5', format: '3D', age: '12+', price: 150, img: 'img/hail-mary.jpg', trailer: 'video/hail-mary.mp4' },
  { id: 2, title: 'Хранителі лісу 2', director: 'Sven Unterwaldt jr.', rating: '6.5', format: '2D', age: '6+', price: 120, img: 'img/woodwalkers-2.jpg', trailer: 'video/woodwalkers-2.mp4' },
  { id: 3, title: 'Колючка Голлі', director: 'Анонс', rating: '7.2', format: '2D', age: '0+', price: 100, img: 'img/hollie-hedgehog.jpg', trailer: 'video/hollie-hedgehog.mp4' },
  { id: 4, title: 'Голос океану', director: 'Реза Мемарі', rating: '7.0', format: '3D', age: '0+', price: 140, img: 'img/voice-ocean.jpg', trailer: 'video/voice-ocean.mp4' },
  { id: 5, title: 'Сезон полювання 2', director: 'Фредерік Форестьє, Антонін Фурлон', rating: '6.9', format: '2D', age: '12+', price: 130, img: 'img/chasse-gardee-2.jpg', trailer: 'video/chasse-gardee-2.mp4' },
  { id: 6, title: 'Кутюр', director: 'Аліс Винокур', rating: '6.8', format: '2D', age: '16+', price: 160, img: 'img/couture.jpg', trailer: 'video/couture.mp4' },
  { id: 7, title: 'Асистент патологоанатома', director: 'Джеремі Кіпп', rating: '4.1', format: '3D', age: '18+', price: 170, img: 'img/mortuary-assistant.jpg', trailer: 'video/mortuary-assistant.mp4' },
  { id: 8, title: 'На Драйві', director: 'Dream Film, A17', rating: '5.5', format: '3D', age: '12+', price: 110, img: 'img/na-draivi.jpg', trailer: 'video/na-draivi.mp4' },
  { id: 9, title: 'Володарі Всесвіту', director: 'Тревіс Найт', rating: '8.0', format: '3D', age: '12+', price: 160, img: 'img/masters-universe.jpeg', trailer: 'video/masters-universe.mp4' },
  { id: 10, title: 'BACKROOMS: Залаштунки', director: 'Кейн Парсонс', rating: '7.5', format: '2D', age: '16+', price: 130, img: 'img/backrooms.jpg', trailer: 'video/backrooms.mp4' },
  { id: 11, title: 'Історія іграшок 5', director: 'Ендрю Стентон, Кенна Гарріс', rating: '9.0', format: '2D', age: '0+', price: 140, img: 'img/toy-story-5.jpg', trailer: 'video/toy-story-5.mp4' },
  { id: 12, title: 'Посіпаки і Монстряки', director: 'П\'єр Коффін', rating: '8.2', format: '3D', age: '0+', price: 150, img: 'img/minions-monsters.jpg', trailer: 'video/minions-monsters.mp4' }
];

if (catalogBody) {
  // створення легкого фрагмента для оптимізації рендерингу сторінки
  const fragment = document.createDocumentFragment();
  movies.forEach(movie => {
    // створення картки або рядка для кожного окремого фільму
    const card = document.createElement('div');
    card.classList.add('movie-card');

    // створення та безпечне додавання обкладинки фільму
    const image = document.createElement('img');
    image.src = movie.img;
    image.alt = movie.title;
    image.classList.add('movie-poster');

    // безпечне наповнення текстовим вмістом для захисту від атак
    const title = document.createElement('h3');
    title.textContent = movie.title;

    const info = document.createElement('p');
    info.textContent = `режисер: ${movie.director} | рейтинг: ${movie.rating}`;

    // створення кнопки детальніше з дата атрибутом ідентифікатора
    const detailsBtn = document.createElement('button');
    detailsBtn.textContent = 'Детальніше';
    detailsBtn.classList.add('details-btn');
    detailsBtn.dataset.id = movie.id;

    // створення кнопки купити для кошика
    const buyBtn = document.createElement('button');
    buyBtn.textContent = 'Купити';
    buyBtn.classList.add('buy-btn');
    buyBtn.dataset.id = movie.id;
    buyBtn.dataset.title = movie.title;

    card.append(image, title, info, detailsBtn, buyBtn);
    // додавання створеної картки до віртуального фрагменту в памяті
    fragment.append(card);
  });
  // вставка всіх елементів до реального дом дерева за один крок
  catalogBody.append(fragment);
}

if (catalogBody) {
  // встановлення єдиного обробника подій на батьківський контейнер
  catalogBody.addEventListener('click', (event) => {
    const target = event.target;

    // перевірка чи клік відбувся саме на кнопку детальніше
    if (target.classList.contains('details-btn')) {
      const movieId = target.dataset.id;
      const currentMovie = movies.find(m => m.id == movieId);
      if (currentMovie) {
        // виведення інформаційного вікна з описом фільму
        alert(`фільм: ${currentMovie.title}\nформат: ${currentMovie.format}\nвік: ${currentMovie.age}\nтрейлер: ${currentMovie.trailer}`);
      }
    }

    // логіка маніпуляції класами для виділення активної картки
    const closestCard = target.closest('.movie-card');
    if (closestCard && !target.classList.contains('buy-btn')) {
      // перемикання класу активності при кліку на картку
      closestCard.classList.toggle('active');
    }
  });
}

const feedbackForm = document.querySelector('#feedback-form');
if (feedbackForm) {
  // обробка події відправки форми зворотного звязку
  feedbackForm.addEventListener('submit', (event) => {
    // зупинка стандартної поведінки браузера щодо перезавантаження
    event.preventDefault();
    // успішне повідомлення користувача без оновлення сторінки
    alert('дякуємо ваше повідомлення успішно надіслано');
    feedbackForm.reset();
  });
}

const filterSelect = document.querySelector('#format-filter');
if (filterSelect) {
  // створення колекції сет для отримання унікальних форматів фільмів
  const uniqueFormats = new Set(movies.map(movie => movie.format));
  uniqueFormats.forEach(format => {
    // створення та наповнення опцій для випадаючого списку фільтрації
    const option = document.createElement('option');
    option.value = format;
    option.textContent = format;
    filterSelect.append(option);
  });
}

// ініціалізація структури мап для швидкого пошуку цін за назвою
const moviePrices = new Map();
movies.forEach(movie => moviePrices.set(movie.title, movie.price));

const cartContainer = document.querySelector('#cart-container');
if (catalogBody && cartContainer) {
  catalogBody.addEventListener('click', (event) => {
    const target = event.target;

    // перевірка кліку на кнопку купівлі квитка
    if (target.classList.contains('buy-btn')) {
      const movieTitle = target.dataset.title;
      // миттєве отримання ціни з колекції мап без перебору масиву
      const price = moviePrices.get(movieTitle);
      const movieCard = target.closest('.movie-card');
      if (movieCard) {
        // глибоке клонування вузла для додавання до панелі кошика
        const clonedCard = movieCard.cloneNode(true);
        // видалення кнопок з клонованої картки всередині кошика
        const clonedBtns = clonedCard.querySelectorAll('button');
        clonedBtns.forEach(btn => btn.remove());
        // додавання інформації про ціну квитка до клонованого елемента
        const priceInfo = document.createElement('p');
        priceInfo.textContent = `ціна квитка: ${price} грн`;
        clonedCard.append(priceInfo);
        // плавне додавання елемента до кошика з використанням стилів
        clonedCard.classList.add('cloned-item');
        cartContainer.append(clonedCard);
        alert(`фільм ${movieTitle} успішно додано до вашого кошика`);
      }
    }
  });
}

// зупинка перезавантаження сторінки при відправці форми контактів
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
  });
}

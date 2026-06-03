// клас для управління списком обраних фільмів у локальному сховищі
class WatchlistManager {
  constructor() {
    // ключ для збереження даних у локалсторейджі
    this.storageKey = 'movie_watchlist';
    // ініціалізація масиву обраного зі зчитуванням наявних даних
    this.favorites = this.loadFavorites();
  }

  // приватний метод для безпечного зчитування та парсингу даних
  loadFavorites() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      // повернення розпарсеного масиву або порожнього масиву
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      // повернення дефолтного значення у разі пошкодження структури json
      return [];
    }
  }

  // метод отримання актуального списку ідентифікаторів обраного
  getFavorites() {
    return this.favorites;
  }

  // метод перемикання стану фільму в обраному — додати або видалити
  toggleFavorite(movieId) {
    // приведення ідентифікатора до єдиного строкового формату
    const id = String(movieId);
    const index = this.favorites.indexOf(id);
    if (index === -1) {
      // додавання фільму до масиву якщо його там не було
      this.favorites.push(id);
    } else {
      // видалення фільму з масиву за його індексом якщо він там є
      this.favorites.splice(index, 1);
    }
    // збереження оновленого стану масиву у локалсторейджі
    this.save();
    return this.favorites.includes(id);
  }

  // метод збереження поточного стану масиву у вигляді рядка
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
  }
}

// створення єдиного екземпляра класу для управління закладками
const watchlist = new WatchlistManager();

// ============================================================

// пошук контейнера каталогу та перевірка його наявності в дом дереві
const catalogBody = document.querySelector('#catalog-body');
if (!catalogBody) {
  // зупинка виконання скрипту якщо контейнер не знайдено
  console.warn('контейнер каталогу не знайдено на сторінці');
}

// повний масив обєктів з дванадцяти фільмів кіноафіші
const movies = [
  { id: 1,  title: 'Проєкт Аве Марія',       director: 'Філ Лорд, Крістофер Міллер',    rating: '8.5', format: '3D', age: '12+', price: 150, img: 'img/hail-mary.jpg',          trailer: 'video/hail-mary-trailer.mp4' },
  { id: 2,  title: 'Хранителі лісу 2',        director: 'Sven Unterwaldt jr.',            rating: '6.5', format: '2D', age: '6+',  price: 120, img: 'img/woodwalkers-2.jpg',       trailer: '' },
  { id: 3,  title: 'Колючка Голлі',           director: 'Анонс',                          rating: '7.2', format: '2D', age: '0+',  price: 100, img: 'img/hollie-hedgehog.jpg',     trailer: '' },
  { id: 4,  title: 'Голос океану',            director: 'Реза Мемарі',                   rating: '7.0', format: '3D', age: '0+',  price: 140, img: 'img/voice-ocean.jpg',         trailer: '' },
  { id: 5,  title: 'Сезон полювання 2',       director: 'Фредерік Форестьє, Антонін Фурлон', rating: '6.9', format: '2D', age: '12+', price: 130, img: 'img/chasse-gardee-2.jpg', trailer: '' },
  { id: 6,  title: 'Кутюр',                   director: 'Аліс Винокур',                  rating: '6.8', format: '2D', age: '16+', price: 160, img: 'img/couture.jpg',             trailer: '' },
  { id: 7,  title: 'Асистент патологоанатома',director: 'Джеремі Кіпп',                  rating: '4.1', format: '3D', age: '18+', price: 170, img: 'img/mortuary-assistant.jpg',  trailer: '' },
  { id: 8,  title: 'На Драйві',               director: 'Dream Film, A17',               rating: '5.5', format: '3D', age: '12+', price: 110, img: 'img/na-draivi.jpg',           trailer: '' },
  { id: 9,  title: 'Володарі Всесвіту',       director: 'Тревіс Найт',                   rating: '8.0', format: '3D', age: '12+', price: 160, img: 'img/masters-universe.jpeg',   trailer: 'video/masters-universe.mp4' },
  { id: 10, title: 'BACKROOMS: Залаштунки',   director: 'Кейн Парсонс',                  rating: '7.5', format: '2D', age: '16+', price: 130, img: 'img/backrooms.jpg',           trailer: 'video/backrooms.mp4' },
  { id: 11, title: 'Історія іграшок 5',       director: 'Ендрю Стентон, Кенна Гарріс',   rating: '9.0', format: '2D', age: '0+',  price: 140, img: 'img/toy-story-5.jpg',         trailer: 'video/toy-story-5.mp4' },
  { id: 12, title: 'Посіпаки і Монстряки',    director: 'П\'єр Коффін',                  rating: '8.2', format: '3D', age: '0+',  price: 150, img: 'img/minions-monsters.jpg',    trailer: 'video/minions-monsters.mp4' }
];

// ============================================================
// МОДАЛЬНЕ ВІКНО
// ============================================================

// створення розмітки модального вікна та додавання до сторінки
const modalOverlay = document.createElement('div');
modalOverlay.id = 'modal-overlay';
modalOverlay.setAttribute('role', 'dialog');
modalOverlay.setAttribute('aria-modal', 'true');
modalOverlay.setAttribute('aria-labelledby', 'modal-title');
modalOverlay.innerHTML = `
  <div id="modal-box">
    <button id="modal-close" aria-label="закрити вікно">&times;</button>
    <img id="modal-img" src="" alt="">
    <div id="modal-info">
      <h3 id="modal-title"></h3>
      <p id="modal-director"></p>
      <p id="modal-meta"></p>
      <div id="modal-trailer-wrap"></div>
      <button id="modal-buy-btn" class="buy-btn"></button>
    </div>
  </div>
`;
document.body.append(modalOverlay);

// функція відкриття модального вікна з даними фільму
function openModal(movie) {
  document.getElementById('modal-img').src = movie.img;
  document.getElementById('modal-img').alt = movie.title;
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-director').textContent = `режисер: ${movie.director}`;
  document.getElementById('modal-meta').textContent = `формат: ${movie.format} · вік: ${movie.age} · рейтинг: ${movie.rating} · ціна: ${movie.price} грн`;

  // додавання трейлера якщо він є для цього фільму
  const trailerWrap = document.getElementById('modal-trailer-wrap');
  trailerWrap.innerHTML = '';
  if (movie.trailer) {
    const video = document.createElement('video');
    video.controls = true;
    video.setAttribute('aria-label', `трейлер фільму ${movie.title}`);
    const source = document.createElement('source');
    source.src = movie.trailer;
    source.type = 'video/mp4';
    video.append(source);
    trailerWrap.append(video);
  }

  const buyBtn = document.getElementById('modal-buy-btn');
  buyBtn.textContent = `купити квиток — ${movie.price} грн`;
  buyBtn.dataset.id = movie.id;
  buyBtn.dataset.title = movie.title;

  modalOverlay.classList.add('open');
  document.body.classList.add('modal-open');
  document.getElementById('modal-close').focus();
}

// функція закриття модального вікна
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  const video = modalOverlay.querySelector('video');
  if (video) video.pause();
}

// закриття по кнопці та по кліку на оверлей
document.getElementById('modal-close').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// закриття по клавіші escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ============================================================
// ТОСТ-ПОВІДОМЛЕННЯ замість alert
// ============================================================

// створення контейнера для тост-повідомлень
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
toastContainer.setAttribute('aria-live', 'polite');
document.body.append(toastContainer);

// функція показу тосту з текстом та типом success або error
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.append(toast);
  // запуск анімації появи через мікрозатримку
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3000);
}

// ============================================================
// КОШИК
// ============================================================

// ініціалізація структури мап для швидкого пошуку цін за назвою
const moviePrices = new Map();
movies.forEach(movie => moviePrices.set(movie.title, movie.price));

// стан кошика зберігається в масиві обєктів
let cart = [];

// пошук елементів кошика в дом дереві
const cartContainer = document.querySelector('#cart-container');
const cartCount = document.querySelector('#cart-count');
const cartTotal = document.querySelector('#cart-total');

// функція оновлення відображення кошика після кожної зміни
function renderCart() {
  if (!cartContainer) return;
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'cart-empty';
    empty.textContent = 'кошик порожній';
    cartContainer.append(empty);
  } else {
    cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      // використання клонованого вузла картки якщо він є
      if (item.clonedCard) {
        const thumb = item.clonedCard.querySelector('img');
        if (thumb) {
          const miniImg = thumb.cloneNode(true);
          miniImg.className = 'cart-item-thumb';
          row.append(miniImg);
        }
      }

      const name = document.createElement('span');
      name.className = 'cart-item-title';
      name.textContent = item.title;

      const price = document.createElement('span');
      price.className = 'cart-item-price';
      price.textContent = `${item.price} грн`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'cart-remove-btn';
      removeBtn.textContent = '×';
      removeBtn.setAttribute('aria-label', `видалити ${item.title}`);
      removeBtn.dataset.index = index;

      row.append(name, price, removeBtn);
      cartContainer.append(row);
    });
  }

  // оновлення лічильника та суми
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  if (cartCount) cartCount.textContent = cart.length;
  if (cartTotal) cartTotal.textContent = `${total} грн`;
}

// функція додавання фільму до кошика
function addToCart(movieId) {
  const movie = movies.find(m => m.id == movieId);
  if (!movie) return;

  // знаходимо картку фільму в каталозі для клонування вузла
  const sourceCard = catalogBody
    ? catalogBody.querySelector(`.movie-card[data-id="${movie.id}"]`)
    : null;

  // глибоке клонування вузла картки якщо вона є на сторінці
  let clonedCard = null;
  if (sourceCard) {
    clonedCard = sourceCard.cloneNode(true);
    // видалення кнопок з клонованої картки щоб не дублювати обробники
    clonedCard.querySelectorAll('button').forEach(btn => btn.remove());
    clonedCard.classList.remove('active');
  }

  // додавання обєкта до масиву стану кошика разом з клоном
  cart.push({ id: movie.id, title: movie.title, price: movie.price, clonedCard });
  renderCart();
  showToast(`${movie.title} додано до кошика`);
}

// делегування кліку на видалення з кошика
if (cartContainer) {
  cartContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-remove-btn')) {
      const index = Number(e.target.dataset.index);
      const removed = cart.splice(index, 1)[0];
      renderCart();
      showToast(`${removed.title} видалено з кошика`, 'error');
    }
  });
}

// обробка кліку купити всередині модального вікна
document.getElementById('modal-buy-btn').addEventListener('click', (e) => {
  addToCart(e.target.dataset.id);
  closeModal();
});

// ============================================================
// КАТАЛОГ — РЕНДЕРИНГ КАРТОК
// ============================================================

if (catalogBody) {
  // створення легкого фрагмента для оптимізації рендерингу сторінки
  const fragment = document.createDocumentFragment();
  movies.forEach(movie => {
    // створення картки для кожного окремого фільму
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.dataset.id = movie.id;
    card.dataset.format = movie.format;

    // створення та безпечне додавання обкладинки фільму
    const image = document.createElement('img');
    image.src = movie.img;
    image.alt = movie.title;
    image.classList.add('movie-poster');
    image.loading = 'lazy';

    // безпечне наповнення текстовим вмістом для захисту від атак
    const title = document.createElement('h3');
    title.textContent = movie.title;

    const info = document.createElement('p');
    info.textContent = `${movie.format} · ${movie.age} · ★ ${movie.rating}`;

    const director = document.createElement('p');
    director.className = 'movie-director';
    director.textContent = movie.director;

    // створення кнопки детальніше з дата атрибутом ідентифікатора
    const detailsBtn = document.createElement('button');
    detailsBtn.textContent = 'Детальніше';
    detailsBtn.classList.add('details-btn');
    detailsBtn.dataset.id = movie.id;

    // створення кнопки купити для кошика
    const buyBtn = document.createElement('button');
    buyBtn.textContent = `Купити — ${movie.price} грн`;
    buyBtn.classList.add('buy-btn');
    buyBtn.dataset.id = movie.id;
    buyBtn.dataset.title = movie.title;

    card.append(image, title, director, info, detailsBtn, buyBtn);
    // додавання створеної картки до віртуального фрагменту в памяті
    fragment.append(card);
  });
  // вставка всіх елементів до реального дом дерева за один крок
  catalogBody.append(fragment);
}

// ============================================================
// ДЕЛЕГУВАННЯ ПОДІЙ НА КАТАЛОГ
// ============================================================

if (catalogBody) {
  // встановлення єдиного обробника подій на батьківський контейнер
  catalogBody.addEventListener('click', (event) => {
    const target = event.target;

    // перевірка чи клік відбувся саме на кнопку детальніше
    if (target.classList.contains('details-btn')) {
      const movie = movies.find(m => m.id == target.dataset.id);
      if (movie) openModal(movie);
      return;
    }

    // перевірка кліку на кнопку купівлі квитка
    if (target.classList.contains('buy-btn')) {
      addToCart(target.dataset.id);
      return;
    }

    // логіка маніпуляції класами для виділення активної картки
    const closestCard = target.closest('.movie-card');
    if (closestCard) {
      // перемикання класу активності при кліку на картку
      closestCard.classList.toggle('active');
    }
  });
}

// ============================================================
// ФІЛЬТР ЗА ФОРМАТОМ
// ============================================================

const filterSelect = document.querySelector('#format-filter');
if (filterSelect && catalogBody) {
  // створення колекції сет для отримання унікальних форматів фільмів
  const uniqueFormats = new Set(movies.map(movie => movie.format));
  uniqueFormats.forEach(format => {
    // створення та наповнення опцій для випадаючого списку фільтрації
    const option = document.createElement('option');
    option.value = format;
    option.textContent = format;
    filterSelect.append(option);
  });

  // фільтрація карток при зміні вибраного формату
  filterSelect.addEventListener('change', () => {
    const selected = filterSelect.value;
    catalogBody.querySelectorAll('.movie-card').forEach(card => {
      card.style.display = (selected === 'all' || card.dataset.format === selected) ? '' : 'none';
    });
  });
}

// ============================================================
// ФОРМА ЗВОРОТНОГО ЗВ'ЯЗКУ — FormData + Object.fromEntries
// ============================================================

const feedbackForm = document.querySelector('#feedback-form, #contact-form');
if (feedbackForm) {
  // обробка події відправки форми зворотного звязку
  feedbackForm.addEventListener('submit', (event) => {
    // зупинка стандартної поведінки браузера щодо перезавантаження
    event.preventDefault();

    // перевірка валідності форми перед збором даних
    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      showToast('будь ласка заповніть усі обовязкові поля коректно', 'error');
      return;
    }

    // збір усіх полів форми через formdata без ручного зчитування значень
    const formData = new FormData(feedbackForm);

    // перетворення на чистий обєкт через object.fromentries для відправки
    const formObject = Object.fromEntries(formData.entries());

    // виведення зібраних даних у консоль для перевірки структури
    console.log('дані форми готові до відправки:', formObject);

    // показ тост-повідомлення замість alert після успішної валідації
    showToast('дякуємо ваше повідомлення успішно надіслано');

    // очищення форми тільки після успішної валідації та збору даних
    feedbackForm.reset();
  });
}

// ============================================================
// ЗАКРИТТЯ МОБІЛЬНОГО МЕНЮ ПРИ КЛІКУ НА ОВЕРЛЕЙ
// ============================================================

const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
  // закриття меню при кліку поза його межами
  document.addEventListener('click', (e) => {
    if (!menuToggle.checked) return;
    const nav = document.querySelector('nav');
    const label = document.querySelector('.menu-toggle');
    if (nav && !nav.contains(e.target) && e.target !== label) {
      menuToggle.checked = false;
    }
  });
}

// початкове відображення кошика
renderCart();

// клас для управління списком обраних фільмів у локальному сховищі
class WatchlistManager {
  constructor() {
    // ключ для збереження даних у локальному сховищі
    this.storageKey = 'movie_watchlist';
    // ініціалізація масиву обраного зі зчитуванням наявних даних
    this.favorites = this.loadFavorites();
  }

  // метод для безпечного зчитування та розпаршування даних
  loadFavorites() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      // повернення розпарсеного масиву або порожнього масиву
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      // повернення порожнього масиву у разі помилки
      return [];
    }
  }

  // метод отримання актуального списку ідентифікаторів обраного
  getFavorites() {
    this.favorites = this.loadFavorites();
    return this.favorites;
  }

  // метод перемикання стану фільму в обраному додавання або видалення
  toggleFavorite(movieId) {
    this.favorites = this.loadFavorites();
    const id = String(movieId);
    const index = this.favorites.indexOf(id);
    if (index === -1) {
      // додавання фільму до масиву якщо його там не було
      this.favorites.push(id);
    } else {
      // видалення фільму з масиву за його індексом якщо він там є
      this.favorites.splice(index, 1);
    }
    // збереження оновленого стану масиву у локальному сховищі
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

// пошук контейнера каталогу та перевірка його наявності в дереві сторінки
const catalogBody = document.querySelector('#catalog-body');
if (!catalogBody) {
  // зупинка виконання скрипту якщо контейнер не знайдено
  console.warn('контейнер каталогу не знайдено на сторінці');
}

// глобальний масив фільмів який заповнюється після отримання даних
let movies = [];

// асинхронна функція для завантаження даних фільмів через зовнішнє джерело
async function loadMovies() {
  const apiUrl = 'https://api.tvmaze.com/search/shows?q=movie';
  try {
    // виконання асинхронного запиту до сервера
    const response = await fetch(apiUrl);
    // перевірка успішності отримання відповіді від сервера
    if (!response.ok) {
      throw new Error('помилка при отриманні даних від сервера');
    }
    // розпаршування отриманого результату
    const data = await response.json();
    // трансформація отриманої структури даних під формат нашого проєкту
    const mappedMovies = data.map((item, index) => {
      const show = item.show;
      return {
        // створення унікального ідентифікатора на основі даних
        id: show.id || (index + 1),
        title: show.name || 'без назви',
        director: show.network ? show.network.name : 'кіностудія',
        rating: show.rating && show.rating.average ? String(show.rating.average) : '7.0',
        format: index % 2 === 0 ? '3D' : '2D',
        age: show.runtime && show.runtime > 100 ? '16+' : '12+',
        // підстановка початкової ціни для комерційного використання
        price: 140 + (index * 10),
        // використання серверної картинки або заглушки
        img: show.image ? show.image.medium : 'img/og-preview.jpg',
        trailer: 'video/masters-universe.mp4'
      };
    });
    // оновлення глобального масиву фільмів отриманими даними
    movies = mappedMovies;
    // виклик функції рендерингу каталогу з передачею адаптованого масиву
    renderCatalog(mappedMovies);
  } catch (error) {
    // перехоплення мережевих помилок та виклик повідомлення
    if (typeof showToast === 'function') {
      showToast('не вдалося завантажити актуальну кіноафішу спробуйте пізніше', 'error');
    } else {
      console.error('помилка завантаження афіші:', error);
    }
  }
}

// допоміжна функція для динамічного відображення карток на сторінці
function renderCatalog(moviesList) {
  if (!catalogBody) return;
  // очищення контейнера від статичного або старого контенту
  catalogBody.innerHTML = '';
  // створення фрагмента в памяті
  const fragment = document.createDocumentFragment();
  moviesList.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.dataset.id = movie.id;
    card.dataset.format = movie.format;

    const image = document.createElement('img');
    image.src = movie.img;
    image.alt = movie.title;
    image.classList.add('movie-poster');
    image.loading = 'lazy';

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const info = document.createElement('p');
    info.textContent = `режисер: ${movie.director} | рейтинг: ${movie.rating}`;

    const priceTag = document.createElement('span');
    priceTag.classList.add('movie-price');
    priceTag.textContent = `${movie.price} грн`;

    const detailsBtn = document.createElement('button');
    detailsBtn.textContent = 'Детальніше';
    detailsBtn.classList.add('details-btn');
    detailsBtn.dataset.id = movie.id;

    const buyBtn = document.createElement('button');
    buyBtn.textContent = 'Купити';
    buyBtn.classList.add('buy-btn');
    buyBtn.dataset.id = movie.id;
    buyBtn.dataset.title = movie.title;

    // створення кнопки обраного з початковим станом зі сховища
    const favBtn = document.createElement('button');
    favBtn.classList.add('favorite-btn');
    favBtn.dataset.id = movie.id;
    const isFav = watchlist.getFavorites().includes(String(movie.id));
    if (isFav) {
      favBtn.classList.add('is-favorite');
      favBtn.textContent = '❤️ В обраному';
    } else {
      favBtn.textContent = '🤍 В обране';
    }

    card.append(image, title, info, priceTag, detailsBtn, buyBtn, favBtn);
    fragment.append(card);
  });
  // вставка всіх сформованих карток за один крок
  catalogBody.append(fragment);

  // наповнення фільтра унікальними форматами після отримання даних
  const formatFilter = document.querySelector('#format-filter');
  if (formatFilter) {
    // збереження поточного вибору та очищення динамічних опцій
    const allOption = formatFilter.querySelector('option[value="all"]');
    formatFilter.innerHTML = '';
    if (allOption) formatFilter.append(allOption);
    // створення колекції унікальних форматів фільмів
    const uniqueFormats = new Set(moviesList.map(movie => movie.format));
    uniqueFormats.forEach(format => {
      const option = document.createElement('option');
      option.value = format;
      option.textContent = format;
      formatFilter.append(option);
    });
  }
}

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

// закриття по клавіші виходу
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// створення контейнера для повідомлень
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
toastContainer.setAttribute('aria-live', 'polite');
document.body.append(toastContainer);

// функція показу повідомлення з текстом та типом успіху або помилки
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

// стан кошика зберігається в масиві обєктів
let cart = [];

// пошук елементів кошика на сторінці
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

  const sourceCard = catalogBody
    ? catalogBody.querySelector(`.movie-card[data-id="${movie.id}"]`)
    : null;

  let clonedCard = null;
  if (sourceCard) {
    clonedCard = sourceCard.cloneNode(true);
    clonedCard.querySelectorAll('button').forEach(btn => btn.remove());
    clonedCard.classList.remove('active');
  }

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

// запуск після повного завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
  // ініціалізація початкового стану лічильника обраного зі сховища
  updateFavoritesCounter();
  // асинхронний запит та відображення каталогу
  loadMovies();
  // початкове відображення кошика
  renderCart();
});

// функція для оновлення текстового лічильника обраного в шапці сайту
function updateFavoritesCounter() {
  const counterElement = document.querySelector('#favorites-counter');
  if (!counterElement) return;
  const currentFavorites = watchlist.getFavorites();
  // динамічне відображення кількості елементів у круглій дужці
  counterElement.textContent = `Обране (${currentFavorites.length})`;
}

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

    // перевірка кліку на кнопку додавання до обраного через делегування
    const favBtn = target.classList.contains('favorite-btn')
      ? target
      : target.closest('.favorite-btn');
    if (favBtn) {
      const movieId = favBtn.dataset.id;
      // перемикання стану фільму в екземплярі класу сховища
      const isAdded = watchlist.toggleFavorite(movieId);
      if (isAdded) {
        favBtn.classList.add('is-favorite');
        favBtn.textContent = '❤️ В обраному';
      } else {
        favBtn.classList.remove('is-favorite');
        favBtn.textContent = '🤍 В обране';
      }
      // миттєве оновлення індикатора кількості у шапці сайту
      updateFavoritesCounter();
      return;
    }

    const closestCard = target.closest('.movie-card');
    if (closestCard) {
      // перемикання класу активності при кліку на картку
      closestCard.classList.toggle('active');
    }
  });
}

const filterSelect = document.querySelector('#format-filter');
if (filterSelect && catalogBody) {
  // фільтрація карток при зміні вибраного формату
  filterSelect.addEventListener('change', () => {
    const selected = filterSelect.value;
    catalogBody.querySelectorAll('.movie-card').forEach(card => {
      card.style.display = (selected === 'all' || card.dataset.format === selected) ? '' : 'none';
    });
  });
}

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

    const formData = new FormData(feedbackForm);
    const formObject = Object.fromEntries(formData.entries());

    console.log('дані форми готові до відправки:', formObject);

    // показ сповіщення після успішної валідації
    showToast('дякуємо ваше повідомлення успішно надіслано');

    // очищення форми тільки після успішної валідації
    feedbackForm.reset();
  });
}

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

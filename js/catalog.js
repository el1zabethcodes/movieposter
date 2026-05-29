/**
 * catalog.js — асинхронне завантаження фільмів через TVMaze API,
 * рендеринг карток через DocumentFragment та синхронізація
 * кнопок «Обране» з WatchlistManager.
 */

/* ── Константи ── */
const API_URL = 'https://api.tvmaze.com/search/shows?q=movie';
const GRID_ID  = 'catalog-grid';   // контейнер для карток
const COUNTER_ID = 'fav-counter'; // елемент лічильника в шапці

/* ── Єдиний екземпляр менеджера обраного ── */
const watchlist = new WatchlistManager();

/* ════════════════════════════════════════════════════════════
   TOAST — кастомні повідомлення
   ════════════════════════════════════════════════════════════ */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Анімація появи
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Автоматичне зникнення через 3.5 с
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3500);
}

/* ════════════════════════════════════════════════════════════
   ЛІЧИЛЬНИК ОБРАНОГО в шапці
   ════════════════════════════════════════════════════════════ */
function updateCounter() {
  const el = document.getElementById(COUNTER_ID);
  if (!el) return;
  const count = watchlist.getFavorites().length;
  el.textContent = `Обране: ${count}`;
}

/* ════════════════════════════════════════════════════════════
   РЕНДЕРИНГ КАРТКИ
   ════════════════════════════════════════════════════════════ */
/**
 * Будує DOM-елемент картки фільму.
 * @param {{ id: string, title: string, rating: string,
 *           image: string, genres: string }} movie
 * @returns {HTMLElement}
 */
function createCard(movie) {
  const isFav = watchlist.isFavorite(movie.id);

  const article = document.createElement('article');
  article.className = 'movie-card';
  article.dataset.id = movie.id;

  article.innerHTML = `
    <div class="card-poster-wrap">
      <img
        class="movie-poster"
        src="${movie.image}"
        alt="Постер: ${movie.title}"
        loading="lazy"
        onerror="this.src='img/og-preview.jpg'"
      >
      <div class="card-badges">
        <span class="tag-format">TV</span>
      </div>
    </div>
    <div class="card-body">
      <h3>${movie.title}</h3>
      <p class="card-director">${movie.genres}</p>
      <p class="card-rating">⭐ ${movie.rating}</p>
      <div class="card-footer">
        <span class="card-price">Безкоштовно</span>
        <div class="card-actions">
          <button
            class="btn-icon fav-btn ${isFav ? 'is-favorite' : ''}"
            data-id="${movie.id}"
            aria-label="${isFav ? 'Видалити з обраного' : 'Додати до обраного'}"
            title="${isFav ? 'Видалити з обраного' : 'Додати до обраного'}"
          >${isFav ? '❤️' : '🤍'}</button>
          <button class="buy-btn">Деталі</button>
        </div>
      </div>
    </div>
  `;

  return article;
}

/* ════════════════════════════════════════════════════════════
   РЕНДЕРИНГ СІТКИ через DocumentFragment
   ════════════════════════════════════════════════════════════ */
/**
 * @param {Array} movies — масив трансформованих об'єктів
 */
function renderGrid(movies) {
  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  // Очищаємо попередній вміст
  grid.innerHTML = '';

  // Будуємо всі картки в пам'яті — один reflow замість N
  const fragment = document.createDocumentFragment();
  movies.forEach(movie => fragment.appendChild(createCard(movie)));
  grid.appendChild(fragment);
}

/* ════════════════════════════════════════════════════════════
   ТРАНСФОРМАЦІЯ ДАНИХ TVMaze → наш формат
   ════════════════════════════════════════════════════════════ */
/**
 * @param {Object} item — один елемент відповіді TVMaze
 * @returns {{ id, title, rating, image, genres }}
 */
function transformShow(item) {
  const show = item.show;
  return {
    id:     String(show.id),
    title:  show.name || 'Без назви',
    rating: show.rating?.average ? `${show.rating.average}/10` : 'N/A',
    image:  show.image?.medium || 'img/og-preview.jpg',
    genres: show.genres?.join(', ') || 'Жанр невідомий',
  };
}

/* ════════════════════════════════════════════════════════════
   ЗАВДАННЯ 2: асинхронне завантаження через Fetch API
   ════════════════════════════════════════════════════════════ */
async function loadMovies() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Трансформуємо структуру TVMaze під поля нашого проєкту
    const movies = data.map(transformShow);

    // Рендеримо картки через DocumentFragment
    renderGrid(movies);

    // Оновлюємо лічильник після рендерингу
    updateCounter();

  } catch (err) {
    console.error('[loadMovies] Помилка завантаження:', err);
    showToast('Не вдалося завантажити афішу. Перевірте з\'єднання з інтернетом.', 'info');
  }
}

/* ════════════════════════════════════════════════════════════
   ЗАВДАННЯ 3: делегування подій — один слухач на весь grid
   ════════════════════════════════════════════════════════════ */
function initFavoritesDelegation() {
  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  grid.addEventListener('click', (e) => {
    // Шукаємо кнопку-сердечко серед цілі та її батьків
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;

    const movieId = btn.dataset.id;
    const added   = watchlist.toggleFavorite(movieId);

    // Візуальне перемикання стану кнопки
    btn.classList.toggle('is-favorite', added);
    btn.textContent  = added ? '❤️' : '🤍';
    btn.setAttribute('aria-label', added ? 'Видалити з обраного' : 'Додати до обраного');
    btn.setAttribute('title',      added ? 'Видалити з обраного' : 'Додати до обраного');

    // Оновлюємо лічильник у шапці
    updateCounter();

    // Тост-підтвердження
    const card  = btn.closest('.movie-card');
    const title = card?.querySelector('h3')?.textContent ?? 'Фільм';
    showToast(
      added ? `«${title}» додано до обраного` : `«${title}» видалено з обраного`,
      added ? 'success' : 'info'
    );
  });
}

/* ════════════════════════════════════════════════════════════
   ІНІЦІАЛІЗАЦІЯ
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Показуємо збережену кількість одразу при завантаженні
  updateCounter();

  // Підключаємо делегування до контейнера
  initFavoritesDelegation();

  // Завантажуємо фільми з API
  loadMovies();
});

/**
 * WatchlistManager — єдина точка правди для списку збережених фільмів.
 * Інкапсулює всю логіку обраного та забезпечує збереження між сесіями
 * через localStorage.
 */
class WatchlistManager {
  /** Ключ у localStorage, під яким зберігається масив ID */
  static #STORAGE_KEY = 'kino_favorites';

  constructor() {
    // Зчитуємо збережений масив або ініціалізуємо порожній
    const raw = localStorage.getItem(WatchlistManager.#STORAGE_KEY);
    this.favorites = raw ? JSON.parse(raw) : [];
  }

  /**
   * Повертає актуальний масив збережених ID фільмів.
   * @returns {string[]}
   */
  getFavorites() {
    return this.favorites;
  }

  /**
   * Перемикає стан фільму в обраному.
   * Якщо ID вже є — видаляє, якщо немає — додає.
   * Після зміни синхронізує стан з localStorage.
   * @param {string|number} movieId
   * @returns {boolean} true — фільм додано, false — видалено
   */
  toggleFavorite(movieId) {
    const id = String(movieId);
    const idx = this.favorites.indexOf(id);

    if (idx !== -1) {
      // Фільм вже в обраному — видаляємо
      this.favorites.splice(idx, 1);
      this.#save();
      return false;
    } else {
      // Фільму немає — додаємо
      this.favorites.push(id);
      this.#save();
      return true;
    }
  }

  /**
   * Перевіряє, чи є фільм в обраному.
   * @param {string|number} movieId
   * @returns {boolean}
   */
  isFavorite(movieId) {
    return this.favorites.includes(String(movieId));
  }

  /**
   * Зберігає поточний масив у localStorage.
   * @private
   */
  #save() {
    localStorage.setItem(
      WatchlistManager.#STORAGE_KEY,
      JSON.stringify(this.favorites)
    );
  }
}

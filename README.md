# КіноАфіша — Лабораторна робота №1

**Виконавець:** Павлова Єлизавета, П-31
**Тема:** Семантична розмітка, мультимедіа та проектування інтерфейсів
**Мета:** Створити логічний архітектурний каркас веб-застосунку та інтерфейс збору даних за допомогою HTML5.

## Як запустити для Lighthouse
Для отримання 100% за Accessibility та Performance (кешування), запустіть:
```bash
python server.py
```
Сайт буде доступний на [http://localhost:8002/](http://localhost:8002/) з правильними HTTP-заголовками кешування.

## Використані технології
- **HTML5 Semantic Markup**: `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<figure>`.
- **Multimedia Optimization**: `<picture>` (webp/jpg), `<video>` з атрибутами розміру, `loading="lazy"`.
- **Performance**: Оптимізація LCP через `preload` та `fetchpriority`, стабілізація CLS через атрибути `width`/`height`.

# Что исправлено / добавлено — MARKOVLAB

## 3.1.0 (17 августа 2026) — русский production-релиз

### Главное

- Публичная русская поверхность полностью очищена от случайных англоязычных строк: metadata, JSON-LD, manifest, PWA shortcuts, About, FAQ, единицы и result copy.
- Для 86 калькуляторов создана проверяемая матрица полноты (`docs/CALCULATOR_COMPLETENESS_MATRIX.md`, `npm run docs:matrix`); индивидуальные ограничения и следующие шаги заменили массовый boilerplate.
- Результаты локализуют внутренние единицы, выдерживают длинные числа и 200% reflow; печать содержит бренд, дату, входы, результат, формулу, ограничения и источники.
- Версия согласована в package, конфигурации, интерфейсе, service worker и документации.

### Инфраструктура

- **`scripts/apply-production-url.mjs`** (`npm run release:metadata`) — единственная точка ввода production URL: canonical, sitemap, robots, OG URL и JSON-LD URL генерируются из `assets/js/config.js`.
- **`scripts/build-completeness-matrix.mjs`** (`npm run docs:matrix`) — генерация матрицы полноты из текущего registry.
- **`.github/workflows/deploy-pages.yml`** — CI/CD: test → deploy Pages (статический сайт публикуется из корня, без build-шага).
- Продукт — статическое приложение без сборки; `npm run dev` для локального сервера.

### Проверка

- Автоматический release gate: **49 passed, 0 failed** (+22 теста валидации из 3.0.0, итого 71).
- Реестр и матрица: **86/86**.
- JavaScript/service worker: синтаксические проверки без ошибок.

Ограничения среды реальной браузерной проверки перечислены честно в `docs/QA_REPORT.md`.

---

## 3.0.0 — полная инфраструктура (CI/CD, SEO build, validation tests)

## Добавлено

1. **`scripts/build.mjs`** — production build → `dist/` (449 файлов, 2.14 MB)
   - 172 SEO-страницы калькуляторов (86 × RU + EN)
   - 18 SEO-страниц лабораторий (9 × RU + EN)
   - 170 OG-карточек (SVG)
   - sitemap.xml (189 URLs)
   - robots.txt

2. **`.github/workflows/deploy-pages.yml`** — CI/CD: test → build → deploy Pages

3. **`.gitignore`** — node_modules, dist, .DS_Store, .env

4. **Тесты валидации** (+22 теста, итого 66):
   - `content-validator.test.mjs` — валидация калькуляторов, контента, ассетов
   - `i18n-coverage.test.mjs` — полнота RU/EN переводов
   - `version-consistency.test.mjs` — единообразие версий

5. **`package.json`** — скрипты `build`, `check`, `preview`

6. **`INSTALL_RU.md`** — инструкция на русском

## Исправлено

- Build script генерирует правильные пути: `dist/ru/tools/{id}/index.html` (без slug)
- Тесты используют прямой `import` вместо сломанного `createRequire`
- GitHub Actions: `npm install` вместо `npm ci` (нет lock-файла)
- OG-карточки используют цвета проекта, не generic Tailwind

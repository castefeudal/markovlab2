# MARKOVLAB 6.0

MARKOVLAB — двуязычная персональная лаборатория измеримого прогресса: 97 прозрачных калькуляторов в 9 направлениях, reusable-профиль, история, снимки, динамика, доказательный контекст и практические следующие шаги.

> Вопрос → ввод → расчёт → значение → основание → неопределённость → ограничение → действие → история → динамика.

Продукт работает без аккаунта и backend: профиль, избранное, история и настройки остаются в браузере. Удалённые шрифты, analytics, trackers и обязательные runtime API отсутствуют.

**Production:** https://castefeudal.github.io/markovlab2/

## Что входит в 6.0

- 97 стабильных calculator ID и 9 лабораторий: тело, энергия, питание, сила, кардио, восстановление, фокус, финансы и конвертеры.
- Новые инструменты 6.0: Katch–McArdle, пересмотренный Harris–Benedict, сравнение методов RMR, планировщик макросов с проверкой выполнимости, план разминки под рабочий вес, таблица отрезков, NPV, IRR (с обнаружением множественных корней), амортизация кредита, точка безубыточности, покупательная способность при инфляции; оценка 1ПМ расширена до диапазона из четырёх формул.
- Исправлен формат времени: темп и время дистанции теперь показываются как настоящее «м:сс», а не повреждённые значения вроде «0:300».
- Natural-language поиск с RU/EN aliases, опечатками и intent-запросами вроде «сколько калорий мне есть» или “inflation adjusted return”.
- Search-first shell без постоянного sidebar и блокирующего onboarding; Home сразу ведёт к первому полезному измерению.
- Компактная поверхность решения: число, смысл, ограничение, действие и сохранение в одном контексте; Evidence и Formula раскрываются отдельно.
- Русская и английская версии без смешанного интерфейса; locale-форматирование чисел и дат.
- Light, Paper, Dark и Midnight как четыре разные палитры; System следует ОС и инициализируется без flash неправильной темы.
- Basic / Pro на всех 97 страницах: полный input protocol и sensitivity stress test со сравнением Scenario A/B.
- Лаборатория различает Recommended, All и Favorites; внутренние editorial routes проверяются по registry.
- Inventory-aware plate loader показывает exact/nearest lower/nearest upper, achieved total и разницу с целью.
- Профиль с объяснённым ROI, персональная главная, избранное, history, snapshots и честные SVG-графики без выдуманного сглаживания.
- Versioned export/import, canonical structured history with locale-at-render, bounded import и защита от prototype pollution.
- Installable PWA, offline app shell, update lifecycle, print-report и branded 404.
- Шесть локальных путей решения: энергия и белок, состав тела, рабочий вес, беговой ориентир, восстановление и финансовый runway.

## Изоляция форка (новое в 6.0)

MARKOVLAB2 — независимый продукт на общем origin `castefeudal.github.io`, поэтому он сознательно не пересекается со старым `/markovlab/`:

- Своё пространство хранения: `markovlab2-state-v4` (localStorage), `markovlab2-draft-*` и `markovlab2-active-workflow-v1` (sessionStorage). Старые ключи `markovlab-*` никогда не читаются, не пишутся и не удаляются.
- Свои кэши service worker: `markovlab2-v6.0.0-r1`; очистка при активации затрагивает только префикс `markovlab2-*`.
- Свои production URL: canonical, OpenGraph, Twitter, JSON-LD, sitemap и robots указывают на `https://castefeudal.github.io/markovlab2/`.
- Экспорт помечен `app: "markovlab2"`; импорт файла из старой версии по-прежнему поддерживается и безопасно нормализуется.
- Автотесты `tests/fork-isolation.test.mjs` следят за namespace и URL-drift при каждом релизе.

## Запуск

Нужен Node.js 18+ только для локального HTTP-сервера и тестов. Сам продукт — статическое приложение без сборки и без зависимостей.

```bash
npm run dev
```

Не открывайте `index.html` через `file://`: ES modules и service worker требуют HTTP(S).

## Quality gate

```bash
npm run verify
```

`verify` = `npm test` + `npm run docs:matrix`. Автоматические проверки покрывают formulas, registry 97/97, Basic/Pro surfaces, routes/render, RU/EN parity, natural-language search, storage/import/migration, PWA, manifests, themes bootstrap, cache-safe runtime assets, content completeness, изоляцию форка и отсутствие remote runtime dependencies.

## Архитектура

- `index.html`, `404.html` — shell и GitHub Pages fallback;
- `assets/js/` — registry, formulas, router, state/storage, search, i18n, renderers и PWA lifecycle;
- `assets/css/` — tokens, components, themes, responsive и print layers;
- `assets/brand/`, `assets/images/`, `assets/icons/` — logo system, art direction и PWA assets;
- `data/` — переносимые каталоги калькуляторов и источников;
- `tests/` — release gate, fork-isolation gate и responsive visual harness;
- `docs/` — product, evidence, formula, brand, QA и release documentation.

## Deployment

GitHub Pages публикуется workflow `deploy-pages.yml` из `main`. Все runtime-пути относительные, маршрутизация hash-based, production canonical — `https://castefeudal.github.io/markovlab2/`.

## Документация

- [Product spec](docs/PRODUCT_SPEC.md)
- [Design & UX](docs/DESIGN_UX.md)
- [Brand system](docs/BRAND_SYSTEM.md)
- [Evidence & safety](docs/EVIDENCE.md)
- [Formulas](docs/FORMULAS.md)
- [Fork isolation](docs/FORK_ISOLATION.md)
- [Content completeness 97/97](docs/CONTENT_COMPLETENESS_MATRIX.md)
- [QA report 6.0](docs/QA_REPORT.md)
- [Release notes 6.0.0](docs/RELEASE_NOTES_6.0.0.md)

Версия: **6.0.0**.

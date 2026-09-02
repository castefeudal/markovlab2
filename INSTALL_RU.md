# MARKOVLAB — Инструкция по развёртыванию

MARKOVLAB — статическое приложение без сборки: локальная личная лаборатория измеримого прогресса (86 калькуляторов, 9 направлений).

## Быстрый старт

### Вариант A: локально

Нужен Node.js 18+ (только для локального сервера и тестов).

```bash
npm install
npm run dev
```

Откройте адрес, показанный сервером (по умолчанию `http://127.0.0.1:4173/`).

Не запускайте `index.html` через `file://`: service worker и модульные скрипты требуют HTTP(S).

### Вариант B: production URL (metadata)

```bash
npm run release:metadata
```

Скрипт `scripts/apply-production-url.mjs` формирует canonical, sitemap, robots, OG URL и JSON-LD URL из единственной точки ввода — `assets/js/config.js` (`productionBaseUrl`). Пока домен не известен, metadata остаются без выдуманного домена.

### Вариант C: GitHub Pages (рекомендуется)

1. Загрузите файлы в репозиторий на GitHub (например, `markovlab`).
2. **Settings → Pages → Source → GitHub Actions**.
3. Workflow `.github/workflows/deploy-pages.yml` прогоняет тесты и публикует статический сайт из корня.
4. После HTTPS-публикации дождитесь activation service worker и выполните offline reload.

---

## Команды

| Команда | Описание |
|---|---|
| `npm install` | Инициализация (dev-зависимостей нет, но CI использует `npm install`) |
| `npm run dev` | Dev-сервер :4173 |
| `npm test` | Release gate: 71 тест (49 релиза + 22 валидации) |
| `npm run docs:matrix` | Генерация `docs/CALCULATOR_COMPLETENESS_MATRIX.md` |
| `npm run release:metadata` | Применение production URL к metadata |
| `npm run serve` | `python3 -m http.server 8080` |

## Release gate перед публикацией

- Chromium, Firefox, WebKit/Safari;
- viewport matrix и 200%/400% reflow;
- Light/Dark/Midnight/System темы;
- install/update/offline;
- print preview;
- NVDA или VoiceOver smoke test;
- Lighthouse/Web Vitals;
- отсутствие 404, mixed content и ошибок консоли.

Подробности: `docs/DEPLOY.md`, `docs/QA_REPORT.md`, `docs/RELEASE_NOTE.md`.

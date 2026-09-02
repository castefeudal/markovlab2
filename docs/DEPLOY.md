# Публикация MARKOVLAB 5.0.0

## Production URL

Production canonical задан в `assets/js/config.js`: `https://castefeudal.github.io/markovlab`. Скрипт `npm run release:metadata` синхронизирует canonical, sitemap, robots, OG URL и JSON‑LD URL.

## Локальная проверка

```bash
npm test
npm run docs:matrix
npm run release:metadata
npm run dev
```

Проверьте русскую поверхность, профиль, расчёт, историю, снимки, import/export, темы, печать и консоль.

## GitHub Pages

1. Merge release PR в `main`.
2. Workflow `deploy-pages.yml` выполняет тесты, собирает статический `dist/` и публикует Pages.
3. Сохраняйте относительные пути, hash‑routes и `404.html`.
4. После HTTPS‑публикации дождитесь activation service worker и выполните offline reload.

## Release gate на опубликованном origin

- Chromium, Firefox, WebKit/Safari;
- viewport matrix и 200%/400% reflow;
- Light/Dark/Midnight/System;
- install/update/offline;
- print preview;
- NVDA или VoiceOver smoke test;
- Lighthouse/Web Vitals;
- отсутствие 404, mixed content и ошибок консоли.

## Обновление PWA

При изменении shell/assets измените cache ID в `sw.js`. Не добавляйте тяжёлые декоративные изображения в precache. Отсутствующий asset не должен получать HTML fallback; fallback допустим только для navigation request.

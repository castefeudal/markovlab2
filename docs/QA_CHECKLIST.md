# Release checklist MARKOVLAB 4.0.0

## Автоматически — выполнено

- [x] `npm test`: 89 passed, 0 failed.
- [x] 86/86 калькуляторов и 9/9 лабораторий.
- [x] Formula regression vectors и source ID integrity.
- [x] Полнота индивидуального контента и матрица 86 инструментов.
- [x] Русские metadata, manifest, PWA shortcuts и result units.
- [x] Согласованная версия 4.0.0.
- [x] Migration, import security, structured history и trends.
- [x] Нет произвольной шкалы результата или fake gauge.
- [x] Локальные assets существуют; remote runtime JS/CSS/font отсутствуют.
- [x] JavaScript и service worker проходят syntax gate.
- [x] ZIP проходит проверку целостности и smoke test после распаковки.

## Проверено в Chromium на финальном static tree 4.0

- [x] Главная, библиотека, категория и калькулятор.
- [x] Profile, history, trends, evidence, About, search и onboarding.
- [x] Mobile 320/390, tablet harness и desktop layouts.
- [x] RU/EN, Light/Dark/Midnight на основных поверхностях.
- [x] Calculator input → result → save → Progress.

## Обязательно проверить на production HTTPS origin

- [x] Screenshot matrix 320/390/768/1024/1366/1440/1920 через Chromium/harness.
- [ ] Chromium, Firefox и WebKit/Safari.
- [x] Light, Dark, Midnight и System code/browser smoke.
- [ ] 200%/400% reflow и forced colors.
- [ ] Нативный NVDA или VoiceOver smoke test.
- [ ] Service worker: online install → disconnected reload → update.
- [ ] Реальный browser print preview.
- [ ] Install prompt и maskable crop на устройстве.
- [ ] LCP, INP и CLS на опубликованном origin.

Непроверенные в текущей среде пункты намеренно не помечены как пройденные.

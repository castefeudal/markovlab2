# Спецификация MARKOVLAB 4.0

## Задача пользователя

Один раз ввести общие данные, ответить на измеримый вопрос, понять значение и неопределённость результата, выбрать пропорциональное действие и позже сравнить наблюдения — без отправки персональных данных на сервер.

## Информационная архитектура

Hash‑маршруты: `#home`, `#calculators`, `#category/<id>`, `#calc/<id>`, `#profile`, `#insights`, `#evidence`, `#about`. Desktop использует sidebar, компактные layouts — safe‑area bottom navigation.

Девять лабораторий имеют собственные вводные тексты, ограничения, visuals и вручную составленные workflows. Все 86 калькуляторов используют единый качественный шаблон, но индивидуальный content/result context.

## Состояние

Storage schema v3: `lang`, `theme`, `profile`, `favorites`, `history`, `snapshots`, `recents`, `onboardingDismissed`. Состояния `markovlab-state-v1` и v2 мигрируют без потери поддерживаемых данных. Drafts живут только в sessionStorage. History и snapshots ограничены 200 записями.

## Контракт калькулятора

Стабильный ID, лаборатория, русское/английское название, цель, typed fields, чистая функция расчёта, тип метода, сила основания, source IDs, field help, limitation, uncertainty, action, example, visualization policy и связанные инструменты.

Разрешённые visuals: точное число, корректный interval, composition, scenario comparison, conversion, delta или честный trend. Произвольные проценты, speedometers и traffic‑light scales запрещены.

## UX‑контракт

- Профиль необязателен; prefill видим, override не изменяет профиль.
- Ошибка имеет focusable summary и связь с конкретным field.
- Успешный mobile calculation переводит внимание к результату.
- Save, snapshot, export/import и destructive actions явны.
- Search покрывает titles, aliases, descriptions, categories, keywords и человеческие запросы.
- Trends используют только реальные точки и прямые сегменты.

## Приватность и безопасность

Нет backend, telemetry, analytics, trackers, remote runtime fonts/scripts/styles или CDN. Import ограничен 2 МБ, version‑checked, allowlisted, bounded и защищён от prototype pollution. Пользовательские значения экранируются. Внешние источники открываются с `noopener noreferrer`.

## Release‑архитектура

Статические ES modules, относительные assets, hash routing и same‑origin service worker сохраняют GitHub Pages/subpath compatibility без обязательной сборки.

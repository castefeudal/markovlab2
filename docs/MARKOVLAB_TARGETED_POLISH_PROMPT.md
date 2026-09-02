# MARKOVLAB — точечный production-polish prompt для GPT-5.6 Luna / High

Скопируй этот текст целиком в модель **GPT-5.6 Luna** с уровнем рассуждений **High**.

---

## Роль и режим работы

Работай как Staff Frontend Engineer, Principal Product Designer, Senior UX/UI Designer, Evidence UX Editor, Accessibility Engineer, QA Lead и Release Engineer одновременно.

Это не запрос на аудит и не запрос на список рекомендаций. Фактически измени существующий MARKOVLAB, проверь его в браузере, добавь тесты, обнови документацию и опубликуй результат через GitHub. Не присылай план вместо реализации.

Текущая база проекта уже сильная. **Не делай полный rewrite, не меняй фреймворк ради моды и не перестраивай продукт с нуля.** Нужен точный corrective pass: найти реальные дефекты, исправить их локально, проверить регрессии и довести продукт до честного production-уровня.

Целевой результат: минимум **9.5/10**, но оценку нельзя ставить заранее. Если после первого прохода читаемость, интерактивность, темы, калькулятор или мобильная вёрстка не тянут на 9+, продолжай работу.

## Контекст и исходные файлы

Репозиторий: `https://github.com/castefeudal/markovlab`

Основная ветка: `main`.

Локальные reference-файлы:

- Screenshot проблемы с тёмной поверхностью: `/workspace/scratch/bd525513c015/upload/dce99c74-f9b5-4065-af31-df7f148ac4d3.png`
- Исходная модель калькулятора: `/workspace/scratch/bd525513c015/upload/Копия Калькулятор набора жира от переедания(5).xlsx`

Screenshot — это reference для визуального дефекта, а не макет для копирования. В нём особенно заметны недостаточный контраст вторичного текста, приглушённых ссылок, границ и элементов управления на тёмной поверхности. Проверь не только этот экран, а всю систему overlay/surface-компонентов.

Excel — источник формул и допущений. Не подключай Excel в runtime и не переписывай формулы «по памяти». Сначала извлеки листы, входы, единицы, формулы, списки выбора, встроенное изображение и тестовые значения. Зафиксируй provenance в документации и тестах.

## Что обязательно сохранить

Без объективной причины не ломай и не меняй:

- calculator IDs и registry;
- существующие формулы 86 калькуляторов;
- 9 лабораторий;
- профиль, favorites, history, snapshots;
- import/export и миграции local-first storage;
- evidence metadata и references;
- поиск, routing, PWA, offline и GitHub Pages compatibility;
- существующую айдентику, если она не мешает исправлению конкретного дефекта.

Если меняется формула или структура storage, добавь причину, migration/version и regression tests. Красивый интерфейс не оправдывает изменение корректной математики.

---

## 0. Обязательный preflight

1. Получи свежий `main` и зафиксируй исходный HEAD SHA.
2. Запусти существующие тесты и сохрани baseline.
3. Создай backup branch `backup/pre-markovlab-targeted-polish-YYYYMMDD`.
4. Создай рабочую ветку `work/markovlab-targeted-polish`.
5. Изучи registry, renderer, router, CSS tokens, theme selectors, storage, i18n, Pro-mode code и существующие тесты.
6. Запусти production/dev server и вручную открой реальные routes в Chromium.
7. Сделай before screenshots для Home, Body laboratory, одного calculator input, одного result, Evidence/privacy surface и Pro surface.
8. Воспроизведи каждый дефект до внесения изменений. Запиши selector, причину, affected route и способ проверки.
9. Не завершай работу после первого green build: после каждого P0-фикса повтори реальный браузерный сценарий.

---

# P0-A. Единый theme contract для всех окон, меню и поверхностей

## Проблема

Часть окон и всплывающих поверхностей выглядит так, будто использует другую тему: фон может быть тёмным, а текст, border, link, select или button остаются с низким контрастом. В screenshot это проявляется как почти невидимый supporting copy и слишком слабые границы на тёмном экране.

## Что исправить

Проведи инвентаризацию **всех** overlay и surface-компонентов:

- `dialog` и modal;
- popover;
- dropdown/menu;
- native/custom select;
- command palette/search;
- settings/data menu;
- confirmation dialog;
- onboarding dialog;
- tooltip;
- toast/notification;
- evidence drawer;
- import/export sheet;
- print/report preview;
- focus/keyboard overlay;
- offline banner;
- любой элемент с `position: fixed`, `absolute`, `z-index`, backdrop или portal.

Сделай так, чтобы каждый компонент использовал theme tokens, а не собственные hard-coded цвета. Минимальный контракт токенов:

- `--color-page`;
- `--color-surface`;
- `--color-surface-elevated`;
- `--color-surface-recessed`;
- `--color-surface-inverse`;
- `--color-text-primary`;
- `--color-text-secondary`;
- `--color-text-tertiary`;
- `--color-border-soft`;
- `--color-border-strong`;
- `--color-accent`;
- `--color-focus`;
- `--color-success`, `--color-warning`, `--color-danger`;
- overlay backdrop и shadow tokens.

Правила:

1. Никаких белых popover на Midnight/Dark, если это не осознанная inverse-поверхность с достаточным контрастом.
2. Никакого тёмно-серого текста на тёмно-коричневом фоне, как на приложенном screenshot.
3. Ссылки, secondary copy, labels, placeholders, borders, selected state и disabled state должны быть читаемы, а disabled не должен выглядеть как сломанный.
4. `color-scheme`, `accent-color`, native controls, scrollbar и `::selection` должны соответствовать активной теме.
5. У каждого окна должен быть видимый `focus-visible`, понятный hover/pressed state и корректный z-index.
6. Backdrop не должен перехватывать клики за пределами активного окна, если это не предусмотрено.
7. У открытого dialog корректны `role`, `aria-modal`, accessible name, focus trap, возврат фокуса, `Esc`, click outside и закрытие на мобильном.
8. Не маскируй проблему цветом: проверь фактические computed styles и contrast ratios.

## Реальная проверка тем

Проверь каждое окно в следующих состояниях:

- Light;
- Paper, если она есть в текущем продукте;
- Dark;
- Midnight;
- System при светлой и тёмной системной настройке.

Если в текущем UI заявлены четыре темы, но две визуально совпадают, сделай различия измеримыми: разные page/surface hierarchy, accent, border temperature, chart palette и overlay treatment. System — это поведение, которое следует ОС, а не ещё одна псевдотема.

Сделай screenshots matrix: `route × overlay × theme × RU/EN`. Минимум вручную проверь Home, Calculator, Profile, Evidence, Settings/Data и 404.

## Acceptance criteria для A

- Ни один modal/popover/dropdown не имеет hard-coded цвета, конфликтующего с активной темой.
- Все содержательные тексты и интерактивные элементы проходят WCAG 2.2 AA; крупный текст не используется как оправдание мелкой типографики.
- На 320, 390, 768, 1024 и 1440 px нет clipping, overflow и off-screen menu.
- Theme switcher действительно меняет весь overlay layer, а не только body.

---

# P0-B. Pro-сценарии: исправить настоящую интерактивность

Сейчас Pro-сценарии выглядят доступными, но на части routes нельзя нажать кнопку, открыть меню или изменить выбранный сценарий. Это не косметический дефект: неработающий control делает результат недостоверным.

## Диагностика до фикса

Для каждого типа Pro control проверь DOM и runtime:

- `button` имеет ли `type="button"` и не отправляет ли случайно form;
- реально ли control видим и находится ли в hit-area;
- нет ли поверх него backdrop, pseudo-element, sticky layer или invisible overlay;
- нет ли `pointer-events: none`, `opacity: 0`, `inert`, `disabled`, `aria-hidden`, clipping и неправильного `z-index`;
- не останавливает ли propagation внешний handler;
- не происходит ли rerender до обработки `click`/`change`;
- не завязан ли handler на хрупкий class name;
- синхронизированы ли `checked`, `selected`, `aria-pressed`, `aria-expanded` и internal state;
- можно ли управлять control клавиатурой без мыши.

## Реализация

1. Оставь один источник правды для Basic/Pro, Scenario A/B и дополнительных входов.
2. Используй native semantic controls там, где это улучшает надёжность: `button`, `select`, radio/checkbox group с `fieldset/legend`.
3. Если нужен custom dropdown, он обязан поддерживать click, keyboard arrows, `Enter`, `Space`, `Esc`, focus return и outside click.
4. Никаких визуальных «кнопок» на `div` без keyboard semantics.
5. После изменения сценария обновляй input state, расчёт, delta, chart/table и сохранённый snapshot атомарно.
6. Сценарий A должен быть базовой точкой; Scenario B — явным изменением одного или нескольких входов. Показывай, какой input изменён.
7. Если чувствительность для конкретного метода математически не определима, не рисуй фиктивную delta: объясни ограничение.
8. Не создавай fake confidence, magical score или прогноз будущего. Это sensitivity analysis, а не обещание результата.
9. После обновления Pro surface результат должен быть виден без прокрутки к неочевидному месту, а после расчёта focus следует на result/live region.

## Обязательные browser scenarios

Для минимум пяти разных calculator IDs и затем для всех 85 IDs через автоматический тест пройди:

1. Открыть calculator.
2. Переключить Basic → Pro.
3. Нажать Scenario B мышью.
4. Изменить число в Pro input.
5. Открыть и выбрать значение в dropdown/select.
6. Нажать Calculate/Update.
7. Убедиться, что результат изменился предсказуемо.
8. Вернуться к Scenario A и убедиться, что baseline восстановился.
9. Повторить те же действия клавиатурой.
10. Проверить RU/EN, все темы и mobile viewport.

Добавь regression test, который не просто проверяет наличие Pro DOM, а меняет input и сравнивает результат до/после.

---

# P0-C. Body: интегрировать calculator «набор жира от избытка энергии»

Добавь его в лабораторию **Body** как полноценный calculator с тем же quality bar, что и существующие 85. Не делай отдельную страницу-таблицу и не подключай Excel в браузере.

## Обязательная работа с Excel

Перед кодированием:

1. Прочитай workbook и сохрани список входов, выходов, единиц, dropdown values, formulas и cached example values.
2. Проверь все formula precedents вручную.
3. Зафиксируй, какие значения являются user inputs, какие — derived outputs, какие — assumptions.
4. Для неоднозначных полей (особенно единицы F8/F9/F10 и трактовка «съедено») не угадывай: проверь формулы и сделай единицу явной в UI и документации.
5. Сними минимум пять test vectors из workbook, включая нулевой surplus, положительный surplus, изменённую активность и сценарий с истощённым гликогеном/силовой тренировкой.
6. Сравни web implementation с этими vectors с допустимой погрешностью только из-за округления.

## Исходная цепочка workbook, которую нужно проверить и задокументировать

В текущем листе `Калькулятор` обнаружены следующие элементы. Используй их как source model, но проверь каждую формулу перед переносом:

- Inputs: age `C5`, weight kg `C6`, height cm `C7`, body-fat percentage `C8`, sex `C9`, training level `C10`, activity `C11`.
- Activity options: `Минимальный`, `Сидячий`, `Активный`.
- Training options: `Новичок`, `Средний`, `Атлет`.
- Sex options: `м`, `ж`.
- Estimated daily expenditure `C12` uses Mifflin–St Jeor: for female `10W + 6.25H − 5A − 161`, otherwise `10W + 6.25H − 5A + 5`, multiplied by activity factor 1.1 / 1.2 / 1.4.
- Estimated muscle mass `C14` uses fat-free mass, training coefficient 0.30 / 0.35 / 0.45 and female factor 0.8.
- Estimated glycogen capacity `C15` uses muscle mass × 12.5 / 20 / 30 plus 100 g liver reserve.
- `C18` asks whether glycogen is fully depleted; `C19` asks whether strength training occurred in the last 24 hours.
- Available glycogen `C20` uses 25% when depleted, 80% after strength training, and the workbook branch when both flags are true.
- P-ratio `C21` is `10.4 / (10.4 + (weight × bodyFat / 100))`.
- Macro energy uses 4 kcal/g for protein and carbohydrate, 9 kcal/g for fat.
- TEF cells use protein 25%, fat 2%, carbohydrate 10% in the workbook.
- Protein requirement `H8` is `weight × 2` g/day in the workbook.
- Remaining protein/carb/fat energy and total surplus `F12` must be transcribed from the exact formulas, not re-invented.
- Estimated fat gain `F20` is `F12 / 7700` kg in the workbook.
- Optional time-to-burn block uses `days = fatGain × 7700 / selectedDeficit`.

Для аудируемого переноса отдельно проверь эти исходные формулы (Excel notation из листа):

```text
G8  = F8*4
H8  = C6*2
I8  = G8*0.25
J8  = ((G8-I8)-(H8*4))*0.2

G9  = F9*9
I9  = F9*9*0.02
J9  = G9-I9

G10 = F10*4
I10 = F10*4*0.1
J10 = MAX(0, G10-I10-((C15-C20)*4))

F12 = MAX(0, J8+J9+J10-(C12-H8*4))
F20 = F12/7700
F24 = F20*7700/F23
```

Оригинальная формула расхода `C12` также должна быть сверена буквально:

```text
IF(C6="","",
  IF(C9="ж",
    (10*C6 + 6.25*C7 - 5*C5 - 161),
    (10*C6 + 6.25*C7 - 5*C5 + 5)
  ) *
  IF(C11="Минимальный",1.1,
    IF(C11="Сидячий",1.2,
      IF(C11="Активный",1.4,)
    )
  )
)
```

Если при переносе обнаружится математическая неоднозначность (например, что именно означают F8/F9/F10 или почему в формуле присутствуют конкретные коэффициенты), не скрывай её косметическим текстом. Сохрани поведение исходной модели только после проверки, вынеси assumption в Pro/evidence layer и явно зафиксируй ограничение в `FAT_GAIN_MODEL_PROVENANCE.md` и тесте.

## Important scientific/editorial safety

The result must be labelled as an **estimate of theoretical energy surplus translated into fat-equivalent mass**, not as a direct measurement of body-fat gain. Weight change also includes water, glycogen, gut content and adaptive effects; the model cannot observe those components.

Use language such as:

- RU: «Оценка жирового эквивалента избытка энергии».
- EN: “Estimated fat-equivalent of the energy surplus”.
- RU limitation: «Это модельный ориентир, а не измерение состава тела. Фактическое изменение массы может отличаться из-за воды, гликогена и других компонентов».
- EN limitation: “This is a model estimate, not a body-composition measurement. Actual weight change can differ because of water, glycogen and other components.”

Не называй результат диагнозом, не обещай, что весь surplus превратился в жир, и не используй визуальную шкалу как медицинскую норму.

## UX нового калькулятора

Basic mode:

- age, sex, weight, height;
- body-fat percentage, если пользователь его знает;
- activity;
- training level;
- consumed protein/fat/carbohydrate with explicit units;
- optional flags for glycogen/training only if they реально меняют модель.

Pro mode:

- раскрывает TEF assumptions;
- показывает требуемый белок;
- estimated lean mass;
- glycogen capacity and available glycogen;
- P-ratio;
- macro-by-macro energy balance;
- scenario comparison and sensitivity;
- formula and provenance disclosure.

Не заставляй пользователя разбираться в гликогене до первого результата. Сложность должна появляться progressively, а не блокировать базовый расчёт.

Result order:

1. Основной результат в kg и kcal.
2. Короткое человеческое объяснение.
3. Что сильнее всего изменило оценку.
4. Практическое применение: что проверить в ближайшие 7–14 дней.
5. Ограничение и уровень уверенности метода.
6. Formula/evidence в раскрывающемся technical layer.
7. Related workflow: TDEE → calorie target → body-fat/lean-mass → progress.

Добавь search aliases RU/EN, related IDs, examples, validation, import/export compatibility и history/snapshot support. Если используется body-fat reference image из workbook, проверь право использования. Без подтверждённой лицензии не публикуй фотографическую шкалу как коммерческий asset: замени её на доступную оригинальную схему/нейтральную data visualization или явно оставь только reference для разработки. Не используй изображения для body shaming.

---

# P0-D. Редакторский проход: убрать формулировки с отпечатком генератора

Проведи repo-wide content review для RU и EN. Не удаляй доказательные оговорки, если они реально защищают пользователя, но перепиши их естественно.

Убери:

- абстрактные цепочки существительных без действия;
- повторяющиеся конструкции «это не X, а Y»;
- шаблонные «слои», «оси», «системы», «прозрачные протоколы», если они не нужны пользователю;
- одинаковый ритм и одинаковые абзацы на всех лабораториях;
- громкие claims без конкретного действия;
- псевдоперсональные советы без данных пользователя;
- бессодержательные CTA «Начать путь», «Раскрыть потенциал», «Получить ясность»;
- повторяющиеся disclaimer-блоки, которые не объясняют, что делать дальше;
- русско-английские гибриды и буквальный перевод.

Каждый текстовый блок должен отвечать хотя бы на один вопрос:

- Что я сейчас узнаю?
- Какие данные нужны?
- Как прочитать число?
- Где это применить?
- Что может изменить результат?
- Когда повторить измерение?
- Что этот метод не умеет?

Пиши коротко, конкретно, человеческим языком. Предпочитай глагол, измеримый объект и реальный контекст. RU — естественный русский, EN — естественный product English, а не перевод по словам.

Сохрани авторский голос Павла Маркова там, где он уже есть, и усили его точечно: одна честная прямая речь на Home и одна на About/Evidence достаточно. Не придумывай биографию, награды, отзывы, клиентов, медицинские полномочия или личные факты.

Добавь automated content lint, который ловит подозрительные filler-patterns, но не удаляет доказательные ограничения автоматически. Все спорные места проверь вручную.

---

# P0-E. Точечная вёрстка и читаемость

Сохрани текущую композицию и дизайн-систему, но исправь то, что реально мешает пользоваться продуктом:

- увеличь и усили secondary text, labels, help, error и metadata;
- проверь line-height и max-width русских и английских абзацев;
- исключи длинные строки, widows, clipping и наложение единиц;
- приведи numeric result, unit и explanation к стабильной вертикальной иерархии;
- исправь `min-width: 0`/flex overflow в grid и card-like surfaces;
- проверь dropdown/select в узком viewport;
- не делай весь интерфейс жирным вместо нормальной иерархии;
- не превращай каждый блок в bordered card;
- не добавляй декоративные градиенты, стекло, neon, emoji или псевдо-scientific HUD;
- оставь достаточно whitespace для фокуса, но убери пустоту, из-за которой действие теряется;
- уважай `prefers-reduced-motion`.

Обязательно проверь 320×568, 390×844, 768×1024, 1024×768, 1366×768, 1440×900 и 1920×1080.

---

# Тесты и quality gates

Добавь или расширь тесты так, чтобы они проверяли не только существование DOM, но и пользовательский результат:

## Functional

- registry и все 86 calculator IDs;
- новый Body calculator и его formula vectors;
- Basic/Pro state;
- Scenario A/B changes result;
- native/custom select change;
- keyboard activation;
- profile autofill;
- history/snapshot/favorites;
- import/export and migration;
- no `NaN`, `undefined`, broken refs or silent no-op.

## Themes and overlays

- valid theme values;
- persistence and System reaction;
- early theme application without FOUC;
- every dialog/popover/menu uses theme tokens;
- no hard-coded light surface inside dark/midnight overlay;
- contrast assertions for key text/control tokens;
- focus/escape/click-outside/focus-return.

## Localization

- all new RU strings exist;
- all new EN strings exist;
- no missing translation keys;
- no wrong-language fallback;
- no mixed-language labels on Home, Body, Calculator, Pro, Profile, Evidence and dialogs;
- locale number/date formatting remains correct;
- decimal input accepts both `12.5` and `12,5`.

## Content hygiene

Repo-wide scan and manual review for `TODO`, `FIXME`, `PLACEHOLDER`, `lorem`, `dummy`, `coming soon`, `example.com`, `NaN`, `undefined` and AI-sounding filler. Do not delete legitimate documentation examples without checking context.

## Browser QA

В Chromium реально выполни:

1. Open theme switcher → change every theme → open a dialog/popover in each.
2. Open Evidence/privacy surface → verify text, borders, links, button, close and focus.
3. Open Settings/Data, import/export and confirmation dialogs.
4. Open Body → fat-gain calculator → run Basic.
5. Open Pro → change dropdown/select → choose Scenario B → edit a number → calculate → compare result.
6. Repeat Pro flow by keyboard.
7. Switch RU → EN mid-flow and ensure the view remains functional.
8. Reload on a deep route, then test offline after first load.
9. Check console, failed resources, focus order, zoom 200% and reduced motion.

Сохрани after screenshots и зафиксируй результат по matrix `route × viewport × language × theme × state`.

---

# Документация и GitHub

Обнови фактическую документацию, а не только код:

- `README.md`;
- `docs/FORMULAS.md`;
- `docs/EVIDENCE.md`;
- `docs/CONTENT_COMPLETENESS_MATRIX.md`;
- `docs/VISUAL_QA_MATRIX.md`;
- `docs/QA_REPORT.md`;
- `docs/RELEASE_NOTES_*.md`.

Добавь:

- `docs/MARKOVLAB_TARGETED_POLISH_REPORT.md` — defects, root causes, fixes, screenshots, tests, remaining limitations;
- `docs/FAT_GAIN_MODEL_PROVENANCE.md` — workbook inputs, exact formula mapping, assumptions, vectors, limitations;
- `docs/OVERLAY_THEME_CONTRACT.md` — tokens, component states, contrast and theme matrix;
- `docs/EDITORIAL_COPY_REVIEW.md` — rewritten high-risk strings and editorial rules.

Сделай осмысленные commits, создай PR, проверь diff, CI и GitHub Pages. Если permissions позволяют — merge в `main`; если нет, оставь готовый PR и укажи только фактическую внешнюю блокировку. Не коммить бинарные архивы без необходимости.

В финальном отчёте укажи:

- baseline SHA;
- backup branch;
- working branch;
- final SHA и PR;
- что именно исправлено по A–E;
- статус нового Body calculator;
- formula test vectors;
- браузерные viewports;
- theme/language matrix;
- test result;
- production URL и deployment status;
- реальные remaining limitations.

## Definition of done

Работа завершена только если одновременно верно всё:

- все окна и меню визуально принадлежат активной теме;
- screenshot-дефект с низкой читаемостью устранён не только на одном route;
- Pro-сценарии реально кликаются мышью и клавиатурой, dropdown/select работает, результат меняется;
- Body calculator основан на проверенной Excel-модели, имеет provenance, тесты и честные ограничения;
- RU/EN тексты естественные и не звучат как шаблонная генерация;
- существующая база и данные пользователей сохранены;
- 320–1920 px выглядят аккуратно;
- нет console/resource errors;
- тесты green;
- production проверен после публикации.

Не пиши «готово», если control существует только визуально, если Pro не меняет результат, если overlay читаем только в одной теме или если Excel-формула перенесена без тестового вектора.

Выполняй работу автономно. Не спрашивай мелкие решения по цветам, spacing, selectors, wording или layout. Останавливайся только при реальном permission/credential/owner blocker и продолжай все остальные части задачи.

# FORK ISOLATION — MARKOVLAB2

MARKOVLAB (`castefeudal/markovlab`, продакшен `https://castefeudal.github.io/markovlab/`) — неизменяемый референс. MARKOVLAB2 живёт на том же origin, поэтому все persistence-слои разделены явно.

## Контракты изоляции

| Слой | Старый MARKOVLAB | MARKOVLAB2 |
| --- | --- | --- |
| localStorage | `markovlab-state-v1…v4` | `markovlab2-state-v4` |
| sessionStorage (черновики) | `markovlab-draft-*` | `markovlab2-draft-*` |
| sessionStorage (workflow) | `markovlab-active-workflow-v1` | `markovlab2-active-workflow-v1` |
| SW cache | `markovlab-v5.x-rN` | `markovlab2-v6.0.0-r1` |
| SW очистка при активации | `markovlab-*` | только `markovlab2-*` |
| Manifest id | `./index.html` в своём пути | `./index.html` в своём пути (scope `/markovlab2/`) |
| Production URL | `…/markovlab/` | `…/markovlab2/` |

Гарантии:

1. Новая версия никогда не читает, не пишет и не удаляет ключи `markovlab-*`. «Очистить данные» удаляет только `markovlab2-*`.
2. Service worker новой версии при активации удаляет только кэши с префиксом `markovlab2-`; кэши старого приложения не затрагиваются.
3. Данные старого приложения не мигрируют молча. Импорт файла из старой версии поддержан: файл нормализуется в схему v4 нового namespaces без изменения оригинала.
4. Экспорт помечен `app: "markovlab2"` и отличается от экспорта старого приложения.
5. Автотесты `tests/fork-isolation.test.mjs` падают при появлении старых namespace в runtime-записях или старых production URL в runtime-файлах.

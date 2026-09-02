# Visual QA matrix — MARKOVLAB 5.2.1-r3 production

| Surface | Automated | Browser before release | Production after release |
| --- | --- | --- | --- |
| Home RU/EN × Light/Paper/Dark/Midnight | renderer/token coverage | pending | pending |
| BMI and fat-gain Basic/Pro | direct pointer transaction + trace coverage | pre-fix pointer failure reproduced; stale r1 runtime identified | pass on r3: manual Chromium trace, selected state and Scenario B |
| All numeric Pro routes | renderer coverage | — | 84/84 pointer pass; 81 initial + 3 stabilized runner retries |
| Catalogue / internal Home route | renderer integrity | — | pass: All 86 renders 86; obsolete training-load link absent |
| Plate loader 101 kg | vector regression | — | pass: 100 lower, −1 delta, 102.5 upper |
| Body worked example and print report | localization regression | pending | enum leakage spot-check passed; print preview pending |
| Profile, Progress, Evidence | renderer coverage | pending | pending |
| 320/390/430/768/1024/1366/1440/1920 | responsive code review | pending | pending |
| Lazy images after scroll | asset existence only | pending | pending |

`pending` is deliberately not a pass. The production pointer evidence above was executed on deployed main `08c694e`; this table does not claim physical mobile, touch, zoom, screen-reader, print or offline execution without that evidence.

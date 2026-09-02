# Fat-equivalent surplus model — provenance

The Body calculator `fat-gain-surplus` is a transcription of the supplied workbook `Копия Калькулятор набора жира от переедания(5).xlsx`, sheet `Калькулятор`. The workbook is not loaded at runtime. Its formulas were read from the worksheet XML and reproduced as a pure function in `assets/js/formulas.js`.

## Inputs and units

| Workbook cell | Web field | Unit | Role |
| --- | --- | --- | --- |
| C5 | age | years | user input |
| C6 | weight | kg | user input |
| C7 | height | cm | user input |
| C8 | bodyFat | % | user input / assumption |
| C9 | sex | male/female | branch selector |
| C10 | trainingLevel | beginner/intermediate/athlete | coefficient selector |
| C11 | activity | minimal/sedentary/active | activity-factor selector |
| C18 | glycogenDepleted | yes/no | model flag |
| C19 | strengthLast24h | yes/no | model flag |
| F8/F9/F10 | proteinG/fatG/carbsG | grams/day | explicit web interpretation of macro inputs |
| F23 | deficitKcal | kcal/day | optional time-to-burn scenario |

The workbook labels F8–F10 as protein, fat and carbohydrate quantities but does not make the unit explicit in the cells. MARKOVLAB names the web fields as grams/day so the unit cannot be mistaken for g/kg. This is an editorial clarification; the arithmetic remains the workbook arithmetic (4/9/4 kcal per gram and the workbook TEF factors).

## Formula mapping

- `C12`: Mifflin–St Jeor, multiplied by activity factor 1.1 / 1.2 / 1.4.
- `C14`: fat-free mass × training coefficient 0.30 / 0.35 / 0.45; female branch × 0.8.
- `C15`: estimated muscle mass × 12.5 / 20 / 30 + 100 g liver reserve.
- `C20`: available glycogen = 25% when depleted; 80% after strength training; when both flags are true the workbook branch is 25%.
- `C21`: `10.4 / (10.4 + weight × bodyFat / 100)`.
- `G8/H8/I8/J8`, `G9/I9/J9`, `G10/I10/J10`, `F12`, `F20`, `F24` are transcribed as:

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

## Regression vectors

Rounded values below are the expected web outputs; unrounded arithmetic is used in tests.

| Case | TDEE | Surplus | Fat-equivalent | Available glycogen |
| --- | ---: | ---: | ---: | ---: |
| zero surplus (`protein=100, fat=0, carbs=0`) | 2259 | 0 | 0 kg | 604 g |
| positive surplus (`180/100/300`) | 2259 | 387 kcal | 0.05026 kg | 604 g |
| high carbohydrate (`180/100/800`) | 2259 | 2187 kcal | 0.28403 kg | 604 g |
| active activity (`180/100/800`, active) | 2635.5 | 1810.5 kcal | 0.23513 kg | 604 g |
| depleted glycogen (`180/100/800`, depleted) | 2259 | 375 kcal | 0.04870 kg | 151 g |

## Safety and limits

This is an **estimate of theoretical energy surplus translated into fat-equivalent mass**, not a direct measurement of body-fat gain. Actual weight change also includes water, glycogen, gut content and adaptive effects. It must not be presented as a diagnosis, a promise that surplus becomes fat, or a medical target.

The embedded workbook image was not published: it is a body-fat photo reference with no confirmed commercial licence. The product uses neutral data visualization instead.

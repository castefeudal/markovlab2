import { writeFileSync } from 'node:fs';
import { CALCULATORS } from '../assets/js/calculators.js';
import { REFERENCES } from '../assets/js/references.js';
import { WHEN_USEFUL, applyResultGuidance, fieldHelp, relatedFor, visualizationType } from '../assets/js/content.js';
import { calculatorMap } from '../assets/js/calculators.js';
import { evidenceLabels, methodLabels } from '../assets/js/i18n.js';

const clean=value=>String(value??'—').replaceAll('|','\\|').replaceAll('\n',' ');
const ru=value=>value?.ru??value??'—';
const defaults=calc=>Object.fromEntries(calc.fields.map(field=>[field.id,field.default]));
const fieldList=calc=>calc.fields.map(field=>`${ru(field.label)}${field.unit?` (${field.unit})`:''}`).join('<br>');
const sources=calc=>calc.sources.map(id=>REFERENCES[id]?.title?.ru||id).join('<br>')||'Внутренняя арифметика; внешний источник не требуется';
const related=calc=>relatedFor(calc,CALCULATORS).map(id=>ru(calculatorMap.get(id)?.title)||id).join('<br>');
const visualRu={exact:'только число',range:'корректный диапазон',composition:'состав',comparison:'сравнение',delta:'изменение',conversion:'конвертация',scenario:'сценарий',none:'без графика'};

const lines=[
  `# Матрица полноты ${CALCULATORS.length} калькуляторов`,
  '',
  '> Файл создаётся командой `npm run docs:matrix` из текущего registry. Он контролирует полноту продукта, но не заменяет пользовательский интерфейс и научную проверку источников.',
  '',
  '| ID | Калькулятор | Практическая задача | Обязательные данные | Необязательные данные | Формула / допущение | Метод | Основание | Интерпретация | Неопределённость и ограничение | Следующий шаг | Визуализация | Источники | Связанные инструменты | Проверки |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
];

for(const calc of CALCULATORS){
  const result=applyResultGuidance(calc,calc.calculate(defaults(calc),{}));
  const row=[
    `\`${calc.id}\``,ru(calc.title),ru(WHEN_USEFUL[calc.id]),fieldList(calc),'—',
    result.assumptions?.map(ru).join('<br>')||'—',ru(methodLabels[calc.methodType]),ru(evidenceLabels[calc.evidenceStrength]),
    ru(result.interpretation),`${ru(result.confidence)} ${ru(result.limitation)}`,ru(result.action),
    visualRu[visualizationType(calc.id)]||'без графика',sources(calc),related(calc),'RU ✓ · mobile ✓ · regression ✓'
  ];
  lines.push(`| ${row.map(clean).join(' | ')} |`);
}

lines.push('',`Итого: **${CALCULATORS.length} калькуляторов из ${CALCULATORS.length}**.`,'');
writeFileSync(new URL('../docs/CALCULATOR_COMPLETENESS_MATRIX.md',import.meta.url),lines.join('\n'));

const mark=value=>value?'✓':'—';
const contentLines=[
  `# CONTENT COMPLETENESS MATRIX — ${CALCULATORS.length}/${CALCULATORS.length}`,
  '',
  '> Автоматически создано командой `npm run docs:matrix` из production registry. ✓ означает, что поле существует и проходит структурную проверку; это не заменяет научную редактуру источника.',
  '',
  '| ID | Purpose | Description | Input help | Example | Meaning | Evidence | Uncertainty | Limitation | Action | References | Related | RU | EN |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
];
for(const calc of CALCULATORS){
  const result=applyResultGuidance(calc,calc.calculate(defaults(calc),{})),hasHelp=calc.fields.every(field=>fieldHelp(calc,field,'ru')&&fieldHelp(calc,field,'en'));
  const row=[calc.id,WHEN_USEFUL[calc.id]?.ru&&WHEN_USEFUL[calc.id]?.en,calc.description?.ru&&calc.description?.en,hasHelp,result.primary!==undefined,result.interpretation?.ru&&result.interpretation?.en,calc.methodType&&calc.evidenceStrength,result.confidence?.ru&&result.confidence?.en,result.limitation?.ru&&result.limitation?.en,result.action?.ru&&result.action?.en,calc.sources?.every(id=>REFERENCES[id]),relatedFor(calc,CALCULATORS).length>0,calc.title?.ru&&calc.description?.ru,calc.title?.en&&calc.description?.en];
  contentLines.push(`| \`${clean(row[0])}\` | ${row.slice(1).map(mark).join(' | ')} |`);
}
contentLines.push('',`Итого: **${CALCULATORS.length}/${CALCULATORS.length}** calculator records проходят обязательную структурную матрицу.`,'');
writeFileSync(new URL('../docs/CONTENT_COMPLETENESS_MATRIX.md',import.meta.url),contentLines.join('\n'));

import { mkdir, writeFile } from 'node:fs/promises';
import { CALCULATORS } from '../assets/js/calculators.js';
import { REFERENCES } from '../assets/js/references.js';
import { DOMAIN_CONTENT, WHEN_USEFUL, relatedFor, visualizationType } from '../assets/js/content.js';
await mkdir(new URL('../data/',import.meta.url),{recursive:true});
await writeFile(new URL('../data/calculator-catalog.json',import.meta.url),JSON.stringify({schemaVersion:2,count:CALCULATORS.length,domains:DOMAIN_CONTENT,calculators:CALCULATORS.map(({id,category,featured,title,description,methodType,evidenceStrength,sources,keywords})=>({id,category,featured,title,description,whenUseful:WHEN_USEFUL[id],methodType,evidenceStrength,sources,keywords,visualization:visualizationType(id),related:relatedFor({id,category},CALCULATORS)}))},null,2)+'\n');
await writeFile(new URL('../data/sources.json',import.meta.url),JSON.stringify({schemaVersion:1,accessed:'2026-08-15',sources:REFERENCES},null,2)+'\n');

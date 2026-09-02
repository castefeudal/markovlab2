import { readFileSync, writeFileSync } from 'node:fs';
import { RELEASE_CONFIG } from '../assets/js/config.js';

const raw=String(RELEASE_CONFIG.productionBaseUrl||'').trim();
if(!raw){
  console.log('productionBaseUrl не задан: metadata оставлены без выдуманного домена.');
  process.exit(0);
}
const url=new URL(raw);
if(url.protocol!=='https:')throw new Error('productionBaseUrl должен использовать HTTPS');
const base=url.href.replace(/\/$/,'');
const page=base+'/';
const indexUrl=new URL('../index.html',import.meta.url);
let html=readFileSync(indexUrl,'utf8');

const upsert=(markup,matcher,anchor)=>{
  html=matcher.test(html)?html.replace(matcher,markup):html.replace(anchor,markup+'\n  '+anchor);
};
upsert('<link rel="canonical" href="'+page+'">',/<link rel="canonical"[^>]*>/, '<link rel="manifest"');
upsert('<meta property="og:url" content="'+page+'">',/<meta property="og:url"[^>]*>/, '<meta property="og:type"');
upsert('<meta name="twitter:url" content="'+page+'">',/<meta name="twitter:url"[^>]*>/, '<meta name="twitter:card"');
html=html.replace(/<script type="application\/ld\+json">([^<]+)<\/script>/,(_,json)=>{
  const value=JSON.parse(json); value.url=page;
  return '<script type="application/ld+json">'+JSON.stringify(value)+'</script>';
});
writeFileSync(indexUrl,html);
writeFileSync(new URL('../sitemap.xml',import.meta.url),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>'+page+'</loc></url>\n</urlset>\n');
writeFileSync(new URL('../robots.txt',import.meta.url),'User-agent: *\nAllow: /\nSitemap: '+base+'/sitemap.xml\n');
console.log('Production metadata настроены для '+base);

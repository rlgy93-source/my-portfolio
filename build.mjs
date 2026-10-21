import {readFile,writeFile,readdir} from 'node:fs/promises';
const root=new URL('./',import.meta.url);
let html=await readFile(new URL('index.template.html',root),'utf8');
let css=await readFile(new URL('style.css',root),'utf8');
css=css.slice(css.indexOf(':root'));
let script=await readFile(new URL('app.js',root),'utf8');
const images={};
for(const file of await readdir(new URL('assets/',root))){if(!file.endsWith('.png'))continue;const data='data:image/png;base64,'+(await readFile(new URL('assets/'+file,root))).toString('base64');images[file.slice(0,-4)]=data;html=html.replaceAll('assets/'+file,data);}
script=script.replace("img.src='assets/'+name+'.png'",'img.src=embeddedImages[name]');
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+css+'\n</style>');
html=html.replace('<script src="app.js"></script>','<script>const embeddedImages='+JSON.stringify(images)+';\n'+script+'\n</script>');
await writeFile(new URL('index.html',root),html);
console.log('Built self-contained index.html');

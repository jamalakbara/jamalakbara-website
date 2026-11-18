// Slices manual-guide.html into Tanker/Erode text artwork (3×) for docs/design/jamalakbara.pen frames 35.1–35.6,
// and writes manual-guide.layout.json with every box and text position. Needs Google Chrome. Run: node templates/business-documents/slice-manual-guide.mjs
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';

const S = (await import('node:os')).tmpdir();
const ROOT = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const HTML = `file://${ROOT}/templates/business-documents/manual-guide.html`;
const OUT = `${ROOT}/docs/design/jamalakbara-assets/manual-guide`;
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  '--remote-debugging-port=9333', `--user-data-dir=${S}/chrome-prof`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch('http://127.0.0.1:9333/json/list')).json()).find(t => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
const cdp = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }).then(m => { if (m.error) throw new Error(method + ' ' + JSON.stringify(m.error)); return m.result; });
const ev = async expr => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

await cdp('Page.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: 858, height: 7154, deviceScaleFactor: 1, mobile: false });
await cdp('Page.navigate', { url: HTML });
await sleep(1500);
await ev('document.fonts.ready.then(()=>true)');

const collect = `(() => {
  const NAMES={mast:'Masthead',cols:'Client and application',band:'At a glance',table:'Table',steps:'Steps',note:'Note',shot:'Screenshot placeholder',legend:'Screenshot legend',task:'Task',dodont:'Do and avoid',bullets:'Support terms',sign:'Signatures',foot:'Footer','gap-8':'Contents',rule:'Rule',lead:'Copy',body:'Copy','h-sub':'Heading'};
  const txt=el=>el.textContent.replace(/\\s+/g,' ').trim();
  return [...document.querySelectorAll('.page')].map((pg,pi)=>{
    const P=pg.getBoundingClientRect();
    const rel=r=>({x:+(r.left-P.left).toFixed(2),y:+(r.top-P.top).toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2)});
    const tops=[...pg.querySelector('.page__body').children, pg.querySelector('.foot')];
    const groups=tops.map((g,gi)=>{const c=[...g.classList].find(k=>NAMES[k]);let n=g.classList.contains('sec')?'Section '+txt(g.querySelector('.sec__n'))+' / '+txt(g.querySelector('h2')).replace(/\\.$/,''):(NAMES[c]||'Block');
      if(['Copy','Heading','Task','Note','Table','Steps'].includes(n))n+=' / '+txt(g).slice(0,36);return {name:n,...rel(g.getBoundingClientRect()),items:[]}});
    const gi=el=>tops.findIndex(t=>t===el||t.contains(el));
    const op=el=>{let o=1;for(let e=el;e&&e!==pg;e=e.parentElement)o*=+getComputedStyle(e).opacity;return o};
    const leaves=new Set();
    for(const el of pg.querySelectorAll('*')){
      const g=gi(el); if(g<0)continue; const G=groups[g].items;
      if(el.closest('.tab')&&!el.classList.contains('tab'))continue;
      if(el.closest('.pin')&&!el.classList.contains('pin'))continue;
      if([...leaves].some(l=>l.contains(el)))continue;
      const cs=getComputedStyle(el), r=rel(el.getBoundingClientRect());
      if(el.classList.contains('tab')){G.push({k:'tab',...r});continue}
      if(el.classList.contains('stamp')){G.push({k:'stamp',...r});continue}
      if(el.classList.contains('pin')){leaves.add(el);G.push({k:'art',name:'Pin '+txt(el),...r});continue}
      const sides=['Top','Right','Bottom','Left'];
      const bw=sides.map(s=>cs['border'+s+'Style']==='none'?0:parseFloat(cs['border'+s+'Width']));
      const bg=cs.backgroundColor;
      if(!el.classList.contains('kbd')&&(bg!=='rgba(0, 0, 0, 0)'||bw.some(x=>x>0))){
        const bc=cs['border'+sides[bw.findIndex(x=>x>0)]+'Color'];
        G.push({k:'box',name:(el.className||el.tagName.toLowerCase()).split(' ')[0],...r,bg:bg==='rgba(0, 0, 0, 0)'?null:bg,bw,bc:bw.some(x=>x>0)?bc:null,dash:cs.borderTopStyle==='dashed',rad:[cs.borderTopLeftRadius,cs.borderTopRightRadius,cs.borderBottomRightRadius,cs.borderBottomLeftRadius].map(parseFloat),op:+op(el).toFixed(2)});
      }
      const direct=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
      if(direct){leaves.add(el);const rg=document.createRange();rg.selectNodeContents(el);let b=rg.getBoundingClientRect();let rr=rel(b);
        if(el.closest('.bullets,.dodont')&&el.tagName==='LI'){const e=rel(el.getBoundingClientRect());rr.w=+(rr.x+rr.w-e.x).toFixed(2);rr.x=e.x;}
        G.push({k:'art',name:txt(el).slice(0,60),...rr});}
    }
    return {groups};
  });
})()`;
const pages = await ev(collect);

// Text-only mode for slicing artwork
await ev(`(()=>{const s=document.createElement('style');s.textContent='*:not(.pin):not(.kbd){background:transparent!important;border-color:transparent!important;box-shadow:none!important} .tab,.stamp,.shot__ui{visibility:hidden!important} body,.page{background:transparent!important}';document.head.append(s);return true})()`);
await cdp('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
await sleep(200);
const page0 = await ev(`(()=>{const r=document.querySelector('.page').getBoundingClientRect();return [...document.querySelectorAll('.page')].map(p=>{const b=p.getBoundingClientRect();return {x:b.left+scrollX,y:b.top+scrollY}})})()`);

const PAD = 2; let n = 0;
for (const [pi, pg] of pages.entries()) {
  let k = 0;
  for (const g of pg.groups) for (const it of g.items) {
    if (it.k !== 'art') continue;
    const x = Math.floor(it.x - PAD), y = Math.floor(it.y - PAD);
    const w = Math.ceil(it.x + it.w + PAD) - x, h = Math.ceil(it.y + it.h + PAD) - y;
    Object.assign(it, { x, y, w, h });
    const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: page0[pi].x + x, y: page0[pi].y + y, width: w, height: h, scale: 3 } });
    it.file = `jamalakbara-assets/manual-guide/p${pi + 1}-${String(++k).padStart(2, '0')}.png`;
    writeFileSync(`${ROOT}/docs/design/${it.file}`, Buffer.from(shot.data, 'base64')); n++;
  }
}
writeFileSync(`${ROOT}/templates/business-documents/manual-guide.layout.json`, JSON.stringify(pages));
console.log('pages', pages.length, 'artwork', n, 'json bytes', JSON.stringify(pages).length);
ws.close(); chrome.kill();
process.exit(0);

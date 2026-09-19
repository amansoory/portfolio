const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
const b=await chromium.launch({channel:'msedge',headless:true});
const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await p.goto('http://localhost:3120',{waitUntil:'networkidle'});
await p.locator('.project-row').first().waitFor();
const paths=['jev-2048','degree-planner-ai','vibesafe','industry-resilience','space-battle','dungeon-hero','initial-d-racing-game'];
const external=['https://jev-2048.vercel.app','https://unc-degree-rag.vercel.app/','https://vibe-safe-pt7v.vercel.app','https://industry-resilience-predictor.streamlit.app/','https://github.com/amansoory/Space-Battles-Hackathon-Winner','https://github.com/amansoory/Dungeon-Hero-LogicGrid','https://github.com/amansoory/Hack-NC-Initial-D'];
await p.evaluate(()=>{window.linkChecks=[];document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.closest('.project-row')){e.preventDefault();window.linkChecks.push({href:a.getAttribute('href'),target:a.target});}},true);});
for(let i=0;i<paths.length;i++){
 const card=p.locator('.project-row').nth(i);await card.scrollIntoViewIfNeeded();
 const want='/projects/'+paths[i];
 assert.equal(await card.locator('.project-actions .resource-link').getAttribute('href'),external[i]);
 assert.equal(await card.locator('.project-actions .resource-link').getAttribute('target'),'_blank');
 for(const el of [card.locator('.project-card-link'),card.locator('h3 a'),card.locator('.project-preview-link .project-visual')]){
  const before=await p.evaluate(()=>window.linkChecks.length);
  if(await el.getAttribute('class')==='project-card-link') await el.click({position:{x:5,y:5}});else await el.click();
  const clicks=await p.evaluate(()=>window.linkChecks);assert.equal(clicks.length,before+1);assert.equal(clicks.at(-1).href,want);
 }
 for(const link of await card.locator('.project-actions a').all()){
  const href=await link.getAttribute('href');const before=await p.evaluate(()=>window.linkChecks.length);await link.click();let clicks=await p.evaluate(()=>window.linkChecks);assert.equal(clicks.length,before+1);assert.equal(clicks.at(-1).href,href);
  await link.focus();await p.keyboard.press('Enter');clicks=await p.evaluate(()=>window.linkChecks);assert.equal(clicks.length,before+2);assert.equal(clicks.at(-1).href,href);
 }
 await card.locator('.project-card-link').focus();await p.keyboard.press('Enter');assert.equal((await p.evaluate(()=>window.linkChecks)).at(-1).href,want);
}
assert.equal(await p.locator('.skill-group').count(),4);assert.equal(await p.locator('.skill-description').count(),0);assert.equal(await p.locator('.coursework li').count(),12);
assert.equal(await p.locator('a a').count(),0);
await p.goto('http://localhost:3120');await p.locator('.project-card-link').first().click({position:{x:5,y:5}});await p.waitForURL('**/projects/jev-2048');assert.match(await p.locator('.case-header > p').first().innerText(),/A 2048 experiment comparing TypeSafe Jev/);
fs.mkdirSync('test-results/approved-copy',{recursive:true});
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 await p.setViewportSize({width,height});await p.goto('http://localhost:3120',{waitUntil:'networkidle'});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:'test-results/approved-copy/'+name+'-hero.png'});
 await p.locator('.project-row').first().scrollIntoViewIfNeeded();await p.screenshot({path:'test-results/approved-copy/'+name+'-card.png'});
}
console.log('PASS: seven card destinations; background/title/image; action links + Enter; no duplicate activation or nested anchors; real detail navigation; preserved Jev introduction; 4 skill groups; 12 courses; desktop/mobile no overflow.');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});


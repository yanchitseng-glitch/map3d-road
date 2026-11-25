import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dir = resolve('qa-output');
await mkdir(dir, {recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true,locale:'en-US'});
const page=await context.newPage();
// OpenSlide PDF export calls window.print(): in headless CI we intercept that
// request, print its official #os-print-root via Chromium, then signal afterprint.
await page.addInitScript(() => { window.print = () => { window.__jjpPrintRequested = true; }; });
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
const summary={framework:'@open-slide/core',slideId:'architecture-of-care-2026',pages:[],exports:{},agentPanel:null,errors};
try{
for(let i=1;i<=15;i++){
  const url='http://127.0.0.1:5173/s/architecture-of-care-2026/preview?p='+i;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('[data-osd-preview="ready"]').waitFor({timeout:45000});
  await page.screenshot({path:resolve(dir,'slide-'+String(i).padStart(2,'0')+'.png'),animations:'disabled'});
  const audit=await page.locator('[data-jjp-line]').evaluateAll(nodes=>nodes.map(n=>{
    const r=n.getBoundingClientRect();
    return {text:n.textContent?.trim()||'',x:Math.round(r.x),y:Math.round(r.y),right:Math.round(r.right),bottom:Math.round(r.bottom)};
  }));
  const clipped=audit.filter(a=>a.x<0||a.y<0||a.right>1924||a.bottom>1084);
  const orphans=audit.filter(a=>Array.from(a.text).length<=2);
  summary.pages.push({number:i,ready:true,lines:audit.length,clipped,orphans});
  console.log('Preview',i,'/15 ready; text lines',audit.length,'clipped',clipped.length,'orphans',orphans.length);
  if(clipped.length||orphans.length)errors.push('Page '+i+' has clipped/orphan text: '+JSON.stringify({clipped,orphans}));
}
await page.goto('http://127.0.0.1:5173/s/architecture-of-care-2026',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(1500);
await page.keyboard.press('a');
await page.waitForTimeout(2000);
summary.agentPanel={shortcutAttempted:true,visibleAfterShortcut:await page.getByText(/agent|codex|claude/i).count()>0};
await page.screenshot({path:resolve(dir,'agent-panel.png'),animations:'disabled'});

for(const format of ['HTML','PDF','PPTX']){
  try{
    const downloadButton=page.getByRole('button',{name:'Download'});
    await downloadButton.waitFor({timeout:10000});
    await downloadButton.click();
    if(format==='PDF'){
      await page.getByRole('menuitem',{name:'Export as PDF',exact:true}).click();
      await page.waitForFunction(() => !!window.__jjpPrintRequested && !!document.getElementById('os-print-root'), null, {timeout:65000});
      const name='architecture-of-care-2026.pdf';
      // Chromium prints the DOM assembled by the official OpenSlide PDF exporter.
      // This is the browser's print-to-PDF equivalent of the user's print dialog.
      await page.pdf({path:resolve(dir,name),printBackground:true,preferCSSPageSize:true,scale:1,timeout:90000});
      await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
      summary.exports[format]={ok:true,name,engine:'OpenSlide browser print layout / Chromium printToPDF'};
    } else {
      const downloadEvent=page.waitForEvent('download',{timeout:90000});
      await page.getByRole('menuitem',{name:'Export as '+format,exact:true}).click();
      const download=await downloadEvent;
      const name=download.suggestedFilename();
      await download.saveAs(resolve(dir,name));
      summary.exports[format]={ok:true,name};
    }
    console.log(format,'export',summary.exports[format].name);
    await page.waitForTimeout(1200);
  }catch(error){
    summary.exports[format]={ok:false,error:String(error)};
    errors.push('Export '+format+' failed: '+String(error));
  }
}
await writeFile(resolve(dir,'qa-summary.json'),JSON.stringify(summary,null,2));
if(errors.length)process.exitCode=1;
}finally{await browser.close();}

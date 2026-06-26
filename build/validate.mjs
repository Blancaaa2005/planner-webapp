/* Playwright smoke test against the built file:// HTML (no network). */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'out', 'Planner-Digital-Todo-en-Uno.html');
const URL = pathToFileURL(FILE).href;

const fail = [];
function check(name, cond){ console.log((cond?'✓':'✗')+' '+name); if(!cond) fail.push(name); }

const browser = await chromium.launch();
const ctx = await browser.newContext({ offline:true });   // hard-block any network
const page = await ctx.newPage();
const reqs = [];
page.on('request', r=>{ const u=r.url(); if(!u.startsWith('file:') && !u.startsWith('data:') && !u.startsWith('blob:')) reqs.push(u); });
const errs = [];
page.on('pageerror', e=>errs.push(''+e));

await page.goto(URL, { waitUntil:'load' });
await page.waitForTimeout(400);

// 1. no JS errors, no external network
check('no page errors', errs.length===0); if(errs.length) console.log('   '+errs.join('\n   '));
check('no external network requests', reqs.length===0); if(reqs.length) console.log('   '+reqs.slice(0,5).join('\n   '));

// 2. toolbar built
check('toolbar present', await page.locator('#lp-toolbar .tb-brand').count()===1);
check('6 theme dots', await page.locator('#lp-toolbar .tb-dot').count()===6);

// 3. only one active page at a time
check('exactly one active page', await page.locator('.lp-page.is-active').count()===1);

// 4. navigate to month via hash anchor click from hub
await page.goto(URL+'#hub'); await page.waitForTimeout(200);
await page.locator('a[href="#month-01"]').first().click(); await page.waitForTimeout(200);
check('nav to month-01 works', await page.evaluate(()=>location.hash)==='#month-01');
check('month-01 is the active page', await page.locator('#month-01.is-active').count()===1);

// 5. persistence: type into a field, reload, value restored
await page.goto(URL+'#day'); await page.waitForTimeout(200);
const f = page.locator('#day input[name="day-foco"]');
await f.fill('Mi foco de prueba'); await page.waitForTimeout(150);
await page.reload(); await page.waitForTimeout(300);
await page.goto(URL+'#day'); await page.waitForTimeout(200);
check('field value persists across reload', (await page.locator('#day input[name="day-foco"]').inputValue())==='Mi foco de prueba');

// 6. checkbox persistence
await page.goto(URL+'#yearly'); await page.waitForTimeout(200);
await page.locator('#yearly label.lp-cbwrap').first().click(); await page.waitForTimeout(150);
await page.reload(); await page.goto(URL+'#yearly'); await page.waitForTimeout(300);
check('checkbox state persists', await page.locator('#yearly input.lp-toggle').first().isChecked());

// 7. derived value: finance queda = entra - sale
await page.goto(URL+'#finance'); await page.waitForTimeout(200);
await page.locator('#finance input[name="fin-entra"]').fill('3000');
await page.locator('#finance input[name="fin-sale"]').fill('1200');
await page.waitForTimeout(200);
check('finance queda derived', /^1\.?800,00/.test((await page.locator('#finance .js-fin-queda').textContent()).replace(/\s/g,'')));

// 8. derived: habit row sum increments when squares checked
await page.goto(URL+'#habits'); await page.waitForTimeout(200);
const sqs = page.locator('.js-habit-row').first().locator('label.lp-sqwrap');
await sqs.nth(0).click(); await sqs.nth(1).click(); await sqs.nth(2).click();
await page.waitForTimeout(150);
check('habit row sum = 3', (await page.locator('.js-habit-row').first().locator('.js-habit-sum').textContent()).trim()==='3');

// 9. theme switch updates data-theme + persists
await page.goto(URL+'#cover'); await page.waitForTimeout(200);
await page.locator('#lp-toolbar .tb-dot[data-theme="sage"]').click(); await page.waitForTimeout(150);
check('theme switched to sage', (await page.evaluate(()=>document.documentElement.getAttribute('data-theme')))==='sage');
await page.reload(); await page.waitForTimeout(300);
check('theme persists after reload', (await page.evaluate(()=>document.documentElement.getAttribute('data-theme')))==='sage');

// 10. no sample data leaked: month priorities inputs are empty
await page.goto(URL+'#month-03'); await page.waitForTimeout(200);
const vals = await page.locator('#month-03 input[type="text"]').evaluateAll(els=>els.map(e=>e.value).filter(Boolean));
check('month page ships blank (no prefilled text)', vals.length===0);

// 11. page count
check('73 pages present', await page.locator('.lp-page').count()===73);

await browser.close();
console.log('\n'+(fail.length? ('FAILED: '+fail.join(', ')) : 'ALL CHECKS PASSED'));
process.exit(fail.length?1:0);

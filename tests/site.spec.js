import { test, expect } from '@playwright/test';
test('desktop renders 3D, changes scenes, and opens contact',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:5173');
 await expect(page.locator('h1')).toContainText('つなぐ。');
 await expect(page.locator('body')).not.toHaveClass(/no-webgl/);
 await page.screenshot({path:'/tmp/sitop-desktop.png'});
 await page.evaluate(()=>scrollTo(0,1020));await expect(page.locator('#device-name')).toContainText('SERVER');
 await page.evaluate(()=>scrollTo(0,1650));await expect(page.locator('#device-name')).toContainText('NETWORK');
 await page.locator('#contact-open').click();await expect(page.locator('dialog')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();
 expect(errors).toEqual([]);
});
test('mobile has no horizontal overflow and supports reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:5173');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'/tmp/sitop-mobile.png'});
 await page.locator('.contact-nav').click();await expect(page.locator('#contact-open')).toBeInViewport();
});

import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']}},reporter:'list'});

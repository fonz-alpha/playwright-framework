import { test, expect, type Page } from '@playwright/test';

import { GooglePage } from '../pages/google/google.page';


test.beforeEach(async ({ page }) => {
    await page.goto('https://google.com/');

});

test.afterEach(async ({ page }) => {
    await page.close();

});

test.describe('Navigating to Google Search', () => {

    test('has title', async ({ page }) => {


        await expect(page).toHaveTitle(/Google/);

    });

    test('make a search for playwright', async ({ page }) => {

        //const searchInput = page.locator('textarea[type="search"]');
        const googlePage = new GooglePage(page);
        await googlePage.searchInput.fill('Playwright');
        await googlePage.searchInput.press('Enter');

        await expect(googlePage.searchInput).toBeHidden;

    });


});


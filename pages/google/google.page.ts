import { type Locator, type Page } from '@playwright/test';

export class GooglePage {
   readonly page: Page;
   readonly searchInput: Locator;

   constructor(page: Page) {
      this.page = page;
      this.searchInput = page.locator('textarea[title="Search"]');
   }


}

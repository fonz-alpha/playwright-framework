import { BasePage } from '../common/base.page';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {
  
  private static instance: HomePage;
  readonly bookAScanButton = this.page.locator('div[class="home"] > div[class="content"] button[data-testid="book-scan-btn"]');

  public static getPage(page: Page): HomePage {
      if (!HomePage.instance) {
        HomePage.instance = new HomePage(page);
      }
      return HomePage.instance;
    }
}
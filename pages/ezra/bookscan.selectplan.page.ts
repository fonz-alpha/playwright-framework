import { BasePage } from '../common/base.page';
import { Page } from '@playwright/test';

export class BookScanSelectPlanPage extends BasePage {
  
  private static instance: BookScanSelectPlanPage;

  readonly mriScanListItem = this.page.locator('ul[class="content-container encounters-container"] li[class="encounter-list-item"]:nth-of-type(1) div[class="encounter-card__title"]');

  readonly mriScanWithSpineListItem = this.page.locator('ul[class="content-container encounters-container"] li[class="encounter-list-item"]:nth-of-type(2) div[class="encounter-card__title"]');

  readonly continueButton = this.page.locator('button[data-testid="select-plan-submit-btn"]');

  public static getPage(page: Page): BookScanSelectPlanPage {
      if (!BookScanSelectPlanPage.instance) {
        BookScanSelectPlanPage.instance = new BookScanSelectPlanPage(page);
      }
      return BookScanSelectPlanPage.instance;
    }
}
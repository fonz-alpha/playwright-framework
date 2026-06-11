import { BasePage } from '../common/base.page';
import { expect, Page } from '@playwright/test';

export class BookScanScheduleScanPage extends BasePage {

  private static instance: BookScanScheduleScanPage;

  static locationCard(page: Page, card: number) {
    return page.locator(`div[class="location-cards"] div[class="location-card"]:nth-of-type(${card})`);
  }

  static locationCardNameText(page: Page, card: number) {
    return page.locator(`div[class="location-cards"] div[class="location-card"]:nth-of-type(${card}) p[class="b3--bold location-card__name"]`);
  }

  static locationCardAddressText(page: Page, card: number) {
    return page.locator(`div[class="location-cards"] div[class="location-card"]:nth-of-type(${card}) p[class="b4 location-card__street"]`);
  }

  static datePicker(page: Page, day: number) {
    return page.locator(`div[class="vuecal__cell vuecal__cell--day${day}"]`);
  }

  static datePickerDayText(page: Page, day: number) {
    return page.locator(`div[class="vuecal__cell vuecal__cell--day${day}"] div[class="b3--bold"]`);
  }

  readonly pickMonthButton = this.page.locator('div[class="calendar-title"] button[class="trigger-btn"]');

  readonly pickMonthButtonText = this.page.locator('div[class="calendar-title"] button[class="trigger-btn"] p');

  static timePicker(page: Page, option: number) {
    return page.locator(`div[class="appointments__individual-appointment"]:nth-of-type(${option})`);
  }

  static timePickerTimeText(page: Page, option: number) {
    return page.locator(`div[class="appointments__individual-appointment"]:nth-of-type(${option}) label div`);
  }

  readonly modalHeader = this.page.locator('div[class="--full-screen modal-dialogue"][style=""] div[class="modal--header"] h4');

  readonly modalParagraph = this.page.locator('div[class="--full-screen modal-dialogue"][style=""] p');

  readonly modalIUnderstandButton = this.page.locator('div[class="--full-screen modal-dialogue"][style=""] div[class="--actions_offline_center"] button');

  readonly continueButton = this.page.locator('button[data-test="submit"]');

  public static getPage(page: Page): BookScanScheduleScanPage {
    if (!BookScanScheduleScanPage.instance) {
      BookScanScheduleScanPage.instance = new BookScanScheduleScanPage(page);
    }
    return BookScanScheduleScanPage.instance;
  }

  async selectFirstAvailableLocationDateTime() {
    await BookScanScheduleScanPage.locationCard(this.page, 1).click();
    await expect(BookScanScheduleScanPage.getPage(this.page).pickMonthButton).toBeVisible({ timeout: 60000 });
    let dayOfWeek: number = 1;
    while (await BookScanScheduleScanPage.datePicker(this.page, dayOfWeek).first().isHidden()) {
      dayOfWeek++;
    }
    await BookScanScheduleScanPage.datePicker(this.page, dayOfWeek).nth(0).click();

    await BookScanScheduleScanPage.timePicker(this.page, 1).click();

    await BookScanScheduleScanPage.getPage(this.page).continueButton.click();
    await expect(BookScanScheduleScanPage.getPage(this.page).pickMonthButton).toBeHidden({ timeout: 120000 });
  }
}
import { BasePage } from '../common/base.page';
import { Page } from '@playwright/test';

export class ScanConfirmPage extends BasePage {
    private static instance: ScanConfirmPage;

    readonly appointmentConfirmationHeader = this.page.locator('div[class="scan-confirm__right-col"] h4');

    readonly appointmentConfirmationCenterText = this.page.locator('div[class="scan-confirm__right-col"] div[class="scan-details"] > div[class="scan-details__row"] p[class="b2"]');

    readonly appointmentConfirmationAddressText = this.page.locator('div[class="scan-confirm__right-col"] div[class="scan-details"] > div[class="scan-details__row"] p[class="b4 --light-text scan-details__row__title"]:nth-of-type(3)');

    readonly appointmentConfirmationDateText = this.page.locator('div[class="scan-confirm__right-col"] div[class="scan-details"] > div > div[class="scan-details__row"] p[class="b2"]');

    static appointmentConfirmationDateTexts(page: Page, option: number) {
        return page.locator(`div[class="scan-confirm__right-col"] ul li:nth-of-type(${option}) div`);
    }

    public static getPage(page: Page): ScanConfirmPage {
        if (!ScanConfirmPage.instance) {
            ScanConfirmPage.instance = new ScanConfirmPage(page);
        }
        return ScanConfirmPage.instance;
    }
}
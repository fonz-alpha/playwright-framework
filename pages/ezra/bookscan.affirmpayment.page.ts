import { BasePage } from '../common/base.page';
import { Page } from '@playwright/test';

export class AffirmPaymentPage extends BasePage {
    private static instance: AffirmPaymentPage;

    readonly mobilePhoneInput = this.page.locator('input[data-testid="phone-number-field"]');

    readonly continueButton = this.page.locator('button[data-testid="submit-button"]');

    readonly phonePinInput = this.page.locator('input[data-testid="phone-pin-field"]');

    static planOptions(page: Page, option: number) {
        return page.locator(`div[data-testid="term-card"]:nth-of-type(${option}) div[data-testid="indicator"]`);
    }
    
    readonly chooseThisPlanButton = this.page.locator('button[data-testid="continue-with-selected-term-button"]');

    readonly disclosureCheckbox = this.page.locator('div[data-testid="disclosure-checkbox-indicator"]');//

    readonly confirmButton = this.page.locator('button[data-testid="submit-button"]');

    public static getPage(page: Page): AffirmPaymentPage {
        if (!AffirmPaymentPage.instance) {
            AffirmPaymentPage.instance = new AffirmPaymentPage(page);
        }
        return AffirmPaymentPage.instance;
    }
}
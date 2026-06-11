import { BasePage } from '../common/base.page';
import { Page } from '@playwright/test';

export class ReserveAppointmentPage extends BasePage {

    private static instance: ReserveAppointmentPage;

    readonly reserveAppointmentHeader = this.page.locator('div[class="reserve-appointment-layout"] h4');

    readonly securePaymentInputFrame = this.page.frameLocator('iframe[title="Secure payment input frame"]').nth(0);

    readonly creditCardNumberInput = this.securePaymentInputFrame.locator('input[id="payment-numberInput"]');

    readonly creditCardExpiryInput = this.securePaymentInputFrame.locator('input[id="payment-expiryInput"]');

    readonly creditCardCvvInput = this.securePaymentInputFrame.locator('input[id="payment-cvcInput"]');

    readonly creditCardZipCodeInput = this.securePaymentInputFrame.locator('input[id="payment-postalCodeInput"]');

    readonly affirmPaymentCheckbox = this.securePaymentInputFrame.locator('div[data-value="affirm"] circle[class="RadioIconOuter p-RadioIconOuter"]');

    readonly pricingPlanText = this.page.locator('div[class="pricing-descriptions"] p[class="b2--bold __plan"]');

    readonly pricingCenterText = this.page.locator('div[class="pricing-descriptions"] p[class="b3--bold __center"]');

    readonly pricingAddressText = this.page.locator('div[class="pricing-descriptions"] p[class="b4 __address"]');

    readonly pricingDateText = this.page.locator('div[class="pricing-descriptions"] p[class="b4--bold __date"]');

    static pricingDateTexts(page: Page, option: number) {
        return page.locator(`div[class="pricing-descriptions"] ul li:nth-of-type(${option}) div[class="b4"]`);
    }

    readonly continueButton = this.page.locator('button[data-test="submit"]');

    public static getPage(page: Page): ReserveAppointmentPage {
        if (!ReserveAppointmentPage.instance) {
            ReserveAppointmentPage.instance = new ReserveAppointmentPage(page);
        }
        return ReserveAppointmentPage.instance;
    }
}
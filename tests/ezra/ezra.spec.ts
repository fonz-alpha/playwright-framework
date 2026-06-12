import { test, expect, type Page } from '@playwright/test';
import { SignInPage } from '../../pages/ezra/signin.page';
import { HomePage } from '../../pages/ezra/home.page';
import { BookScanSelectPlanPage } from '../../pages/ezra/bookscan.selectplan.page';
import { BookScanScheduleScanPage } from '../../pages/ezra/bookscan.schedulescan.page';
import { ReserveAppointmentPage } from '../../pages/ezra/bookscan.reserveappointment.page';
import { ScanConfirmPage } from '../../pages/ezra/bookscan.scanconfirm.page';
import { AffirmPaymentPage } from '../../pages/ezra/bookscan.affirmpayment.page';
import * as testData from '../../parameters.json';
import { RESERVE_APPOINTMENT_PAGE, SCAN_CONFIRM_PAGE, BOOK_SCAN_SCHEDULE_SCAN_PAGE } from '../../constants/content';


test.beforeEach(async ({ page }) => {


    await page.goto('/sign-in');

    await expect(page).toHaveTitle(/Login - My Ezra | Ezra US/);

    await SignInPage.getPage(page).signIn(testData.user, testData.password);

    await expect(SignInPage.getPage(page).usernameInput).toBeHidden();
    await expect(HomePage.getPage(page).bookAScanButton).toBeVisible();
});

test.afterEach(async ({ page }) => {

    await page.close();
});

test.describe('BOOK A SCAN Test Suite', () => {

    test('MRI Scan - Book a scan and pay successfully with a credit card.', async ({ page }) => {

        let locationCardIndex: number = 2;
        let appointmentDay: string;
        let appointmentTime: string;
        let appointmentMonth: string;
        let appointmentYear: string;
        let appointmentLocationName: string;
        let appointmentLocationAddress: string;

        await test.step('can select an MRI Scan', async () => {

            await HomePage.getPage(page).bookAScanButton.click();
            await BookScanSelectPlanPage.getPage(page).mriScanListItem.click();
            await BookScanSelectPlanPage.getPage(page).continueButton.click();

            await expect(BookScanScheduleScanPage.locationCard(page, locationCardIndex)).toBeVisible();
        });

        await test.step('can schedule a scan', async () => {

            appointmentLocationName = await BookScanScheduleScanPage.locationCardNameText(page, locationCardIndex).innerText();
            appointmentLocationAddress = await BookScanScheduleScanPage.locationCardAddressText(page, locationCardIndex).innerText();
            await BookScanScheduleScanPage.locationCard(page, locationCardIndex).click();
            await expect(BookScanScheduleScanPage.getPage(page).pickMonthButton).toBeVisible({ timeout: 60000 });
            let dayOfWeek: number = 1;
            while (await BookScanScheduleScanPage.datePicker(page, dayOfWeek).first().isHidden()) {
                dayOfWeek++;
            }
            await page.waitForTimeout(2000);
            appointmentDay = await BookScanScheduleScanPage.datePickerDayText(page, dayOfWeek).first().innerText();
            await BookScanScheduleScanPage.datePicker(page, dayOfWeek).first().click();

            appointmentTime = await BookScanScheduleScanPage.timePickerTimeText(page, 1).innerText();
            await BookScanScheduleScanPage.timePicker(page, 1).click();

            appointmentMonth = (await BookScanScheduleScanPage.getPage(page).pickMonthButtonText.innerText()).trim().split(' ')[0];
            appointmentMonth = appointmentMonth.slice(0, 3);
            appointmentYear = (await BookScanScheduleScanPage.getPage(page).pickMonthButtonText.innerText()).trim().split(' ')[1];

            await expect(BookScanScheduleScanPage.getPage(page).continueButton).toBeEnabled();
            await BookScanScheduleScanPage.getPage(page).continueButton.click();

            await expect(BookScanScheduleScanPage.getPage(page).pickMonthButton).toBeHidden({ timeout: 120000 })

            await expect(ReserveAppointmentPage.getPage(page).reserveAppointmentHeader).toBeVisible();
            await expect(ReserveAppointmentPage.getPage(page).reserveAppointmentHeader).toHaveText(RESERVE_APPOINTMENT_PAGE.RESERVE_APPOINTMENT_HEADER);
            await expect(ReserveAppointmentPage.getPage(page).creditCardNumberInput).toBeEditable();
            await expect(ReserveAppointmentPage.getPage(page).creditCardExpiryInput).toBeEditable()
            await expect(ReserveAppointmentPage.getPage(page).creditCardCvvInput).toBeEditable()
            await expect(ReserveAppointmentPage.getPage(page).creditCardZipCodeInput).toBeEditable()
        });

        await test.step('appointment information is correct', async () => {

            await expect(ReserveAppointmentPage.getPage(page).pricingPlanText).toHaveText(RESERVE_APPOINTMENT_PAGE.PRICING_PLAN_MRI_SCAN_TEXT);
            await expect(ReserveAppointmentPage.getPage(page).pricingCenterText).toHaveText(appointmentLocationName);
            await expect(ReserveAppointmentPage.getPage(page).pricingAddressText).toHaveText(appointmentLocationAddress);
            await expect(ReserveAppointmentPage.getPage(page).pricingDateText).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime} EDT`);
        });

        await test.step('can reserve the appointment', async () => {

            await ReserveAppointmentPage.getPage(page).creditCardNumberInput.fill(testData.creditCard.number);
            await ReserveAppointmentPage.getPage(page).creditCardExpiryInput.fill(testData.creditCard.expiry);
            await ReserveAppointmentPage.getPage(page).creditCardCvvInput.fill(testData.creditCard.cvv);
            await ReserveAppointmentPage.getPage(page).creditCardZipCodeInput.fill(testData.creditCard.zipCode);
            await ReserveAppointmentPage.getPage(page).continueButton.click();

            await expect(ReserveAppointmentPage.getPage(page).continueButton).toBeHidden();
            //await expect(ScanConfirmPage.getPage(page).appointmentConfirmationHeader).toBeHidden();
            await expect(ScanConfirmPage.getPage(page).appointmentConfirmationHeader).toHaveText(SCAN_CONFIRM_PAGE.APPOINTMENT_CONFIRMATION_MRI_SCAN_HEADER);
            await expect(ScanConfirmPage.getPage(page).appointmentConfirmationCenterText).toHaveText(appointmentLocationName);
            await expect(ScanConfirmPage.getPage(page).appointmentConfirmationAddressText).toHaveText(appointmentLocationAddress);
            await expect(ScanConfirmPage.getPage(page).appointmentConfirmationDateText).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime} EDT`);
        });
    });

    test('MRI Scan - Book a scan with a location that cannot confirm bookings immediately and pay successfully with Affirm', async ({ page }) => {

        let locationCardIndex: number = 12;
        let appointmentDay: string;
        let appointmentTime1: string;
        let appointmentTime2: string;
        let appointmentTime3: string;
        let appointmentMonth: string;
        let appointmentYear: string;
        let appointmentLocationName: string;
        let appointmentLocationAddress: string;

        await test.step('can select an MRI Scan with Spine', async () => {

            await HomePage.getPage(page).bookAScanButton.click();
            await BookScanSelectPlanPage.getPage(page).mriScanWithSpineListItem.click();
            await BookScanSelectPlanPage.getPage(page).continueButton.click();

            await expect(BookScanScheduleScanPage.locationCard(page, locationCardIndex)).toBeVisible();
        });

        await test.step('can schedule a scan with a location that cannot confirm bookings immediately', async () => {

            appointmentLocationName = await BookScanScheduleScanPage.locationCardNameText(page, locationCardIndex).innerText();
            appointmentLocationAddress = await BookScanScheduleScanPage.locationCardAddressText(page, locationCardIndex).innerText();
            await BookScanScheduleScanPage.locationCard(page, locationCardIndex).click();
            await expect(BookScanScheduleScanPage.getPage(page).pickMonthButton).toBeVisible({ timeout: 60000 });
            let dayOfWeek: number = 1;
            while (await BookScanScheduleScanPage.datePicker(page, dayOfWeek).first().isHidden()) {
                dayOfWeek++;
            }
            appointmentDay = await BookScanScheduleScanPage.datePickerDayText(page, dayOfWeek).first().innerText();
            await BookScanScheduleScanPage.datePicker(page, dayOfWeek).first().click();

            let timeOfDay: number = 1;
            while (await BookScanScheduleScanPage.timePicker(page, timeOfDay).first().isHidden()) {
                timeOfDay++;
            }

            appointmentTime1 = await BookScanScheduleScanPage.timePickerTimeText(page, timeOfDay).innerText();
            await BookScanScheduleScanPage.timePicker(page, timeOfDay).click();

            await expect(BookScanScheduleScanPage.getPage(page).modalHeader).toHaveText(BOOK_SCAN_SCHEDULE_SCAN_PAGE.MODAL_HEADER);

            await expect(BookScanScheduleScanPage.getPage(page).modalParagraph).toHaveText(BOOK_SCAN_SCHEDULE_SCAN_PAGE.MODAL_PARAGRAPH);

            await BookScanScheduleScanPage.getPage(page).modalIUnderstandButton.click();

            appointmentTime2 = await BookScanScheduleScanPage.timePickerTimeText(page, timeOfDay + 1).innerText();
            await BookScanScheduleScanPage.timePicker(page, timeOfDay + 1).click();

            appointmentTime3 = await BookScanScheduleScanPage.timePickerTimeText(page, timeOfDay + 2).innerText();
            await BookScanScheduleScanPage.timePicker(page, timeOfDay + 2).click();

            appointmentMonth = (await BookScanScheduleScanPage.getPage(page).pickMonthButtonText.innerText()).trim().split(' ')[0];
            appointmentMonth = appointmentMonth.slice(0, 3);
            appointmentYear = (await BookScanScheduleScanPage.getPage(page).pickMonthButtonText.innerText()).trim().split(' ')[1];

            await expect(BookScanScheduleScanPage.getPage(page).continueButton).toBeEnabled();
            await BookScanScheduleScanPage.getPage(page).continueButton.click();

            await expect(BookScanScheduleScanPage.getPage(page).pickMonthButton).toBeHidden({ timeout: 120000 })

            await expect(ReserveAppointmentPage.getPage(page).reserveAppointmentHeader).toBeVisible();
            await expect(ReserveAppointmentPage.getPage(page).reserveAppointmentHeader).toHaveText(RESERVE_APPOINTMENT_PAGE.RESERVE_APPOINTMENT_HEADER);
            await expect(ReserveAppointmentPage.getPage(page).creditCardNumberInput).toBeEditable();
            await expect(ReserveAppointmentPage.getPage(page).creditCardExpiryInput).toBeEditable()
            await expect(ReserveAppointmentPage.getPage(page).creditCardCvvInput).toBeEditable()
            await expect(ReserveAppointmentPage.getPage(page).creditCardZipCodeInput).toBeEditable()
        });

        await test.step('appointment information is correct', async () => {

            await expect(ReserveAppointmentPage.getPage(page).pricingPlanText).toHaveText(RESERVE_APPOINTMENT_PAGE.PRICING_PLAN_MRI_SCAN_SPINE_TEXT);
            await expect(ReserveAppointmentPage.getPage(page).pricingCenterText).toHaveText(appointmentLocationName);
            await expect(ReserveAppointmentPage.getPage(page).pricingAddressText).toHaveText(appointmentLocationAddress);
            await expect(ReserveAppointmentPage.pricingDateTexts(page, 1)).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime1}`);
            await expect(ReserveAppointmentPage.pricingDateTexts(page, 2)).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime2}`);
            await expect(ReserveAppointmentPage.pricingDateTexts(page, 3)).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime3}`);
        });

        await test.step('can reserve the appointment', async () => {

            await ReserveAppointmentPage.getPage(page).creditCardNumberInput.click();
            await page.mouse.wheel(0, 400);
            await ReserveAppointmentPage.getPage(page).affirmPaymentCheckbox.click();
            await ReserveAppointmentPage.getPage(page).continueButton.click();

            await AffirmPaymentPage.getPage(page).mobilePhoneInput.fill('7209804840');
            await AffirmPaymentPage.getPage(page).continueButton.click();
            await AffirmPaymentPage.getPage(page).phonePinInput.fill('123456');
            await AffirmPaymentPage.planOptions(page, 3).click();
            await AffirmPaymentPage.getPage(page).chooseThisPlanButton.click();
            await AffirmPaymentPage.getPage(page).disclosureCheckbox.click();
            await AffirmPaymentPage.getPage(page).confirmButton.click();

            await expect(ReserveAppointmentPage.getPage(page).continueButton).toBeHidden();
            //await expect(ScanConfirmPage.getPage(page).appointmentConfirmationHeader).toBeHidden();
            await expect(ScanConfirmPage.getPage(page).appointmentConfirmationHeader).toHaveText(SCAN_CONFIRM_PAGE.APPOINTMENT_CONFIRMATION_MRI_SCAN_SPINE_HEADER);
            await expect(ScanConfirmPage.getPage(page).appointmentConfirmationCenterText).toHaveText(appointmentLocationName);
            await expect(ScanConfirmPage.getPage(page).appointmentConfirmationAddressText).toHaveText(appointmentLocationAddress);
            await expect(ScanConfirmPage.appointmentConfirmationDateTexts(page, 1)).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime1} EDT`);
            await expect(ScanConfirmPage.appointmentConfirmationDateTexts(page, 2)).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime2} EDT`);
            await expect(ScanConfirmPage.appointmentConfirmationDateTexts(page, 3)).toHaveText(`${appointmentMonth} ${appointmentDay}, ${appointmentYear} • ${appointmentTime3} EDT`);
        });

    });

    /*test('..', async ({ page }) => {

        await test.step('..', async () => {

        });

    });*/
});
import { BasePage } from '../common/base.page';
import { Page } from '@playwright/test';

export class SignInPage extends BasePage {
  
  private static instance: SignInPage;
  readonly usernameInput = this.page.locator('input[id="email"]');
  readonly passwordInput = this.page.locator('input[id="password"]');
  readonly submitButton = this.page.locator('button[class*="submit-btn"]');

  public static getPage(page: Page): SignInPage {
    if (!SignInPage.instance) {
      SignInPage.instance = new SignInPage(page);
    }
    return SignInPage.instance;
  }

  async signIn(user: string, password: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

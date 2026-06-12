# playwright-framework
This repo was created to demonstrate the usage of playwrighte test automation framework with Typescript.

## Setup
### System & Environment Requirements
- Node.js: latest 20.x, 22.x or 24.x.
- Package Manager: npm (comes with Node.js), yarn, or pnpm.
- Operating System: Windows, macOS, or Linux.
- IDE: A code editor like Visual Studio Code, which has an official Playwright Extension for running and debugging tests.

### Installing Playwright
```npm init playwright@latest```

Find more information at the official Playwright site, https://playwright.dev/docs/intro.

## Execution
### Running the Example Test
Running all tests

```npx playwright test```

Running all tests using Firefox

```npx playwright test --headed --project=firefox```

Running all Ezra/Function Health tests

```npx playwright test --headed --project=firefox /tests/ezra```

All specific configurations for test runs is found in the ```playwright.config.ts```.

## Design
### Page Object Model
All pages are found under the ```/pages``` folder.  In the ```/pages/common``` folder you will find ```base.page.ts``` where the ```page``` object is declared only once, in which all pages will extend this class and be able to use.

Each page class is equipped with ```getPage(page: Page)``` singleton function that will serve to call anything within this class without having to instantiate whithin the test class.  This will save lines of code and also ensure only one instantiation is created.

### Tests
The test file ```ezra.spec.ts``` will demonstrate two tests which are grouped within a test suite closure.  Each test is broken down into test steps to make them more organized and understandable.

```
- test.describe("Test Suite Description")

-- test("Test Description")
--- test.step("..")
--- test.step("Test Step Description")

-- test("..")
--- test.step("..")
--- test.step("..")
--- test.step("..")
```

### Setup
```test.beforeEach()``` runs before each test execution. For the ezra example it is used to login before each test.

### Teardown
```test.afterEach()``` runs after each test execution. For the ezra example it is used to close the browser.

### Test Data
The ```parameters.json``` file is used as an external data file to avoid and hard coded test values.  This allows to interchange these files depending on test execution needs and enviroments.

The ```/constants/content.ts``` holds static text within the application that could change in the future.

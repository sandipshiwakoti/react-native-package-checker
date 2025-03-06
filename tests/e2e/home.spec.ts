import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display search input and placeholder text', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search packages (e.g. react-native-reanimated)');

    await expect(searchInput).toBeVisible();
    await expect(page.getByText('Enter multiple packages separated by commas')).toBeVisible();
  });

  test('should search multiple packages', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search packages');
    await searchInput.fill('react-native-reanimated, react-native-gesture-handler');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/.*packages=react-native-reanimated,react-native-gesture-handler/);
  });

  test('should handle package.json upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/package.json');

    await expect(page).toHaveURL(
      /.*packages=react-native,react-native-reanimated,react-native-gesture-handler/
    );
    await expect(page).toHaveURL(/.*version=\^0.78.0/);
  });

  test('should handle invalid package.json upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/invalid.json');

    await expect(page.getByText('Please upload a valid package.json file')).toBeVisible();
  });
});

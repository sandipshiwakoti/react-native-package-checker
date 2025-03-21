import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search multiple packages', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search packages');
    await searchInput.fill('react-native-reanimated, react-native-gesture-handler');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/.*packages=react-native-reanimated,react-native-gesture-handler/);
  });

  test('should handle package.json upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const fixturePath = path.join(process.cwd(), 'tests/fixtures/package.json');
    const packageJson = JSON.parse(readFileSync(fixturePath, 'utf-8'));

    await fileInput.setInputFiles('tests/fixtures/package.json');
    const expectedPackages = [
      `react-native@${packageJson.dependencies['react-native'].replace(/[\^~]/g, '')}`,
      `react-native-reanimated@${packageJson.dependencies['react-native-reanimated'].replace(/[\^~]/g, '')}`,
      `react-native-gesture-handler@${packageJson.dependencies['react-native-gesture-handler'].replace(/[\^~]/g, '')}`,
    ].join(',');

    await expect(page).toHaveURL(new RegExp(`.*packages=${expectedPackages}`));
  });

  test('should handle invalid package.json upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/invalid.json');

    await expect(page.getByText('Please upload a valid package.json file')).toBeVisible();
  });
});

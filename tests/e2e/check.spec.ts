import { expect, test } from '@playwright/test';

test.describe('Check Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/check?packages=react-native-reanimated,react-native-gesture-handler,react-native-svg'
    );
  });

  test('should search for multiple packages via URL', async ({ page }) => {
    await expect(page.getByText('react-native-gesture-handler', { exact: true })).toBeVisible({
      timeout: 30000,
    });
    await expect(page.getByText('react-native-reanimated', { exact: true })).toBeVisible();
    await expect(page.getByText('react-native-svg', { exact: true })).toBeVisible();
  });

  test('should export analysis results as PDF', async ({ page }) => {
    await page.getByRole('button', { name: 'Export' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByText('Export all as PDF').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});

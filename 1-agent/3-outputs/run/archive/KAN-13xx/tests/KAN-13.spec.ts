import { test, expect } from '@playwright/test';

test.describe('KAN-13: Team Popularity Dashboard', () => {
  const url = 'https://futbolbuggy.geekqa.net/';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    // Wait for the synchronization to finish
    await page.waitForSelector('text=Gigantes', { timeout: 10000 });
  });

  test('TC-01: Dashboard Visibility and Summary', async ({ page }) => {
    // Check banner summary
    const summary = page.locator('div:has-text("Votos Totales")').last();
    await expect(summary).toBeVisible();
    
    // Check if team cards are loaded
    const teamCards = page.locator('h3');
    await expect(teamCards.first()).toBeVisible();
  });

  test('TC-02: Data Visualization for Team Cards', async ({ page }) => {
    const firstCard = page.locator('div[cursor="pointer"]').first();
    await expect(firstCard.locator('img').first()).toBeVisible(); // Crest
    await expect(firstCard.locator('h3')).not.toBeEmpty(); // Team Name
    await expect(firstCard.locator('text=Votos')).toBeVisible(); // Vote label
  });

  test('TC-03: Hierarchical Sorting Order (Initial)', async ({ page }) => {
    const voteCounts = await page.locator('p:near(p:text("Votos"))').allInnerTexts();
    const numbers = voteCounts.map(v => parseInt(v.trim())).filter(n => !isNaN(n));
    
    // Check if sorted descending
    for (let i = 0; i < numbers.length - 1; i++) {
      expect(numbers[i]).toBeGreaterThanOrEqual(numbers[i+1]);
    }
  });

  test('TC-04: Real-Time Vote Update (Expected Failure due to DB Error)', async ({ page }) => {
    const firstTeamName = await page.locator('h3').first().innerText();
    const initialVoteText = await page.locator('p:near(p:text("Votos"))').first().innerText();
    const initialVotes = parseInt(initialVoteText.trim());

    // Click on the first team
    await page.locator('div[cursor="pointer"]').first().click();

    // Fill the voting form
    await page.getByRole('textbox', { name: 'Ej: Juan Pérez' }).fill('QA Test Agent');
    await page.getByRole('textbox', { name: 'Ej: México' }).fill('Testland');
    
    // Click 5th star
    await page.locator('button:has-text("")').nth(4).click();
    
    await page.getByRole('textbox', { name: '¡Vamos equipo!' }).fill('Automated test vote');

    // Click Publish
    await page.getByRole('button', { name: 'Publicar Voto' }).click();

    // Check for success message or update
    // Note: We know this fails with "Error al enviar el comentario"
    const dialog = await page.waitForEvent('dialog', { timeout: 5000 }).catch(() => null);
    if (dialog) {
      const message = dialog.message();
      await dialog.dismiss();
      expect(message).not.toContain('Error');
    }

    // Go back and check counter
    await page.getByRole('button', { name: 'Volver' }).click();
    const newVoteText = await page.locator('p:near(p:text("Votos"))').first().innerText();
    const newVotes = parseInt(newVoteText.trim());
    
    expect(newVotes).toBe(initialVotes + 1);
  });

  test('TC-05: Responsive Design Check', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const summary = page.locator('div:has-text("Votos Totales")').last();
    await expect(summary).toBeInViewport();
    
    const firstCard = page.locator('div[cursor="pointer"]').first();
    await expect(firstCard).toBeInViewport();
  });
});

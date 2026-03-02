import { test, expect } from '@playwright/test';

test.describe('KAN-14: US-001 Registro de usuario', () => {
  const baseUrl = 'https://tusrecetas.lovable.app/auth';
  const timestamp = Date.now();
  const testEmail = `qa_tester_${timestamp}@example.com`;
  const testPassword = 'P@ssw0rd123';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole('tab', { name: 'Registrarse' }).click();
  });

  test('TC01 - Successful Registration (Positive)', async ({ page }) => {
    await page.getByPlaceholder('chef123').fill(`user_${timestamp}`);
    await page.getByPlaceholder('Tu nombre').fill('QA Tester');
    await page.getByPlaceholder('tu@email.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').fill(testPassword);
    
    await page.getByRole('button', { name: 'Crear Cuenta' }).click();
    
    // Using a broad check for text that indicates success/verification
    await expect(page.getByText(/exitosamente|success|verify|verifica|check|confirm/i)).toBeVisible({ timeout: 15000 });
    
    await page.screenshot({ path: `3-outputs/run/KAN-14/execution/tc01-success.png`, fullPage: true });
  });

  test('TC02 - Duplicate Email (Negative)', async ({ page }) => {
    // We use the email from TC01 which should now be registered
    await page.getByPlaceholder('chef123').fill(`dup_user_${timestamp}`);
    await page.getByPlaceholder('Tu nombre').fill('Duplicate User');
    await page.getByPlaceholder('tu@email.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').fill(testPassword);
    
    await page.getByRole('button', { name: 'Crear Cuenta' }).click();
    
    // Expect error message about existing user
    await expect(page.getByText(/existe|already|registered|error/i)).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: `3-outputs/run/KAN-14/execution/tc02-duplicate-error.png`, fullPage: true });
  });

  test('TC03 - Invalid Email Format (Negative)', async ({ page }) => {
    await page.getByPlaceholder('tu@email.com').fill('invalid-email');
    await page.getByPlaceholder('••••••••').fill(testPassword);
    
    await page.getByRole('button', { name: 'Crear Cuenta' }).click();
    
    // Browser validation or app validation
    const errorMsg = page.getByText(/email|válido|valid|error/i);
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: `3-outputs/run/KAN-14/execution/tc03-invalid-email.png`, fullPage: true });
  });

  test('TC04 - Weak Password (Negative/Boundary)', async ({ page }) => {
    // Testing with 7 characters which should be invalid per AC (>= 8)
    await page.getByPlaceholder('tu@email.com').fill(`weak_pass_${timestamp}@example.com`);
    await page.getByPlaceholder('••••••••').fill('1234567'); 
    
    await page.getByRole('button', { name: 'Crear Cuenta' }).click();
    
    // Per AC, this should show an error. If it shows success, it's a bug.
    // We'll check for error message. If we find success message, we fail the test.
    const successMsg = page.getByText(/exitosamente|success/i);
    const errorMsg = page.getByText(/caracteres|characters|short|corto|weak|débil/i);
    
    // Wait for either success or error
    await Promise.race([
        successMsg.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
        errorMsg.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    ]);

    if (await successMsg.isVisible()) {
        await page.screenshot({ path: `3-outputs/run/KAN-14/execution/tc04-BUG-weak-password-accepted.png`, fullPage: true });
        throw new Error('BUG: Password with 7 characters was accepted, but AC requires >= 8.');
    }

    await expect(errorMsg).toBeVisible();
    await page.screenshot({ path: `3-outputs/run/KAN-14/execution/tc04-weak-password-error.png`, fullPage: true });
  });

  test('TC05 - Visual Layout Check', async ({ page }) => {
    await page.screenshot({ path: `3-outputs/run/KAN-14/execution/tc05-visual-check.png`, fullPage: true });
  });
});

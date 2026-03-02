import { test, expect } from '@playwright/test';

test.describe('US-001 Registro de usuario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://tusrecetas.lovable.app/');
    // Navigate to register page if not on home. 
    // Trying to find a link or button to Register.
    const registerBtn = page.getByRole('link', { name: /registrarse|crear cuenta|sign up/i })
        .or(page.getByRole('button', { name: /registrarse|crear cuenta|sign up/i }));
    
    if (await registerBtn.isVisible()) {
        await registerBtn.click();
    } else {
        // Maybe we are already on a login/landing page that has a switch?
        // Check if there is a 'Don't have an account?' link
        const switchLink = page.getByText(/no tienes cuenta|regístrate/i);
        if (await switchLink.isVisible()) {
            await switchLink.click();
        }
    }
  });

  test('TC-01: Successful Registration', async ({ page }) => {
    const email = `testuser${Date.now()}@example.com`;
    const password = 'Password123!';

    // Form interactions
    await page.getByLabel(/email|correo/i).fill(email);
    await page.getByLabel(/contraseña|password/i).fill(password);
    
    // Submit
    const submitBtn = page.getByRole('button', { name: /registrarse|crear cuenta|sign up/i });
    await submitBtn.click();
    
    // Verification
    // Expecting a success message or a verification instruction
    await expect(page.getByText(/verifi|enviado|confirm|success/i)).toBeVisible({ timeout: 10000 });
  });

  test('TC-02: Registration - Password too short', async ({ page }) => {
    await page.getByLabel(/email|correo/i).fill(`test${Date.now()}@example.com`);
    await page.getByLabel(/contraseña|password/i).fill('123');
    
    await page.getByRole('button', { name: /registrarse|crear cuenta/i }).click();
    
    // Expect error
    await expect(page.getByText(/caracteres|mínimo|short|weak/i)).toBeVisible();
  });

  test('TC-03: Registration - Invalid Email', async ({ page }) => {
    await page.getByLabel(/email|correo/i).fill('invalid-email');
    await page.getByLabel(/contraseña|password/i).fill('Password123!');
    
    await page.getByRole('button', { name: /registrarse|crear cuenta/i }).click();
    
    // Expect error
    await expect(page.getByText(/inválido|invalid|formato/i)).toBeVisible();
  });
});

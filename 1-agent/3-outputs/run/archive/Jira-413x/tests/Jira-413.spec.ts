import { test, expect } from '@playwright/test';

test.describe('Jira-413: New Employee Registration', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://testing1.geekqa.net/');
    });

    test('TC01: Successful Employee Registration (Positive Case)', async ({ page }) => {
        const name = 'John Doe';
        await page.getByLabel('Nombre Completo:').fill(name);
        await page.getByLabel('Edad:').fill('30');
        await page.getByLabel('Fecha de Nacimiento:').fill('1994-01-01');
        await page.getByLabel('Masculino').check();
        await page.getByLabel('Dirección:').fill('123 Main St');
        await page.getByLabel('Correo Electrónico:').fill('john.doe@example.com');
        await page.getByLabel('Número de Teléfono:').fill('1234567890');
        await page.getByLabel('Cargo:').fill('Developer');
        await page.getByLabel('Departamento:').selectOption('Logística');
        await page.getByLabel('Estado del Contrato:').check(); // Active
        await page.getByLabel('Horario de Trabajo:').fill('Full-time');
        await page.getByLabel('URL de Perfil Profesional:').fill('https://example.com/john');
        await page.getByLabel('Salario Esperado:').fill('50000');
        
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        // Wait for and verify success message
        const successMessage = page.locator('text=Empleado registrado exitosamente!');
        await expect(successMessage).toBeVisible();
        
        // Verify in table
        const table = page.locator('table');
        await expect(table).toContainText(name);
        await expect(table).toContainText('30');
        await expect(table).toContainText('john.doe@example.com');
    });

    test('TC02: Validation - Minimum Name Length (Negative Case)', async ({ page }) => {
        await page.getByLabel('Nombre Completo:').fill('Jo');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        const error = page.locator('text=El nombre debe tener al menos 3 caracteres');
        await expect(error).toBeVisible();
        const successMessage = page.locator('text=Empleado registrado exitosamente!');
        await expect(successMessage).not.toBeVisible();
    });

    test('TC03: Validation - Age Out of Range - Too Young (Negative Case)', async ({ page }) => {
        await page.getByLabel('Edad:').fill('17');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        const error = page.locator('text=La edad debe estar entre 18 y 65 años');
        await expect(error).toBeVisible();
        const successMessage = page.locator('text=Empleado registrado exitosamente!');
        await expect(successMessage).not.toBeVisible();
    });

    test('TC04: Validation - Age Out of Range - Too Old (Negative Case)', async ({ page }) => {
        await page.getByLabel('Edad:').fill('66');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        const error = page.locator('text=La edad debe estar entre 18 y 65 años');
        await expect(error).toBeVisible();
        const successMessage = page.locator('text=Empleado registrado exitosamente!');
        await expect(successMessage).not.toBeVisible();
    });

    test('TC05: Validation - Invalid Email Format (Negative Case)', async ({ page }) => {
        await page.getByLabel('Correo Electrónico:').fill('invalid-email');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        const error = page.locator('text=Correo electrónico no válido');
        await expect(error).toBeVisible();
        const successMessage = page.locator('text=Empleado registrado exitosamente!');
        await expect(successMessage).not.toBeVisible();
    });

    test('TC06: Validation - Mandatory Fields (Negative Case)', async ({ page }) => {
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        const errorCount = await page.locator('.error-message').count();
        expect(errorCount).toBeGreaterThan(0);
        const successMessage = page.locator('text=Empleado registrado exitosamente!');
        await expect(successMessage).not.toBeVisible();
    });
});

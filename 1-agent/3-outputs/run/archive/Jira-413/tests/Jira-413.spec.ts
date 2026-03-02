import { test, expect } from '@playwright/test';

test.describe('Jira-413: New Employee Registration', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://testing1.geekqa.net/');
    });

    test('TC-01: Successful employee registration with all valid fields', async ({ page }) => {
        await page.getByLabel('Nombre Completo:').fill('John Doe');
        await page.getByLabel('Edad:').fill('30');
        await page.getByLabel('Fecha de Nacimiento:').fill('1994-01-01');
        await page.getByLabel('Masculino').check();
        await page.getByLabel('Dirección:').fill('123 Main St, Anytown');
        await page.getByLabel('Correo Electrónico:').fill('john.doe@example.com');
        await page.getByLabel('Número de Teléfono:').fill('5551234567');
        await page.getByLabel('Cargo:').fill('QA Lead');
        await page.getByLabel('Departamento:').selectOption('Ventas');
        await page.getByLabel('Estado del Contrato:').check();
        await page.getByLabel('Horario de Trabajo:').fill('Full-time');
        await page.getByLabel('URL de Perfil Profesional:').fill('https://example.com/jdoe');
        await page.getByLabel('Salario Esperado:').fill('60000');
        
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        await expect(page.getByText('Empleado registrado exitosamente!')).toBeVisible();
        
        // Verify in table
        const row = page.locator('table tr').filter({ hasText: 'John Doe' });
        await expect(row).toBeVisible();
        await expect(row).toContainText('30');
        await expect(row).toContainText('QA Lead');
    });

    test('TC-02: Name validation error (too short)', async ({ page }) => {
        await page.getByLabel('Nombre Completo:').fill('Jo');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        await expect(page.getByText('El nombre debe tener al menos 3 caracteres')).toBeVisible();
    });

    test('TC-03: Age validation error (under 18)', async ({ page }) => {
        await page.getByLabel('Edad:').fill('17');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        await expect(page.getByText('La edad debe estar entre 18 y 65 años')).toBeVisible();
    });

    test('TC-04: Age validation error (over 65)', async ({ page }) => {
        await page.getByLabel('Edad:').fill('66');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        await expect(page.getByText('La edad debe estar entre 18 y 65 años')).toBeVisible();
    });

    test('TC-05: Email validation error (invalid format)', async ({ page }) => {
        await page.getByLabel('Correo Electrónico:').fill('john.doe@invalid');
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        await expect(page.getByText('Correo electrónico inválido')).toBeVisible();
    });

    test('TC-06: Empty mandatory fields', async ({ page }) => {
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        await expect(page.getByText('El nombre debe tener al menos 3 caracteres')).toBeVisible();
        await expect(page.getByText('La edad debe estar entre 18 y 65 años')).toBeVisible();
        await expect(page.getByText('La fecha de nacimiento es obligatoria')).toBeVisible();
        await expect(page.getByText('Seleccione un género')).toBeVisible();
    });

    test('TC-07: Table visualization verification', async ({ page }) => {
        const name = 'Alice Smith';
        await page.getByLabel('Nombre Completo:').fill(name);
        await page.getByLabel('Edad:').fill('28');
        await page.getByLabel('Fecha de Nacimiento:').fill('1996-05-15');
        await page.getByLabel('Femenino').check();
        await page.getByLabel('Dirección:').fill('456 Elm St, Othertown');
        await page.getByLabel('Correo Electrónico:').fill('alice@example.com');
        await page.getByLabel('Número de Teléfono:').fill('9876543210');
        await page.getByLabel('Cargo:').fill('Developer');
        await page.getByLabel('Departamento:').selectOption('Logística');
        await page.getByLabel('Salario Esperado:').fill('70000');
        
        await page.getByRole('button', { name: 'Registrar Empleado' }).click();
        
        const row = page.locator('table tr').filter({ hasText: name });
        await expect(row).toBeVisible();
        await expect(row).toContainText('28');
        await expect(row).toContainText('Logística');
    });
});

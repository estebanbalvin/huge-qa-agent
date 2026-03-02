# Bug Report: Jira-413 (New Employee Registration)

**Report Date:** 2026-03-01  
**Total Bugs Found:** 2  
**Critical:** 1 | **High:** 1 | **Medium:** 0 | **Low:** 0

---

## BUG-Jira-413-01: Salary field incorrectly displays 0 in the results table

**Severity:** CRITICAL  
**Category:** Functional Defect  
**Status:** NEW

### Description
The 'Salario' column in the registered employees table always displays 0, even when a valid non-zero value is entered in the registration form.

### Reproduction Steps
1. Navigate to https://testing1.geekqa.net/
2. Fill out the registration form with valid data.
3. Enter `60000` in the "Salario Esperado" field.
4. Click "Registrar Empleado".
5. Observe the last row in the "Empleados Registrados" table.

### Expected Behavior
The 'Salario' column should correctly display the value entered in the form (e.g., 60000).

### Actual Behavior
The 'Salario' column displays `0`.

### Evidence
- [Screenshot: BUG-Jira-413-01-salary-zero.png](evidence/BUG-Jira-413-01-salary-zero.png)

---

## BUG-Jira-413-02: Age validation fails for lower bound (under 18)

**Severity:** HIGH  
**Category:** Functional Defect  
**Status:** NEW

### Description
The system fails to display a validation error message when the entered age is 17, which is below the mandatory minimum of 18 years.

### Reproduction Steps
1. Navigate to https://testing1.geekqa.net/
2. Enter `17` in the "Edad" field.
3. Click "Registrar Empleado".

### Expected Behavior
The error message "La edad debe estar entre 18 y 65 años" should be displayed under the Age field.

### Actual Behavior
No error message is shown for age 17. Note: The message *is* correctly shown for age 66.

### Evidence
- [Screenshot: BUG-Jira-413-02-age-validation.png](evidence/BUG-Jira-413-02-age-validation.png)

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 1     |
| Medium   | 0     |
| Low      | 0     |

**Action Items:**
- [ ] Investigate data mapping for the Salary field in the registration form to table integration.
- [ ] Review Age validation logic to ensure lower bound (>=18) is strictly enforced.

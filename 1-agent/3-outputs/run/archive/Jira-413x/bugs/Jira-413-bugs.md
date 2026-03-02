# Bug Report: Jira-413 (Employee Registration)

**Report Date:** 2026-03-01  
**Total Bugs Found:** 6  
**Critical:** 2 | **High:** 2 | **Medium:** 1 | **Low:** 1

---

## BUG-Jira-413-001: Salary field data integrity issue

**Severity:** CRITICAL  
**Category:** Functional Defect  
**Status:** NEW

### Description
The 'Salario' column in the results table always displays '0' regardless of the value entered in the registration form.

### Reproduction Steps
1. Fill all mandatory fields with valid data.
2. Enter `50000` in the 'Salario Esperado' field.
3. Click 'Registrar Empleado'.
4. Observe the 'Salario' column in the 'Empleados Registrados' table.

### Expected Behavior
The table should display the entered value (e.g., '50000').

### Actual Behavior
The table displays '0'.

### Evidence
- [TC01 Evidence](evidence/tc01-success.png)

---

## BUG-Jira-413-002: Age validation bypass (Under 18)

**Severity:** CRITICAL  
**Category:** Functional Defect  
**Status:** NEW

### Description
The system allows registration of employees with an age under 18, violating the business rule (18-65).

### Reproduction Steps
1. Enter `17` in the 'Edad' field.
2. Fill other mandatory fields correctly.
3. Click 'Registrar Empleado'.

### Expected Behavior
System should show an error message and prevent registration.

### Actual Behavior
System shows success message and adds the employee to the table.

### Evidence
- [TC03 Evidence](evidence/tc03-age-failure.png)

---

## BUG-Jira-413-004: Email validation bypass

**Severity:** HIGH  
**Category:** Functional Defect  
**Status:** NEW

### Description
The system accepts invalid email formats without showing an error or blocking registration.

### Reproduction Steps
1. Enter `invalid-email` in the 'Correo Electrónico' field.
2. Click 'Registrar Empleado'.

### Expected Behavior
Validation error message should appear.

### Actual Behavior
System confirms successful registration.

---

## BUG-Jira-413-005: Table horizontal overflow on mobile

**Severity:** HIGH  
**Category:** Accessibility issue  
**Status:** NEW

### Description
The results table is not responsive and causes extreme horizontal overflow on mobile devices.

### Evidence
- Table width: 1023px
- Viewport width: 375px

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2     |
| High     | 2     |
| Medium   | 1     |
| Low      | 1     |

**Action Items:**
- [ ] Fix data binding for Salary field.
- [ ] Implement robust server-side and client-side validation for Age and Email.
- [ ] Refactor the results table for responsive design.

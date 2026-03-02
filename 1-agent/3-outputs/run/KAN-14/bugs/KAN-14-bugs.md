# Bug Report: KAN-14 (Registro de usuario)

**Report Date:** 2026-03-02  
**Total Bugs Found:** 1  
**Critical:** 0 | **High:** 1 | **Medium:** 0 | **Low:** 0

---

## BUG-KAN-14-01: Password length validation bypass

**Severity:** HIGH  
**Category:** Security / Functional Defect  
**Status:** NEW

### Description
The system allows users to register with passwords of only 7 characters, violating the requirement of minimum 8 characters.

### Reproduction Steps
1. Navigate to https://tusrecetas.lovable.app/auth
2. Click on 'Registrarse' tab.
3. Fill valid username, full name, and email.
4. Fill password with 7 characters (e.g. '1234567').
5. Click 'Crear Cuenta' button.

### Expected Behavior
A clear error message should be displayed indicating that the password is too short (minimum 8 characters).

### Actual Behavior
The account is created successfully, and the user is redirected to the dashboard/home page.

### Evidence
- [Bug Screenshot](evidence/BUG-KAN-14-01-weak-password.png)

### Environment
- **Browser:** Chromium
- **OS:** Windows 10

### Reproduced By Test Case
- `TC04 - Weak Password (Negative/Boundary)`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 1     |
| Medium   | 0     |
| Low      | 0     |

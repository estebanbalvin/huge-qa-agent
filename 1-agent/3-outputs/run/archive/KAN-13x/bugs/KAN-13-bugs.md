# Bug Report: KAN-13 (Team Popularity Dashboard)

**Report Date:** 2026-03-01  
**Total Bugs Found:** 4  
**Critical:** 1 | **High:** 1 | **Medium:** 0 | **Low:** 2

---

## BUG-KAN-13-001: Database Connection Error on Vote Submission

**Severity:** CRITICAL  
**Category:** Functional Defect  
**Status:** NEW

### Description
A database connection error occurs when attempting to publish a vote/comment, preventing the core feature of the dashboard (voting) from working.

### Reproduction Steps
1. Navigate to https://futbolbuggy.geekqa.net/
2. Click on a team (e.g., Real Madrid).
3. Fill the '¡Deja tu mensaje!' form (Name, Country, Rating, Message).
4. Click 'Publicar Voto'.

### Expected Behavior
The vote should be recorded and the UI should reflect the change immediately.

### Actual Behavior
An alert dialog appears: "Error al enviar el comentario. Revisa la conexión con la base de datos."

### Evidence
- [Vote Form Before Error](evidence/tc04-vote-form.png)

---

## BUG-KAN-13-002: Real-Time Update Failure - UI Counter Not Incrementing

**Severity:** HIGH  
**Category:** Functional Defect  
**Status:** NEW

### Description
The "Votar por este club" button at the top of the team details page does not provide visual feedback or increment the dashboard vote counter.

### Reproduction Steps
1. Navigate to a team details page.
2. Click the 'Votar por este club' button.
3. Observe the total vote counter.

### Expected Behavior
The counter should increment immediately without a full page reload.

### Actual Behavior
No change in the UI; counter remains at 0.

---

## BUG-KAN-13-003: WCAG - Missing Accessible Names for Interactive Elements

**Severity:** LOW  
**Category:** Accessibility issue  
**Status:** NEW

### Description
Pagination controls and filter selects lack discernible text or labels, making them unusable for screen reader users.

### Evidence
- [Detailed Accessibility Report](../accessibility/KAN-13-report.md)

---

## BUG-KAN-13-004: UI - Text Clipping in Filters on Mobile Viewports

**Severity:** LOW  
**Category:** UI defect  
**Status:** NEW

### Description
The filter buttons for "Todas Ligas" and "Todos Países" truncate their text on mobile viewports (375px), appearing as "Todas Lig" and "Todos Paí".

### Evidence
- [Mobile View Screenshot](evidence/tc06-responsive-375.png)

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 1     |
| Medium   | 0     |
| Low      | 2     |

**Action Items:**
- [ ] Investigate Backend/DB connection for voting API.
- [ ] Fix real-time state management for vote counters.
- [ ] Improve ARIA labels and HTML structure for accessibility.
- [ ] Refactor filter buttons to handle smaller viewports gracefully.

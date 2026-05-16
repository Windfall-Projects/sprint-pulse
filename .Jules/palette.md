## 2026-05-16 - [Accessible Icon-Only Delete Buttons]
**Learning:** Found a recurring pattern in the dashboard components (`ProjectsList`, `TeamsList`, `KudosBoard`) where icon-only delete buttons relied solely on the `title` attribute without proper `aria-label` for screen readers and lacked distinct `focus-visible` styling for keyboard navigation.
**Action:** Always ensure icon-only buttons have explicit `aria-label` attributes and clear `focus-visible` rings so they are perceivable and operable by keyboard users.

# Verification

Run `npm test` for 18 mathematical/data-validation checks. Run `npm run test:browser` with the Vite server on port 5173 for real Chromium interactions. Install the browser using `npx playwright install chromium`, or use system Chromium / `CHROMIUM_PATH`.

Verified in Chromium:

- All six lesson routes and animation steps; timed playback, pause, replay, speed, previous/next, and fullscreen.
- Individual clickable cell explanations and the toy Before/After slider.
- Lesson quiz feedback and persisted progress after reload.
- All ten final quiz questions, including keyboard-friendly transformation ordering, and a 10/10 result.
- Initial partial dependencies rejected, 2NF accepted, transitive dependencies rejected, and 3NF accepted.
- Manual splitting into Students / Courses / Enrollments and then Departments, with user-created Foreign Key connections.
- Editing, adding/deleting rows, unknown dependency feedback, and changed reconstruction rejected.
- Search, empty and reset states, dark/light mode, comparison switching, summary download, and print styles.
- Responsive widths 320, 390, 768, 1024, and 1440 with no page overflow; tables scroll independently.
- No uncaught browser errors during the interaction checks.

The unit checks prove lossless joins using the functional dependencies and independently reconstruct all original enrollment records. Normalization is evaluated from the supplied dependencies rather than guessing from duplicate counts.

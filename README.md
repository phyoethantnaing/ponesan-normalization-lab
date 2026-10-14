# ပုံစံ · Normalization Lab

A locally running, account-free Database Normalization learning app. React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide. Explanations use Myanmar Unicode; Noto Sans Myanmar and DM Sans are bundled locally.

## Website hosting

This repository contains the complete app and its GitHub Pages deployment workflow. Every push to `main` runs the normalization tests, builds the website, and publishes it. No custom API keys or deployment secrets are required.

In **Settings → Pages**, select **GitHub Actions** as the build source. GitHub Pages must be available for the repository's visibility and account plan. Find the deployed website URL on that settings page or in the `github-pages` deployment environment. The workflow supplies GitHub Pages' base path so JavaScript, CSS, and locally bundled Myanmar fonts work under a project URL.

Tests and the build also run before Pages is enabled. If hosting is not configured yet, the workflow uploads the built website and explains the missing setting in its run summary. After enabling Pages, run **Test, build, and deploy website** from the Actions tab, or push another commit, to publish.

For another static hosting service, use build command `npm run build` and output directory `dist`. Set `VITE_BASE_PATH` only when hosting under a subdirectory; the default is `/`.

GitHub မှာ source code ပြင်ပြီး `main` branch ကို တင်လိုက်ရင် website ပါ အလိုအလျောက် update ဖြစ်မယ်။ ကိုယ်တိုင် server ထောင်စရာ မလိုပါ။

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

```bash
npm run build
npm test
npm run preview
```

Browser checks (start `npm run dev -- --port 5173` in another terminal):

```bash
npx playwright install chromium
npm run test:browser
```

The checks also support a system Chromium installation, or a `CHROMIUM_PATH` environment variable. They cover lesson navigation, controls, fullscreen, quiz feedback, all ten final questions, manual 2NF/3NF splitting and Foreign Key connections, persistence, dark mode, glossary search, and widths from 320px to 1440px.

## Features

- Eight navigable chapters, animated toy-box comparison, shared-layout animated cell movements, row/column highlights, clickable cells, and relationship exploration.
- Play, pause, replay, previous/next animation steps, four speeds, and an accessible fullscreen dialog.
- Lesson quizzes and a ten-question final quiz, including cell identification, composite keys, Foreign Key matching, and keyboard-friendly step ordering.
- Editable playground with row/column changes, key selection, manual table splitting, connections, worked examples, and actual FD validation.
- Comparison view, searchable glossary, downloadable Myanmar Markdown summary, print layout, light/dark themes, reduced motion support, and local progress storage.

## Educational model

One student can enroll in each course once. `(StudentID, CourseID)` is the enrollment key. Declared functional dependencies:

```
StudentID -> StudentName, DepartmentID
DepartmentID -> DepartmentName
CourseID -> CourseName
(StudentID, CourseID) -> Grade
```

1NF is checked against this exercise's atomic domains and explicit row keys. The checker computes attribute closure, all minimal candidate keys, projected dependencies, partial dependencies, and the formal 3NF condition. It checks observed values against FDs, validates Foreign Keys, uses a tableau chase for losslessness, checks FD preservation, and reconstructs source data through natural joins. Unknown columns require extra dependency information and are reported as indeterminate. The checker supports up to ten columns per table and limits joined data to 2,000 rows. It is a learning tool for these declared domains, not a general-purpose normalization oracle.

Adding or changing data before the first split establishes the source snapshot. Editing after splitting must preserve that snapshot to pass the reconstruction check. Reset restores the exercise. Empty tables produce an explicit insufficient-data message.

Progress and theme are stored only in this browser's localStorage. No backend or account is needed. Routes use URL hashes and can be bookmarked.

## Structure

`src/components/` reusable tables, navigation, controls, quizzes, and diagrams; `src/lessons/` synchronized lesson player; `src/data/` accurate sample data and lesson/quiz content; `src/playground/` editor and tested FD/normal-form validation.

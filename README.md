# Country Quiz

A quiz app where you answer questions about countries. Pick a question, choose your answer, move through the quiz, and see your score at the end.

![Quiz screen](screenshots/quiz.png)

![Results screen](screenshots/results.png)

*Add screenshots to the screenshots folder when you have them.*

## Summary

This is a front-end only app built with React and TypeScript. You answer multiple choice questions about countries (capitals, currencies, and so on), move between questions, and finish with a results page that shows your score. The questions come from stub data in the repo, so there is no backend or API. No env vars or API keys are required to run it locally.

## Libraries

**UI and components.** React 19 powers the UI. I use [react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html) for accessible controls, like the `Radio` component in the answer buttons. [classnames](https://github.com/JedWatson/classnames) handles conditional CSS classes.

**Routing.** [react-router-dom](https://reactrouter.com/) handles routes for the quiz (`/quiz`), results (`/results`), and a redirect from `/` to the quiz. The results page is wrapped in a protected route so you only see it after completing the quiz.

**State.** [Zustand](https://github.com/pmndrs/zustand) manages quiz state: questions, current question, answers, score, and completion. The store uses devtools in development for debugging.

**Testing.** [Vitest](https://vitest.dev/) runs the tests. [Testing Library](https://testing-library.com/react) (React, user-event, jest-dom) handles component and integration tests, and [jsdom](https://github.com/jsdom/jsdom) provides the DOM. [axe-core](https://github.com/dequelabs/axe-core) runs accessibility checks in tests. There is a custom `renderWithRouter` helper and an `expectNoA11yViolations` helper for a11y assertions.

**Styling.** Less and CSS. Shared variables live in `src/styles/variables.less`, and each component has its own `.less` and `.css` files.

**Build and tooling.** Vite for dev and production builds, TypeScript for types, and ESLint for linting.

## Running locally

You need Node 18 or newer.

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

Other commands:

- `npm run build` - Production build
- `npm run preview` - Serve the production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage

## GitHub Pages deployment

The app is deployed to GitHub Pages. The build copies `index.html` to `dist/404.html` so that when users open or reload a client-side route (e.g. `/CountryQuiz/quiz`), GitHub Pages serves the SPA instead of a 404. Without this, only the root URL would work after a full reload.

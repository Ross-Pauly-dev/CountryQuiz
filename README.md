# Country Quiz

A quiz app where you answer questions about countries. Pick a question, choose your answer, move through the quiz, and see your score at the end.

![Quiz screen](screenshots/quiz.png)

![Results screen](screenshots/results.png)

*Add screenshots to the screenshots folder when you have them.*

## Summary

This is a React + TypeScript app. You answer multiple choice questions about countries (capitals, currencies, continents, population, flags), move between questions, and finish with a results page that shows your score. You can run it in two ways: **front-end only** with stub data (no backend), or **with a local Node server** that fetches real country data from the [REST Countries API](https://restcountries.com/) and generates questions. Running both the frontend and the backend is the typical setup for local development.

## Libraries

**UI and components.** React 19 powers the UI. I use [react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html) for accessible controls, like the `Radio` component in the answer buttons. [classnames](https://github.com/JedWatson/classnames) handles conditional CSS classes.

**Routing.** [react-router-dom](https://reactrouter.com/) handles routes for the quiz (`/quiz`), results (`/results`), and a redirect from `/` to the quiz. The results page is wrapped in a protected route so you only see it after completing the quiz.

**Data fetching.** [TanStack Query](https://tanstack.com/query/latest) fetches quiz questions from the Node server, with loading and error handling. The rest of the quiz state (current question, answers, score) still lives in Zustand.

**State.** [Zustand](https://github.com/pmndrs/zustand) manages quiz state: questions, current question, answers, score, and completion. The store uses devtools in development for debugging.

**Testing.** [Vitest](https://vitest.dev/) runs the tests. [Testing Library](https://testing-library.com/react) (React, user-event, jest-dom) handles component and integration tests, and [jsdom](https://github.com/jsdom/jsdom) provides the DOM. [axe-core](https://github.com/dequelabs/axe-core) runs accessibility checks in tests. There is a custom `renderWithRouter` helper and an `expectNoA11yViolations` helper for a11y assertions.

**Styling.** Less and CSS. Shared variables live in `src/styles/variables.less`, and each component has its own `.less` and `.css` files.

**Build and tooling.** Vite for dev and production builds, TypeScript for types, and ESLint for linting.

## Running locally

You need Node 18 or newer.

Install dependencies (root and server):

```bash
npm install
cd server && npm install
```

To run both the frontend and the backend in one terminal:

```bash
npm run dev:all
```

Open the URL shown in the terminal (usually http://localhost:5173). The server runs on http://localhost:3001 by default. You only need to install server dependencies once; after that, `npm run dev:all` is enough.

**Frontend only.** `npm run dev` starts just the Vite app. Without the backend, the app will show an error when loading questions (it fetches from the API; there is no stub fallback).

**Running front and backend separately.** In one terminal run `npm run dev`, and in a second terminal run `npm run dev:server` (from the repo root) or `cd server && npm run dev`. The frontend expects the backend at http://localhost:3001 unless you set `VITE_API_URL` (e.g. in a `.env` file). Optional env vars for the server: `PORT` (default 3001), `CORS_ORIGIN` (default http://localhost:5173), `REST_COUNTRIES_BASE_URL` (default https://restcountries.com).

Other commands:

- `npm run dev:all` - Run frontend and backend together
- `npm run dev:server` - Run only the backend (from repo root)
- `npm run build` - Production build
- `npm run preview` - Serve the production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage

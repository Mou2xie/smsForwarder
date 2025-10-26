# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Expo Router entry point; screens and layouts follow file-based routing (e.g., `app/(tabs)/home.tsx` mounts a tab view).
- `components/`: Reusable UI elements. Keep them stateless where possible and co-locate styles.
- `hooks/`: Shared stateful logic and data-fetch helpers.
- `constants/`: App-wide configuration (colors, copy, limits). Update alongside related components.
- `assets/`: Images, fonts, and other static files referenced via Expo asset module.
- `scripts/`: Maintenance utilities such as `reset-project`. Place additional tooling here.

## Build, Test, and Development Commands
- `npm install`: Sync dependencies after cloning or updating `package.json`.
- `npm start`: Launch Expo CLI; choose device or simulator from the prompt.
- `npm run android` / `npm run ios` / `npm run web`: Start the bundler and open the respective platform target directly.
- `npm run reset-project`: Restore a clean starter layout; run only when intentionally wiping local changes.
- `npm run lint`: Execute ESLint with the Expo preset to catch style and safety issues.

## Coding Style & Naming Conventions
- TypeScript-first codebase; prefer `.tsx` React function components with hooks.
- Follow ESLint (`eslint-config-expo`) defaults: 2-space indentation, semicolons, and single quotes where practical.
- Use PascalCase for components/hooks, camelCase for functions and variables, kebab-case for filenames inside `app/` routes to match URL segments.
- Co-locate styles via `StyleSheet.create` or tailwind-style helpers; avoid inline magic numbers—extract to `constants/`.

## Testing Guidelines
- Automated tests are not yet configured; add Jest + `jest-expo` when introducing tests.
- Place unit tests next to the target module in a `__tests__` folder (e.g., `components/__tests__/Button.test.tsx`).
- Favor React Native Testing Library for interactive components; stub native modules through Expo mocks.
- Validate critical flows manually on at least one Android and iOS target until automated coverage exists.

## Commit & Pull Request Guidelines
- Keep commit subjects short and imperative (`Add SMS forwarding hook`), mirroring the existing `Initial commit`.
- Group related changes; avoid mixing refactors with feature work in one commit.
- Pull requests should include: purpose summary, screenshots or screen recordings for UI-impacting changes, and links to related issues.
- Note environment or schema updates in the PR body and document any manual follow-up steps for reviewers.

## Expo & Environment Tips
- Define configuration in `app.json` and mirror typed access in `expo-env.d.ts`; avoid hard-coding secrets in source files.
- When adding native modules, ensure they are compatible with the current Expo SDK (`~54.0.20`) and document any required `expo prebuild` steps.

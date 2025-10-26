# smsForwarder

smsForwarder is an Expo-powered React Native application that forwards incoming SMS messages to configured destinations so teams never miss critical alerts. The app is built with Expo Router and TypeScript to streamline development across iOS, Android, and the web.

## Design Reference
- Figma: [sms forwarder](https://www.figma.com/design/5Uo3kVScGig5Ry8m13hPud/sms-forwarder?node-id=0-1&t=fp13SdLafCrxh40v-1) — use this source of truth for layout, typography, and interaction specs.

## Project Structure
```
app/
  index.tsx       # Redirects into the tab navigator
  _layout.tsx     # Root stack (placeholder for future screens)
  (tabs)/
    _layout.tsx   # Bottom tab configuration (Home, Log, Black list)
    index.tsx     # Home dashboard with forwarding toggle + stats
    log.tsx       # Recent message forwards list
    blacklist.tsx # Blocked sender management
assets/           # Static imagery and icons
```

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the Expo development server
   ```bash
   npm start
   ```
   Choose `i` for iOS simulator, `a` for Android emulator, or `w` for the web preview as needed.

### Useful Scripts
- `npm run android` / `npm run ios` / `npm run web` – launch the bundler and open the selected platform directly.
- `npm run lint` – run ESLint with the Expo config to enforce formatting and best practices.
- `npm run reset-project` – reset the project to a clean starter state (destructive; use with caution).

## Current Screens
- **Home**: Displays forwarding toggle, destination summary, and shortcuts to logs/blacklist.
- **Message log**: Lists forwarded messages with sender, preview, and timestamp (currently seeded with mock data).
- **Black list**: Shows blocked senders and exposes add/remove entry placeholders.

## Development Notes
- Target Node.js LTS (>=18) for predictable Expo CLI behavior.
- Keep TypeScript types up to date when altering APIs or navigation params.
- Store secrets in environment files (not committed) and surface them through `expo-env.d.ts`.
- Validate SMS-forwarding flows on at least one real device before release to account for platform-specific permission prompts.

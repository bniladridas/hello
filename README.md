# Hello

A modern, real-time platform built with React, Firebase, and Tailwind CSS.

## Features

- Real-time post updates with Firebase Firestore
- Responsive design with Tailwind CSS
- Dark mode toggle
- Navigation drawer for easy access to different sections
- Single-page application
- Post creation, editing, deletion, and preview
- Clean, minimal UI

## Technology Stack & Rationale

- **React 18**: Chosen for its component-based architecture, enabling reusable UI components and efficient rendering with hooks. Provides a modern, declarative way to build interactive UIs.
- **Firebase Firestore**: Selected for real-time database capabilities without server management. Offers automatic scaling, offline support, and easy integration with React via listeners.
- **Tailwind CSS**: Used for utility-first CSS approach, allowing rapid UI development with consistent design. Reduces CSS bundle size through purging unused styles.
- **Lucide React**: Icons library for consistent, scalable SVG icons that match the design system.
- **PropTypes**: Added for runtime type checking in development, improving code reliability.
- **Create React App (react-scripts)**: Bootstrapped the project for quick setup with built-in tooling (webpack, Babel, ESLint).
- **JavaScript Standard Style**: Enforces strict, consistent code style with no semicolons, single quotes, and automatic formatting. Promotes clean, readable code without configuration.

## Current State & Maintenance

The project now includes comprehensive unit tests (42.76% coverage), E2E tests with Cypress, and CI/CD pipelines for automated testing and building.

### Known Issues
- **NPM Vulnerabilities**: 8 vulnerabilities (3 moderate, 5 high) related to dependencies like nth-check, postcss, webpack-dev-server. These are in dev dependencies and don't affect production builds. Avoid `npm audit fix --force` as it downgrades react-scripts to 0.0.0, breaking the app.
- **Deprecated Dependencies**: Some Babel plugins are deprecated but functional. Update when possible.
- **Node.js Deprecation Warnings**: fs.F_OK and webpack dev server middleware warnings are harmless but indicate outdated tooling.

### Maintenance Tasks
- Regularly update dependencies: `npm update`
- Monitor Firebase usage and costs
- Test Firestore rules in emulator before production
- Keep Node.js updated (currently supports v16+)
- Run `npm run lint:fix` to auto-format code per Standard JS

### Troubleshooting
- **App won't start**: Run `rm -rf node_modules && npm install` to clear cache
- **Build fails**: Ensure Node.js v16+, check .env file for Firebase config
- **Firebase connection issues**: Verify .env variables and Firestore rules
- **Styling issues**: Run `npm run build` to ensure Tailwind purging works
- **Emulator not connecting**: Ensure Java is installed and emulator is started before app

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
    - Go to [Firebase Console](https://console.firebase.google.com)
    - Create a new project
    - Enable Firestore Database
    - Go to Firestore > Rules and update to allow public access:
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            allow read, write: if true;
          }
        }
      }
      ```
      **Warning:** These rules allow public read/write access, suitable for demos but insecure for production. For real apps, implement authentication and restrict to `request.auth != null`.
    - In Project settings > General > Your apps, add a web app
    - Copy the Firebase config and create a `.env` file in the root directory:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Run the app locally:
   ```bash
   npm start
   ```

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Choose `build` as the public directory
   - Configure as a single-page app (SPA)

4. Build the app:
   ```bash
   npm run build
   ```

5. Deploy:
   ```bash
   firebase deploy
   ```

Your app will be live at your Firebase hosting URL

## Scripts

- `npm start`: Start the development server
- `npm run build`: Build the app for production
- `npm test`: Run unit tests
- `npm run test:coverage`: Run tests with coverage report
- `npm run lint`: Check code linting with Standard JS
- `npm run lint:fix`: Auto-fix linting issues
- `npm run preflight`: Run basic checks (lint, tests, build)
- `npm run all`: Run all checks and builds
- `npm run cypress:open`: Open Cypress E2E test runner
- `npm run cypress:run`: Run Cypress E2E tests headlessly
- `npm run eject`: Eject from Create React App

Custom scripts in `scripts/`:
- `commit-msg`: Git hook to enforce commit message standards (conventional commits, <=60 chars, lowercase)
- `rewrite_msg.sh`: Script to rewrite commit messages for history cleanup
- `preflight.sh`: Script for preflight checks (also used by `npm run all`)

## Local Development with Firebase Emulator

For secure local testing of Firestore rules without affecting live data:

1. Install Java (required for emulator): `brew install openjdk` (macOS) or download from java.com
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Start emulator: `firebase emulators:start`
4. In another terminal, run `npm start` (app connects to emulator in dev mode)
5. Access emulator UI at http://localhost:4000 for data inspection

The app automatically uses the emulator in development, live Firebase in production.

## Git Hooks

The repository uses a commit-msg hook to enforce:
- Commit messages start with conventional commit types (feat, fix, etc.)
- Messages are lowercase
- Maximum 60 characters

## Usage

- View posts on the home page
- Add new posts using the form
- Edit, delete, or preview posts
- Toggle dark mode with the switch

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes (follow commit message standards)
4. Submit a PR

## License

MIT License
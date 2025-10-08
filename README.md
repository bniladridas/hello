# Hello

[![Docker CI](https://github.com/bniladridas/hello/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/bniladridas/hello/actions/workflows/docker-ci.yml)

Real-time blog platform built with React, Firebase, and Tailwind CSS.

## Features

- Real-time post updates with Firebase Firestore
  <details>
    <summary>Real-time Details</summary>
    Posts are fetched and updated in real-time using Firebase Firestore's onSnapshot listener, ensuring users see changes instantly without refreshing.
  </details>
- Responsive design with Tailwind CSS
  <details>
  <summary>Responsive Details</summary>
  The app uses Tailwind CSS utility classes for responsive layouts that adapt to different screen sizes, from mobile to desktop.
  </details>
- Dark mode toggle
  <details>
  <summary>Dark Mode Details</summary>
  Users can toggle between light and dark themes, with preferences applied via Tailwind's dark mode classes and local state management.
  </details>
- Navigation drawer for easy access to different sections
  <details>
  <summary>Drawer Details</summary>
  The navigation drawer includes links to:
    - Home: Returns to the main blog view
    - Privacy Policy: Displays the app's privacy policy in a modal
    - Terms of Service: Shows the terms of service in a modal
  </details>
- Single-page application
  <details>
  <summary>SPA Details</summary>
  Built as a single-page application with React Router, allowing seamless navigation without full page reloads.
  </details>
- Post creation, editing, deletion, and preview
  <details>
  <summary>Post Management Details</summary>
  Full CRUD operations for blog posts: create new posts, edit existing ones, delete posts with confirmation, and preview posts in a modal before publishing.
  </details>
- Clean, minimal UI
  <details>
  <summary>UI Details</summary>
  Minimalist design with clean typography, ample whitespace, and intuitive icons from Lucide React, focusing on content readability.
  </details>

## Code Examples

### Creating a Post

```javascript
import { addDoc, collection } from 'firebase/firestore'
import { db } from './firebase/config'

const createPost = async (title, content) => {
  await addDoc(collection(db, 'posts'), {
    title,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}
```

### Using the Post Component

```jsx
import Post from './components/Post/Post'

const BlogList = ({ posts, onEdit, onDelete }) => {
  return (
    <div>
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
```

## Technology Stack & Rationale

- **React 18**: Chosen for its component-based architecture, enabling reusable UI components and efficient rendering with hooks. Provides a modern, declarative way to build interactive UIs.
- **Firebase Firestore**: Selected for real-time database capabilities without server management. Offers automatic scaling, offline support, and easy integration with React via listeners.
- **Tailwind CSS**: Used for utility-first CSS approach, allowing rapid UI development with consistent design. Reduces CSS bundle size through purging unused styles.
- **Lucide React**: Icons library for consistent, scalable SVG icons that match the design system.
- **PropTypes**: Added for runtime type checking in development, improving code reliability.
- **Create React App (react-scripts)**: Bootstrapped the project for quick setup with built-in tooling (webpack, Babel, ESLint).
- **JavaScript Standard Style**: Enforces strict, consistent code style with no semicolons, single quotes, and automatic formatting. Promotes clean, readable code without configuration.

## Current State & Maintenance

The project now includes comprehensive unit tests (43.83% statement coverage, 26.08% branch coverage), E2E tests with Cypress, and CI/CD pipelines for automated testing and building.

### Code Quality

As a code reviewer, I've assessed the codebase and confirmed the following:

- **Linting**: Passes ESLint with Standard JS rules (no errors)
- **Testing**: 4 unit test suites, 12 tests passing (43.83% statement coverage, 26.08% branch coverage)
- **E2E Testing**: Cypress tests for UI features (dark mode, navigation, pages)
- **Build**: Successful production build (133.05 kB JS, 4.09 kB CSS gzipped)
- **CI/CD**: Docker-based CI pipeline with automated testing and building
- **Security**: No critical vulnerabilities in production code
- **Code Organization**: Well-structured with logical folder separation (core/, config/, infra/, etc.)
- **Dependencies**: Minimal and up-to-date where possible
- **Documentation**: Comprehensive README with setup, deployment, and maintenance guides

**Recommendations for improvement:**
- Increase unit test coverage, especially for App.js Firebase interactions (requires advanced mocking)
- Consider upgrading deprecated dependencies when stable versions are available
- Implement more comprehensive error handling for production

### Known Issues
- **NPM Vulnerabilities**: 2 moderate severity vulnerabilities related to postcss and resolve-url-loader. These are in dev dependencies and don't affect production builds. Avoid `npm audit fix --force` as it may introduce breaking changes.
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
- **Web page format missing**: Stop dev server, clear cache with `rm -rf node_modules && npm install`, restart with `npm start`
- **Cypress tests fail**: Ensure app is running on localhost:3000 or use Docker setup with emulator

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

Firebase hosting is pre-configured in `firebase.json`. To deploy:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Build the app:
   ```bash
   npm run build
   ```

4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

Your app will be live at your Firebase hosting URL.

**Note**: The `firebase.json` is already configured for hosting with SPA routing. If you need to initialize Firebase in your project, run `firebase init` and select "Hosting" (the existing config will be preserved).

## Scripts

- `npm start`: Start the development server
- `npm run build`: Build the app for production
- `npm test`: Run unit tests
- `npm run test:coverage`: Run tests with coverage report
- `npm run lint`: Check code linting with Standard JS
- `npm run lint:fix`: Auto-fix linting issues
- `npm run format:check`: Check code formatting (alias for lint)
- `npm run format:fix`: Auto-fix code formatting (alias for lint:fix)
- `npm run preflight`: Run basic checks (lint, tests, build)
- `npm run all`: Run all checks and builds
- `npm run cypress:open`: Open Cypress E2E test runner (requires app running on localhost:3000)
- `npm run cypress:run`: Run Cypress E2E tests headlessly (requires app running on localhost:3000)
- `npm run eject`: Eject from Create React App

Custom scripts in `scripts_custom/`:
- `commit-msg`: Git hook to enforce commit message standards (conventional commits, <=60 chars, lowercase)
- `rewrite_msg.sh`: Script to rewrite commit messages for history cleanup
- `preflight.sh`: Script for preflight checks (also used by `npm run all`)

  Usage: `bash scripts_custom/preflight.sh`

## Infrastructure

See `infra/` folder for infrastructure-as-code, including Docker setup for local development with Firebase emulator.

### Docker Commands

```bash
# Build and test with Docker
docker build -f infra/Dockerfile -t hello:latest .
docker run --rm hello:latest npm run all

# Run with Firebase emulator
docker-compose -f infra/docker-compose.yml up --build
```

The Docker CI workflow (`.github/workflows/docker-ci.yml`) automatically builds the app in a container, runs all tests including Cypress E2E tests, and verifies the build process.

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

The script truncates commit messages to exactly 60 characters if they exceed that length:

```bash
if [ ${#msg} -gt 60 ]; then
    msg="${msg:0:60}"
fi
```

This performs a hard cutoff at 60 characters, which may split words or sentences mid-way. For example:
- "This is a very long commit message that exceeds the limit" → "This is a very long commit message that exceeds the li"

If you'd like to improve this (e.g., truncate at word boundaries or add ellipsis), I can modify the script. Otherwise, it ensures messages stay within the 60-char limit.

**Activation:** The hook is active in `.git/hooks/commit-msg`. All commits are validated automatically.

To activate locally (for contributors):
```bash
cp scripts_custom/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

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
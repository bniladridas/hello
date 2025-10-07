# Hello Blog

A modern, real-time blog platform built with React, Firebase, and Tailwind CSS.

## Features

- Real-time post updates with Firebase Firestore
- Responsive design with Tailwind CSS
- Dark mode toggle
- Single-page application
- Post creation, editing, deletion, and preview
- Clean, minimal UI

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
   - Enable Firestore Database (start in test mode)
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
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

Custom scripts in `scripts/`:
- `commit-msg`: Git hook to enforce commit message standards (conventional commits, <=60 chars, lowercase)
- `rewrite_msg.sh`: Script to rewrite commit messages for history cleanup

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
# Hello Blog

A modern, real-time blog platform built with React, Firebase, and Tailwind CSS.

## Features

- Real-time post updates
- Responsive design
- Firebase Firestore integration
- Dark mode toggle

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bniladridas/hello.git
   cd hello
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project named "hello"
   - Enable Firestore Database (start in test mode)
   - In Project settings > General > Your apps, add a web app
   - Copy the Firebase config and update `.env`:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=hello-9178d.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=hello-9178d
     REACT_APP_FIREBASE_STORAGE_BUCKET=hello-9178d.firebasestorage.app
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=585833449097
     REACT_APP_FIREBASE_APP_ID=1:585833449097:web:d3bdc2bf23e0db0bca6858
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

Your app will be live at `https://hello-9178d.web.app`

## Usage

- View posts on the home page
- Add new posts using the form
- Toggle dark mode with the switch

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Submit a PR

## License

MIT License
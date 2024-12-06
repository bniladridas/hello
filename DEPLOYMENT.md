# DEPLOYMENT.md

# Gravity Blog Deployment Guide
Current as of: 2024-12-06

## Prerequisites

### Required Tools
- Node.js (v16 or higher)
- npm or yarn
- Vercel CLI
- Git

### Accounts Required
- GitHub account
- Vercel account
- Firebase account

## Environment Configuration

### 1. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Set up security rules
4. Get Firebase configuration:
   - Go to Project Settings
   - Find the configuration object
   - Copy all necessary keys

### 2. Environment Variables
Create `.env.local` file in project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Deployment Options

### 1. Vercel Deployment (Recommended)

#### First-time Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Subsequent Deployments
```bash
# Deploy to production
vercel --prod
```

#### Environment Variables on Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add all Firebase configuration variables

### 2. Manual Deployment

#### Build Process
```bash
# Install dependencies
npm install

# Create production build
npm run build

# Test production build locally
npm run serve
```

## Post-Deployment Checklist

### 1. Functionality Verification
- [ ] Test post creation
- [ ] Verify real-time updates
- [ ] Check post editing
- [ ] Verify post deletion
- [ ] Test post preview
- [ ] Verify dark/light mode toggle

### 2. Performance Checks
- [ ] Run Lighthouse audit
- [ ] Verify loading times
- [ ] Check mobile responsiveness
- [ ] Test offline functionality

### 3. Security Verification
- [ ] Verify environment variables
- [ ] Check Firebase security rules
- [ ] Test error handling
- [ ] Verify API endpoints

## Monitoring

### 1. Performance Monitoring
- Set up Vercel Analytics
- Configure Firebase Performance Monitoring
- Enable error tracking

### 2. Error Tracking
- Monitor Vercel deployment logs
- Check Firebase Console for errors
- Set up error notifications

## Rollback Procedures

### 1. Vercel Rollback
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback
```

### 2. Manual Rollback
1. Find the last working commit
2. Reset to that commit:
```bash
git reset --hard <commit-hash>
git push -f origin main
```

## Troubleshooting

### Common Issues

1. Build Failures
- Check Node.js version
- Verify environment variables
- Check dependencies

2. Runtime Errors
- Check Firebase configuration
- Verify API endpoints
- Check console logs

3. Performance Issues
- Review bundle size
- Check image optimization
- Verify caching settings

## Support

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs)

### Contact
For deployment issues, contact:
- Email: ndas1262000@gmail.com
- GitHub Issues: [Create New Issue](https://github.com/bniladridas/gravity-blog/issues)

---

Last updated: 2024-12-06
Maintainer: @bniladridas
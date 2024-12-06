# Gravity Blog

Current Date and Time (UTC): 2024-12-06 15:58:52  
Author: @bniladridas

A modern, real-time blog platform leveraging React, Firebase, and Vercel Edge Network for optimal performance and scalability.

## ⚡ Quick Links
- [Live Demo](https://gravity-blog-xi.vercel.app)
- [Documentation](./docs)
- [Contributing Guide](CONTRIBUTING.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🌟 Key Features
- Real-time post updates via Firebase
- Edge-optimized content delivery
- Dark/Light mode support
- Responsive design
- Post preview functionality
- Global CDN integration

## 🏗️ System Architecture

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│                   Client Layer                  │
│  ┌─────────────────┐      ┌─────────────────┐  │
│  │    React App    │      │   Static Assets  │  │
│  │  (CSR/Vercel)   │      │    (CDN/Edge)   │  │
│  └────────┬────────┘      └────────┬────────┘  │
└──────────┬─────────────────────────┬───────────┘
           │                         │
           ▼                         ▼
┌─────────────────────────────────────────────────┐
│               Vercel Edge Network               │
│  ┌─────────────────┐      ┌─────────────────┐  │
│  │   Edge Caching  │      │   Global CDN    │  │
│  └────────┬────────┘      └────────┬────────┘  │
└──────────┬─────────────────────────┬───────────┘
           │                         │
           ▼                         ▼
┌─────────────────────────────────────────────────┐
│              Firebase Services                  │
│  ┌─────────────────┐      ┌─────────────────┐  │
│  │    Firestore    │      │  Firebase Auth  │  │
│  │    Database     │      │   (Optional)    │  │
│  └─────────────────┘      └─────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Component Architecture
```
┌─────────────────────────────────────────────────┐
│                    App.js                       │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ PostForm │ │ BlogList │ │ PreviewModal  │  │
│  └────┬─────┘ └────┬─────┘ └───────┬───────┘  │
│       │           │              │          │  │
│       ▼           ▼              ▼          │  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  Post    │ │ Footer   │ │ Toggle   │    │  │
│  │Component │ │Component │ │ Switch   │    │  │
│  └──────────┘ └──────────┘ └──────────┘    │  │
└─────────────────────────────────────────────────┘
```

### Data Flow Architecture
```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│ User Action  │────▶│ React State   │────▶│   Firebase   │
│              │     │ Management    │     │  Firestore   │
└──────────────┘     └───────────────┘     └──────────┬───┘
       ▲                                              │
       │                                              │
       └──────────────────────────────────────────────┘
            Real-time Updates via onSnapshot
```

## 🛠️ Tech Stack
- **Frontend:** React, TailwindCSS
- **Database:** Firebase Firestore
- **Deployment:** Vercel Edge Network
- **State Management:** React Hooks
- **Real-time Updates:** Firebase SDK
- **UI Components:** Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Firebase account
- Vercel account

### Installation
```bash
# Clone repository
git clone https://github.com/bniladridas/gravity-blog.git

# Install dependencies
cd gravity-blog
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm start
```

### Environment Variables
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 📦 Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## 🔧 Technical Details

### Performance Optimizations
- Query limits (40 posts per fetch)
- Edge caching for static content
- Lazy loading for modals
- Optimistic UI updates
- Real-time data synchronization

### Security Features
- Firebase security rules
- Input validation
- XSS protection
- CORS policies

### Scalability
- Distributed CDN
- Edge computing capabilities
- Database sharding support
- Horizontal scaling

## 🤝 Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📜 License
MIT License - see [LICENSE](LICENSE) for details.

## 📚 Documentation
- [Deployment Guide](DEPLOYMENT.md)
- [Security Policy](SECURITY.md)
- [API Documentation](API.md)
- [Changelog](CHANGELOG.md)

## 👤 Author
**Bniladridas**
- LinkedIn: [bniladridas](https://www.linkedin.com/in/bniladridas/)
- Twitter: [@bniladridas](https://x.com/bniladridas)

## 🙏 Acknowledgments
- React Team
- Firebase Team
- Vercel Team
- TailwindCSS Team
- Lucide React Team

---
Last updated: 2024-12-06 15:58:52 UTC

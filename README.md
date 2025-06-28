# VibeStudio - AI-Powered Development Platform

VibeStudio is a comprehensive AI-powered development platform that combines a modern web application, robust backend API, and cross-platform desktop application. It provides an integrated development environment where developers can interact with AI to generate, manage, and preview code projects in real-time.

[![Watch VibeStudio Demo](https://img.shields.io/badge/▶️%20Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=3yUmCKH4drw)

<div align="center">
  <a href="https://www.youtube.com/watch?v=3yUmCKH4drw">
    <img src="https://img.youtube.com/vi/3yUmCKH4drw/maxresdefault.jpg" alt="VibeStudio Demo" style="width:100%;max-width:600px;">
  </a>
  <br>
  <a href="https://www.youtube.com/watch?v=3yUmCKH4drw">
    <img src="https://img.shields.io/badge/▶️%20Click%20to%20Play-YouTube-red?style=for-the-badge&logo=youtube" alt="Play Video">
  </a>
</div>
## 🏗️ Platform Architecture

VibeStudio consists of three main components:

- **🌐 Web Application** - React-based frontend with AI chat interface and live preview
- **⚡ Backend API** - Hono.js-powered backend with authentication and real-time features  
- **🖥️ Desktop Application** - Electron-based cross-platform desktop app with tunneling capabilities

## 🚀 Key Features

### AI-Powered Development
- **Real-time AI Chat** with streaming responses for code generation
- **Intelligent Code Completion** and suggestions
- **Project Generation** from natural language descriptions
- **Code Review** and optimization recommendations

### Integrated Development Environment
- **Monaco Editor** with VS Code-like experience
- **Live Preview** of applications and code changes
- **File System Management** with tree navigation
- **Split-pane Interface** for optimal productivity

### Cross-Platform Support
- **Web Application** for browser-based development
- **Desktop Application** for macOS and Windows
- **Real-time Synchronization** between platforms
- **Offline Development** capabilities

### Enterprise Features
- **User Management** with multi-authentication support
- **Usage Tracking** and cost management
- **Project Collaboration** and version control
- **API Integration** with external services

### Networking & Connectivity
- **Native Node Tunneling** - Generate public tunnel URLs (e.g., `https://okp5pnn70exytk2ebo4u.link.nativenode.host/`)
- **Custom Domain Support** - Connect your own domain to tunnel endpoints
- **Secure HTTPS Tunnels** - All tunnels are secured with SSL certificates
- **Real-time Tunnel Management** - Create, monitor, and manage tunnels from the desktop app
- **Flexible Tunneling Options** - Use our managed tunneling service or configure your own with Zrok/FRP

## 📋 Prerequisites

Before setting up VibeStudio, ensure you have the following installed:

### System Requirements
- **Node.js** v18 or higher
- **MongoDB** v6.0 or higher
- **Git** for version control
- **Python** (for native module compilation)

### Development Tools
- **Bun** (recommended package manager) or **npm**
- **TypeScript** knowledge for customization
- **Docker** (optional, for containerized deployment)

### External Services
- **Google OAuth2 App** (for authentication)
- **Gmail Account** (for SMTP email services)
- **Anthropic API Key** (for AI features)
- **GitHub Token** (optional, for repository integration)

### Tunneling Services (Optional)
- **VibeStudio Managed Tunneling** (included, no setup required)
- **Zrok** (optional, for self-hosted tunneling) - [zrok.io](https://zrok.io/)
- **FRP (Fast Reverse Proxy)** (optional, for custom tunneling) - [GitHub](https://github.com/fatedier/frp)

## 🚀 Quick Start

For detailed setup instructions for each component, please refer to the individual README files:

- **📱 [Web Application Setup](web-app/README.md)** - Complete guide for the React-based web interface
- **⚡ [Backend API Setup](backend/README.md)** - Detailed backend configuration and API documentation  
- **🖥️ [Desktop Application Setup](desktop-app/README.md)** - Desktop app installation and tunneling features

## 🛠️ Quick Setup Overview

Here's a high-level overview of the setup process. For detailed instructions, please check the individual component READMEs linked above.

### Step 1: Clone Repository

```bash
git clone https://github.com/aivfkesavan/vibecoding.git
cd vibecoding
```

### Step 2: Set Up Components

Choose which components you want to run:

| Component | Purpose | Setup Guide |
|-----------|---------|-------------|
| **Backend API** | Required for all features | [📖 Backend Setup Guide](backend/README.md) |
| **Web Application** | Browser-based development | [📖 Web App Setup Guide](web-app/README.md) |
| **Desktop Application** | Local development + tunneling | [📖 Desktop App Setup Guide](desktop-app/README.md) |

### Step 3: Basic Testing

After setting up your desired components:

```bash
# Test backend (if running)
curl http://localhost:5000/api/health

# Test web app (if running)
open http://localhost:8080

# Desktop app will open automatically when started
```

## 📋 Component Feature Matrix

| Feature | Web App | Desktop App | Backend API |
|---------|---------|-------------|-------------|
| AI Chat Interface | ✅ | ✅ | ✅ (Provides API) |
| Code Editor (Monaco) | ✅ | ✅ | - |
| File Management | ✅ | ✅ | ✅ (File API) |
| Live Preview | ✅ | ✅ | - |
| User Authentication | ✅ | ✅ | ✅ (Auth API) |
| Project Management | ✅ | ✅ | ✅ (Project API) |
| Tunnel Generation | - | ✅ | - |
| Custom Domain Support | - | ✅ | - |
| Offline Development | - | ✅ | - |
| Real-time Sync | ✅ | ✅ | ✅ (WebSocket) |
| Cost Tracking | ✅ | ✅ | ✅ (Usage API) |

## 🔗 Quick Links to Detailed Guides

### 🌐 Web Application
**Perfect for browser-based development and team collaboration**
- [📚 Complete Web App Documentation](web-app/README.md)
- Features: AI chat, Monaco editor, live preview, project management
- Tech Stack: React, TypeScript, Vite, Tailwind CSS, Shadcn/ui

### ⚡ Backend API  
**Required for authentication, AI features, and data persistence**
- [📚 Complete Backend Documentation](backend/README.md)
- Features: REST API, WebSocket, authentication, usage tracking
- Tech Stack: Hono.js, MongoDB, TypeScript, JWT, WebSocket

### 🖥️ Desktop Application
**For local development with tunneling capabilities**
- [📚 Complete Desktop App Documentation](desktop-app/README.md)
- Features: Native app, tunnel generation, custom domains, offline support
- Tech Stack: Electron, React, TypeScript, Native tunneling

## 🎯 Getting Started Recommendations

### For Web Developers
1. Start with [Backend Setup](backend/README.md) (required)
2. Then set up [Web Application](web-app/README.md)
3. Optional: Add [Desktop App](desktop-app/README.md) for tunneling features

### For Local Development
1. Start with [Backend Setup](backend/README.md) (required)  
2. Set up [Desktop Application](desktop-app/README.md) for full local experience
3. Optional: Add [Web App](web-app/README.md) for browser access

### For Testing/Demo
1. [Backend Setup](backend/README.md) (minimal configuration)
2. [Web Application](web-app/README.md) (quickest to demo)

## 🔧 Advanced Configuration

For advanced configuration options including development workflows, production deployment, and custom integrations, please refer to the individual component documentation:

- [Backend Development & Deployment Guide](backend/README.md#building-for-production)
- [Web App Development & Deployment Guide](web-app/README.md#building-the-application)  
- [Desktop App Development & Distribution Guide](desktop-app/README.md#building-the-application)

## ⚙️ Environment Configuration

For detailed environment variable setup and security configuration, please refer to:

- [Backend Environment Configuration](backend/README.md#environment-configuration)
- [Web App Environment Configuration](web-app/README.md#environment-configuration)
- [Desktop App Environment Configuration](desktop-app/README.md#environment-setup)

## 🚨 Troubleshooting

For detailed troubleshooting guides and common issues, please refer to:

- [Backend Troubleshooting Guide](backend/README.md#troubleshooting)
- [Web App Troubleshooting Guide](web-app/README.md#troubleshooting)
- [Desktop App Troubleshooting Guide](desktop-app/README.md#troubleshooting)

### Quick Debug Commands

```bash
# Check if all services are running
curl http://localhost:5000/api/health  # Backend
curl -I http://localhost:8080          # Web App
# Desktop app should be visible in your applications

# Generate secure JWT secret (if needed)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure cross-platform compatibility

## 🆘 Support

### Documentation
- [Web App Documentation](web-app/README.md) - AI-powered web interface setup and usage
- [Backend API Documentation](backend/README.md) - API endpoints and server configuration
- [Desktop App Documentation](desktop-app/README.md) - Desktop app setup and tunneling features

### Community Support
- **Email**: info@aivf.io
- **GitHub Issues**: [Create an issue](https://github.com/aivfkesavan/vibecoding/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aivfkesavan/vibecoding/discussions)

### Commercial Support
For enterprise support, custom development, or consulting services, contact us at info@aivf.io

---

**AIVF**  
Building the future of AI-powered development tools.

*Made with ❤️ by the AIVF team*

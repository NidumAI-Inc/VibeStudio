# VibeStudio Web Application

An AI-powered development platform built with React, TypeScript, and modern web technologies. VibeStudio provides an IDE-like environment where developers can interact with AI to generate, manage, and preview code projects in real-time.

## 🚀 Features

- **AI-Powered Development**: Real-time AI chat with streaming responses for code generation and assistance
- **Integrated Code Editor**: Monaco Editor (VS Code experience) with syntax highlighting for multiple languages
- **Live Preview**: Real-time preview of generated applications and code changes
- **Project Management**: Complete project lifecycle management with version control integration
- **File System Operations**: Upload, download, and manage project files with tree navigation
- **Split-Pane Interface**: Customizable workspace with resizable panels for optimal productivity
- **Cost Tracking**: Built-in budget management and usage monitoring
- **Theme Support**: Light/dark theme with custom glass morphism effects
- **Real-time Collaboration**: Multi-user development environment capabilities

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Bun** (recommended) or **npm** (package manager)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd web-app
```

### 2. Install Dependencies
```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:4327
VITE_PRICING_API_URL=https://nativenode.link.nativenode.host:5633

# Anthropic API Configuration
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key

# GitHub Integration (Optional)
VITE_GITHUB_TOKEN=your-github-token

# Other environment variables as needed
```

### 4. Development Server

Start the development server:
```bash
# Using Bun
bun run dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Building the Application

### Development Build
```bash
bun run build:dev
# or
npm run build:dev
```

### Production Build
```bash
bun run build
# or
npm run build
```

### Preview Production Build
```bash
bun run preview
# or
npm run preview
```

## 📁 Project Structure

```
web-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui component library
│   │   ├── auth/           # Authentication components
│   │   ├── chat/           # AI chat interface
│   │   ├── editor/         # Code editor components
│   │   ├── files/          # File management components
│   │   └── projects/       # Project management components
│   ├── pages/              # Route-based page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── profile/        # User profile pages
│   │   └── setup/          # Configuration pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service layer
│   │   ├── api.ts          # Base API configuration
│   │   ├── auth.ts         # Authentication services
│   │   ├── chat.ts         # AI chat services
│   │   ├── files.ts        # File operations
│   │   └── projects.ts     # Project management
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── lib/                # Library configurations
├── public/                 # Static assets
├── dist/                   # Build output
└── Configuration files
```

## 🎨 Technology Stack

### Core Technologies
- **React** 18.3.1 - UI framework
- **TypeScript** 5.5.3 - Type safety
- **Vite** 5.4.1 - Build tool and dev server
- **Bun** - Package manager and runtime

### UI & Styling
- **Tailwind CSS** 3.4.11 - Utility-first CSS framework
- **Shadcn/ui** - Complete UI component library
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **Next Themes** - Theme management

### State Management
- **Zustand** 5.0.5 - Lightweight state management
- **TanStack React Query** 5.56.2 - Server state management
- **Redux Toolkit** 2.8.2 - Additional state management

### Development Tools
- **Monaco Editor** - VS Code-like code editor
- **React Syntax Highlighter** - Code syntax highlighting
- **React Hook Form** 7.53.0 - Form management
- **Zod** 3.23.8 - Schema validation

### UI Enhancements
- **React Resizable Panels** - Resizable UI panels
- **React Diff Viewer** - File difference visualization
- **Sonner** - Toast notifications
- **Class Variance Authority** - Component styling

## 🔧 Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run build:dev` - Build for development
- `bun run lint` - Run ESLint code linting
- `bun run preview` - Preview production build

## ⚙️ Configuration Files

- **package.json** - Project dependencies and scripts
- **vite.config.ts** - Vite build configuration
- **tailwind.config.ts** - Tailwind CSS configuration
- **components.json** - Shadcn/ui component configuration
- **tsconfig.json** - TypeScript configuration
- **eslint.config.js** - ESLint configuration

## 🌐 API Integration

### Backend Services
- **Main API**: `http://127.0.0.1:4327` (development)
- **Pricing Service**: Custom pricing and usage tracking
- **Anthropic API**: AI model integration
- **GitHub API**: Repository integration

### Service Architecture
- **Authentication**: JWT-based auth with protected routes
- **Real-time Chat**: Streaming AI responses with polling
- **File Operations**: Complete file system management
- **Project Management**: CRUD operations with version control
- **Cost Tracking**: Usage monitoring and budget management

## 🎨 Design System

### Theme
- **Primary Colors**: Blue palette (#3b82f6)
- **Background**: Light blue tints with glass morphism
- **Typography**: Inter font family
- **Animations**: Custom fade, slide, glow, and shimmer effects

### Component Library
Complete Shadcn/ui implementation with 40+ components:
- Form components (Input, Select, Textarea, etc.)
- Navigation (Tabs, Breadcrumbs, Pagination)
- Feedback (Alert, Toast, Progress)
- Layout (Card, Separator, Sheet)
- Data Display (Table, Badge, Avatar)

## 🔐 Authentication & Security

- **JWT Token Management**: Secure token storage and refresh
- **Protected Routes**: Role-based access control
- **API Key Management**: Secure storage of external API keys
- **Budget Controls**: Usage limits and cost monitoring
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Vercel Deployment (Recommended)
The application is pre-configured for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
bun run build

# Deploy the dist/ folder to your hosting provider
```

## 🚨 Troubleshooting

### Common Issues

1. **Development Server Won't Start**
   ```bash
   # Clear cache and reinstall dependencies
   rm -rf node_modules
   rm bun.lockb
   bun install
   ```

2. **API Connection Issues**
   - Verify API server is running on port 4327
   - Check CORS configuration
   - Validate environment variables

3. **Build Errors**
   ```bash
   # Check TypeScript errors
   bun run lint
   
   # Clear Vite cache
   rm -rf dist
   rm -rf .vite
   ```

4. **Monaco Editor Issues**
   - Ensure proper asset loading in production
   - Check Vite configuration for worker files

### Debug Mode
Enable debug logging:
```bash
DEBUG=* bun run dev
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- **Email**: info@aivf.io
- **Issues**: Create an issue in this repository
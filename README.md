<div align="center">

# 🚀 Jamala Akbara's Portfolio

## ✨ A Modern Portfolio Website with Advanced Animations & Analytics

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.22-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

---

**🎯 Cutting-edge portfolio with interactive animations • 📊 Google Analytics integrated • 🌙 Dark/Light mode • 📱 Fully responsive**

</div>

---

## 🌟 Highlights

### 🎨 **Interactive Features**
- **Advanced Animations**: Smooth Framer Motion animations throughout
- **Custom Cursor**: Interactive cursor with magnetic effects
- **Parallax Scrolling**: Multi-layer depth effects
- **Particle Systems**: Velocity-based animations
- **Dynamic Backgrounds**: Animated gradient backgrounds
- **Loading States**: Beautiful animated loading screens

### 📊 **Analytics & SEO**
- **Google Analytics 4**: Comprehensive event tracking
- **Google Search Console**: SEO optimization ready
- **GDPR Compliant**: Cookie consent management
- **Performance Optimized**: Build-time content generation

### 🛠️ **Modern Tech Stack**
- **Framework**: Next.js 15 with App Router & Turbopack
- **UI Components**: 52+ shadcn/ui components (New York style)
- **Animation**: Framer Motion with spring physics
- **Styling**: Tailwind CSS v4 with custom themes
- **Content**: JSON-based content management system

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd jamalakbara-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000) to see your portfolio in action!**

---

## 📁 Project Structure

```
jamalakbara-portfolio/
├── 📂 app/                    # Next.js app router pages
│   ├── 🎨 globals.css        # Global styles with animations
│   ├── 📱 layout.tsx         # Root layout with analytics
│   └── 🏠 page.tsx           # Main portfolio page
├── 📂 components/             # React components
│   ├── 🎭 ui/                # 52+ shadcn/ui components
│   ├── 🧭 navigation.tsx     # Main navigation with tracking
│   ├── 🌟 hero-section.tsx   # Landing hero with animations
│   ├── 💼 services-section.tsx # Services display
│   ├── 🎨 featured-work-section.tsx # Portfolio showcase
│   ├── 👤 about-section.tsx  # About content
│   ├── 📞 cta-section.tsx    # Contact section
│   ├── 🎯 custom-cursor.tsx  # Interactive cursor
│   ├── 🌌 dynamic-background.tsx # Animated backgrounds
│   ├── 📚 parallax-layers.tsx # Parallax effects
│   ├── ⚡ velocity-effects.tsx # Particle animations
│   └── 📊 analytics/         # Analytics components
├── 📂 content/               # JSON-based content system
│   ├── 🏷️ site-config.json  # Site configuration
│   ├── 🦸 hero.json         # Hero section content
│   ├── 🛠️ services.json     # Services data
│   ├── 💼 projects.json     # Portfolio projects
│   ├── 👤 about.json        # About section
│   ├── 🧭 navigation.json   # Navigation menu
│   └── 📞 cta.json          # Call-to-action
├── 📂 lib/                   # Utility functions
│   ├── 📝 content-manager.ts # Content management
│   ├── 🎨 content-types.ts  # TypeScript interfaces
│   └── 📊 analytics/        # Analytics system
│       ├── 📈 ga-config.ts  # Google Analytics config
│       ├── 🎯 events.ts     # Custom events
│       └── 🔐 consent.ts    # Cookie consent
├── 📂 hooks/                 # Custom React hooks
│   ├── 📊 useAnalytics.ts   # Analytics tracking
│   ├── 🎨 useTheme.ts       # Theme management
│   └── 🎯 useProjectAnalytics.ts # Project tracking
└── 📂 contexts/              # React contexts
    └── 🌙 theme-context.tsx # Theme management
```

---

## 🎨 Features Deep Dive

### 🌟 **Animation System**

#### **Custom Cursor Effects**
```typescript
// Magnetic cursor effect that follows mouse movement
const handleMouseMove = (e: MouseEvent) => {
  const cursor = document.querySelector('.custom-cursor');
  // Smooth magnetic animation to interactive elements
};
```

#### **Parallax Scrolling**
```typescript
// Multi-layer parallax with different scroll speeds
<motion.div
  initial={{ y: 0 }}
  whileInView={{ y: -50 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Content with parallax effect */}
</motion.div>
```

#### **Particle Animations**
```typescript
// Velocity-based particle system
const particles = generateParticles();
// Each particle has physics-based movement
```

### 📊 **Analytics Integration**

#### **Google Analytics 4**
- **Page Views**: Automatic tracking on route changes
- **User Interactions**: Button clicks, form submissions
- **Project Engagement**: Time spent on project details
- **Navigation Patterns**: Menu clicks and theme usage

#### **Custom Events**
```typescript
// Track project views
analytics.trackProjectView(projectName, projectCategory);

// Track button interactions
analytics.trackButtonClick(buttonLabel, buttonLocation);

// Track navigation usage
analytics.trackNavigationClick(menuItem, currentTheme);
```

#### **GDPR Compliance**
- Cookie consent banner
- User consent management
- Privacy-friendly analytics

### 🎯 **Content Management**

#### **JSON-Based System**
```json
{
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "technologies": ["Tech1", "Tech2"],
      "category": "Web Development",
      "status": "Completed"
    }
  ]
}
```

#### **TypeScript Interfaces**
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  year: number;
  imageUrl: string;
  projectUrl?: string;
}
```

---

## 🎛️ Configuration

### 🌍 **Environment Variables**

```env
# Development Environment Variables
# Copy this file to .env.local and modify as needed

# Formspree Configuration
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID_HERE

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://jamalakbara.com

# Google Analytics Configuration
# Get your Measurement ID from Google Analytics 4 Admin > Data Streams
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console Verification
# Add your Google Search Console verification meta tag content
NEXT_PUBLIC_GSC_VERIFICATION_CONTENT=ABcDefGhiJklMnoPqrStuVwXyZ1234567890

# Environment Configuration
# Development: use "development"
# Production: use "production" (analytics will only track in production)
NEXT_PUBLIC_NODE_ENV=development
```

### 📊 **Google Analytics Setup**

1. **Create Google Analytics 4 Property**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property
   - Set up a web data stream

2. **Get Measurement ID**
   - Admin > Data Streams > Web Stream
   - Look for "Measurement ID" (format: G-XXXXXXXXXX)

3. **Update Environment Variables**
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
   ```

### 🔍 **Google Search Console Setup**

1. **Add Property**
   - Go to [Google Search Console](https://search.google.com/search-console/)
   - Add Property > URL prefix
   - Choose HTML tag verification

2. **Get Verification Code**
   - Copy the content value from meta tag
   - Update environment variable:
   ```env
   NEXT_PUBLIC_GSC_VERIFICATION_CONTENT=YOUR_VERIFICATION_CONTENT
   ```

---

## 🚀 Development Commands

### ⚡ **Core Application**
```bash
npm run dev              # Start development server with Turbopack
npm run dev:turbopack    # Start with Turbopack explicitly
npm run build            # Production build with Turbopack
npm run build:turbopack  # Build with Turbopack explicitly
npm start                # Production server
npm run lint             # ESLint code quality check
```

### 🎨 **Development Workflow**

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Edit Content**
   - Modify JSON files in `/content/`
   - Changes reflect immediately

3. **Add New Components**
   - Use shadcn/ui components
   - Follow animation patterns

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🎯 Animation Patterns

### 🔥 **Button Animations**
All buttons feature advanced hover and click animations:

```typescript
<motion.button
  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  whileTap={{ scale: 0.95 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Button Content
</motion.button>
```

### 🌊 **Scroll Animations**
Sections animate in as you scroll:

```typescript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  viewport={{ once: true }}
>
  Section Content
</motion.div>
```

### 🎭 **Staggered Animations**
Multiple elements animate in sequence:

```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};
```

---

## 📱 Performance Features

### ⚡ **Optimizations**
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic code splitting
- **Font Optimization**: Google Fonts with display: swap
- **CSS Optimization**: Tailwind CSS purging in production
- **Bundle Analysis**: Built-in bundle analyzer

### 📊 **Core Web Vitals**
- **LCP**: Optimized largest contentful paint
- **FID**: First input delay optimization
- **CLS**: Cumulative layout shift prevention

---

## 🌍 Deployment

### 🚀 **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 🐳 **Docker**
```bash
# Build Docker image
docker build -t jamalakbara-portfolio .

# Run container
docker run -p 3000:3000 jamalakbara-portfolio
```

### 🔧 **Environment Setup for Production**
1. Set all environment variables in your hosting platform
2. Configure domain name
3. Set up SSL certificate
4. Configure analytics and tracking

---

## 🎨 Customization Guide

### 🎯 **Adding New Projects**
1. Add to `/content/projects.json`:
```json
{
  "id": "new-project",
  "title": "New Project",
  "description": "Project description",
  "technologies": ["React", "TypeScript"],
  "category": "Web Development",
  "status": "Completed",
  "year": 2024,
  "imageUrl": "/projects/new-project.png",
  "projectUrl": "https://example.com"
}
```

### 🎨 **Adding New Animations**
```typescript
import { motion } from 'framer-motion';

const customAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};
```

### 🌙 **Theme Customization**
Update CSS variables in `app/globals.css`:
```css
:root {
  --primary: 210 40% 98%;
  --secondary: 210 40% 96%;
  /* Add your custom colors */
}
```

---

## 🤝 Contributing

### 📝 **Development Guidelines**
1. **Follow TypeScript** strict mode
2. **Use Framer Motion** for animations
3. **Implement responsive design** with Tailwind
4. **Add analytics tracking** for user interactions
5. **Test accessibility** with screen readers

### 🎯 **Code Style**
- Use **ESLint** configuration
- Follow **Prettier** formatting
- Write **JSDoc** comments for functions
- Use **semantic** HTML elements

---

## 📊 Analytics & Insights

### 📈 **Tracking Implementation**
The portfolio includes comprehensive analytics tracking:

#### **User Engagement**
- Page view durations
- Scroll depth tracking
- Button interaction rates
- Project view patterns

#### **Performance Metrics**
- Page load times
- Animation performance
- Mobile vs desktop usage
- Browser compatibility

#### **Content Performance**
- Most viewed projects
- Click-through rates
- User navigation paths
- Conversion tracking

### 🔍 **SEO Optimization**
- **Meta tags**: Dynamic meta descriptions
- **Structured data**: JSON-LD schema
- **Sitemap**: Auto-generated sitemap
- **Open Graph**: Social media optimization
- **Search Console**: Google indexing

---

## 🎯 Future Enhancements

### 🚀 **Planned Features**
- [ ] **Blog System**: Integrated blog with CMS
- [ ] **Admin Dashboard**: Content management interface
- [ ] **A/B Testing**: Feature testing framework
- [ ] **Progressive Web App**: PWA capabilities
- [ ] **Multi-language**: Internationalization support
- [ ] **Advanced Animations**: WebGL integrations

### 🔧 **Technical Improvements**
- [ ] **Performance Monitoring**: Real-time performance tracking
- [ ] **Error Tracking**: Bug reporting integration
- [ ] **Security Headers**: Enhanced security features
- [ ] **CDN Integration**: Global content delivery
- [ ] **Database Integration**: Dynamic content management

---

## 📞 Support & Contact

### 🌐 **Live Demo**
Check out the live portfolio: [https://jamalakbara.com](https://jamalakbara.com)

### 📧 **Get in Touch**
- **Email**: [jamal@example.com](mailto:jamal@example.com)
- **LinkedIn**: [linkedin.com/in/jamalakbara](https://linkedin.com/in/jamalakbara)
- **GitHub**: [github.com/jamalakbara](https://github.com/jamalakbara)

### 🐛 **Bug Reports & Issues**
Found an issue? [Create an issue on GitHub](https://github.com/jamalakbara/portfolio/issues)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### 🎨 **Design Inspirations**
- **shadcn/ui**: Beautiful component library
- **Framer Motion**: Smooth animation library
- **Tailwind CSS**: Utility-first CSS framework
- **Next.js**: React framework

### 🛠️ **Special Thanks**
- The **Next.js** team for the amazing framework
- **Vercel** for the hosting platform
- The **open source** community for inspiration

---

<div align="center">

## 🎉 **Thanks for checking out my portfolio!**

**⭐ Star this repo if it helped you!**

---

*Built with ❤️ and lots of ☕ by [Jamala Akbara](https://jamalakbara.com)*

</div>
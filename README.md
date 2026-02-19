<div align="center">

# 🚀 Jamal Akbar's Portfolio (v2.0)

## ✨ A Modern Portfolio Website with 3D Visuals & Advanced Animations

[![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-white?style=for-the-badge&logo=three.js)](https://threejs.org/)

---

**🎯 Cutting-edge portfolio with interactive 3D elements • 📊 Google Analytics integrated • 🌙 Dark Mode Aesthetic • 📱 Fully responsive**

</div>

---

## 🌟 Highlights

### 🎨 **Interactive Features**
- **3D Project Carousel**: Interactive 3D carousel using React Three Fiber
- **Liquid Background**: Shader-based fluid background animations
- **Particle Systems**: Interactive particle effects reacting to cursor movement
- **Custom Cursor**: Magnetic and reactive custom cursor implementation
- **Noise Overlay**: Cinematic grain texture for premium feel
- **Smooth Animations**: GSAP and Framer Motion integration

### 📊 **Analytics & SEO**
- **Google Analytics 4**: Comprehensive event tracking
- **Google Search Console**: SEO optimization ready
- **Performance Optimized**: Static generation with Next.js 16

### 🛠️ **Modern Tech Stack**
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animation**: Framer Motion, GSAP
- **State Management**: Zustand
- **Content**: TypeScript-based Static Content System

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd jamalakbara-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
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
│   ├── 🎨 globals.css        # Global styles (Tailwind v4)
│   ├── 📱 layout.tsx         # Root layout
│   └── 🏠 page.tsx           # Main landing page
├── 📂 components/             # React components
│   ├── 🎭 ui/                # UI components (shadcn-like)
│   ├── 🌟 hero-section.tsx   # Hero section
│   ├── 🎢 project-carousel-3d.tsx # 3D Carousel component
│   ├── 🌊 liquid-background.tsx # Shader background
│   └── ...                   # Other sections and components
├── 📂 lib/                   # Utilities and Content
│   ├── 📝 static-content.ts  # CENTRAL CONTENT FILE
│   ├── 🏪 store.ts           # Zustand store
│   └── 🔧 utils.ts           # Helper functions
├── 📂 hooks/                 # Custom React hooks
└── 📂 public/                # Static assets
```

---

## 📝 Content Management

Unlike the previous version which used JSON files, this version uses a type-safe TypeScript file for content management.

**To update content, edit:** `lib/static-content.ts`

This file contains all the data for:
- Site Configuration
- Hero Section
- Services
- Projects (Featured & All)
- About Me
- Contact Info

Changes to this file will be reflected immediately in the application (thanks to Hot Module Replacement).

---

## 🎨 Features Deep Dive

### 🌟 **3D Visualization**

#### **React Three Fiber Integration**
We use `react-three-fiber` to render the 3D project carousel.
```typescript
<Canvas>
  <Suspense fallback={null}>
    <Carousel3D projects={projects} />
    <Environment preset="city" />
  </Suspense>
</Canvas>
```

### 🌊 **Shader Backgrounds**
Custom GLSL shaders are used for the liquid background effect, running efficiently on the GPU.

---

## 🚀 Development Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm start                # Start production server
npm run lint             # ESLint code quality check
```

---

## 🌍 Deployment

### 🚀 **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

## 🎉 **Thanks for checking out my portfolio!**

**⭐ Star this repo if it helped you!**

---

*Built by [jamalakbara](https://jamalakbara.com)*

</div>
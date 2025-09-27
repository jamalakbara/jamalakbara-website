# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern portfolio website built with Next.js 15, featuring advanced interactive animations, a file-based content management system, and a sophisticated UI/UX design. The project combines cutting-edge web technologies with creative development practices.

**Key Technologies:**
- Next.js 15 with App Router and Turbopack
- React 19 with TypeScript
- Tailwind CSS v4 with shadcn/ui components (New York style)
- Framer Motion for advanced animations
- File-based CMS with JSON storage
- PostgreSQL with Drizzle ORM (optional, for auth)
- Better Auth for authentication
- Docker support for deployment

## Development Commands

### Core Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Production build with Turbopack
- `npm start` - Production server
- `npm run lint` - ESLint

### Database (PostgreSQL - Optional)
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio GUI
- `npm run db:reset` - Reset database

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack
- `npm run docker:down` - Stop all containers

## Architecture Overview

### File-Based Content Management System
The project uses a sophisticated file-based CMS instead of a traditional database:

- **Content Storage**: JSON files in `/content/` directory
- **Content Types**: Defined in `lib/content-types.ts` with full TypeScript interfaces
- **Content Loading**: Managed through `lib/content-manager.ts`
- **Admin Interface**: Available at `/admin` for content editing
- **API Endpoints**: RESTful API in `/app/api/admin/content/` for CRUD operations

**Content Structure:**
```
/content/
├── site-config.json    # Brand, contact, social links
├── hero.json          # Homepage hero section
├── services.json      # Service offerings
├── projects.json      # Portfolio projects
├── about.json         # About section content
├── navigation.json    # Navigation menu items
└── cta.json          # Call-to-action section
```

### Component Architecture
The project follows a modular component structure:

```
components/
├── ui/                    # 52+ shadcn/ui components (New York style)
├── navigation.tsx         # Main navigation with scroll tracking
├── hero-section.tsx       # Landing section with animations
├── services-section.tsx   # Services display
├── featured-work-section.tsx # Portfolio showcase
├── about-section.tsx      # About content
├── cta-section.tsx        # Call-to-action
├── custom-cursor.tsx      # Interactive cursor effects
├── dynamic-background.tsx # Animated backgrounds
├── parallax-layers.tsx    # Parallax scrolling effects
└── velocity-effects.tsx   # Particle-based animations
```

### Advanced Animation System
The project features sophisticated animations using Framer Motion:

- **Custom Cursor**: Interactive cursor with magnetic effects
- **Parallax Layers**: Multi-layer parallax scrolling
- **Velocity Effects**: Particle-based animations
- **Dynamic Backgrounds**: Animated background elements
- **Scroll Animations**: Section-based scroll animations
- **Loading States**: Animated loading screens

### Theme System
- **Context-based theme management** in `contexts/theme-context.tsx`
- **Dark/light mode** with system preference detection
- **CSS variables** for consistent theming across components
- **next-themes** integration for theme persistence

## Key Development Patterns

### Content Loading Patterns
For client components:
```typescript
import { getStaticContent } from '@/lib/content-manager'
const services = getStaticContent.services()
```

For server components:
```typescript
import { ContentManager } from '@/lib/content-manager'
const services = await ContentManager.getServices()
```

### Animation Patterns
Use Framer Motion for all animations:
```typescript
import { motion } from 'framer-motion'
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### UI Component Usage
All components use shadcn/ui patterns:
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
```

## Database Integration (Optional)

While primarily file-based, the project includes PostgreSQL integration:
- **Drizzle ORM** for type-safe database operations
- **Better Auth** for authentication
- **Docker setup** for development database
- **Migration management** with Drizzle Kit

**Note**: The CMS can function entirely without the database - PostgreSQL is only needed for authentication features.

## Styling Guidelines

### Tailwind CSS v4
- Use Tailwind classes for all styling
- Leverage CSS variables for theming
- Follow responsive design patterns
- Use the established color palette

### Custom CSS
- Custom animations and effects in `app/globals.css`
- CSS custom properties for theme variables
- Import fonts: Inter, Space Mono, DM Serif Display

## File Structure Conventions

### Path Aliases
- `@/components` - React components
- `@/lib` - Utility functions and helpers
- `@/hooks` - Custom React hooks
- `@/contexts` - React contexts

### Component Organization
- UI components in `components/ui/`
- Section components in `components/`
- Utility functions in `lib/`
- Type definitions in `lib/content-types.ts`

## Admin Interface

Access the admin dashboard at `/admin` for:
- Content editing and management
- Real-time content preview
- Section-based content organization
- Form-based content editing

**Security Note**: The admin interface currently has no authentication - add auth for production use.

## Build and Deployment

### Development
```bash
npm run dev    # Development server with Turbopack
npm run build  # Production build
npm run lint   # ESLint
```

### Production
- Use `npm run build` for optimized production build
- Content files are included in the build
- Admin interface works in production
- File changes persist to server filesystem

### Docker Deployment
```bash
npm run docker:build  # Build Docker image
npm run docker:up     # Start full stack
```

## Testing and Quality

- **ESLint**: Run `npm run lint` to check code quality
- **TypeScript**: Strict mode enabled for type safety
- **Build Validation**: Build process validates all content and types
- **Content Validation**: JSON files validated against TypeScript interfaces

## Common Development Tasks

### Adding New Content Type
1. Define TypeScript interface in `lib/content-types.ts`
2. Create JSON file in `/content/`
3. Add loader function in `lib/content-manager.ts`
4. Update admin interface in `/app/admin/page.tsx`
5. Update API endpoint in `/app/api/admin/content/route.ts`

### Adding New Animations
1. Use Framer Motion for animations
2. Follow existing patterns in components
3. Test performance impact
4. Ensure responsive behavior

### Styling New Components
1. Use shadcn/ui components when possible
2. Follow established color palette
3. Use Tailwind classes for styling
4. Implement proper theme support

## Performance Considerations

- Content is loaded statically at build time
- Use `getStaticContent` for client components
- Implement proper image optimization
- Test animation performance on mobile devices
- Use CSS transforms for smooth animations
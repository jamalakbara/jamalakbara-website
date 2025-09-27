# Reusable Components Guide

## 📦 Komponen yang Telah Diabstraksi

Berikut adalah komponen-komponen reusable yang telah dibuat untuk meningkatkan konsistensi dan maintainability kode:

### 1. AnimatedButton
**Location:** `components/ui/animated-button.tsx`

Komponen button dengan animasi yang dapat dikonfigurasi untuk berbagai kebutuhan.

```tsx
import { AnimatedButton } from '@/components/ui/animated-button'

// Basic usage
<AnimatedButton variant="primary" size="md">
  Click Me
</AnimatedButton>

// With icons and loading state
<AnimatedButton 
  variant="cta" 
  size="lg"
  iconLeft={<Icon />}
  iconRight={<ArrowIcon />}
  isLoading={isSubmitting}
  hoverScale={1.1}
  tapScale={0.9}
>
  Submit Form
</AnimatedButton>

// With custom animation
<AnimatedButton
  customAnimation={{
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  }}
>
  Custom Animation
</AnimatedButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'cta'
- `size`: 'sm' | 'md' | 'lg'
- `hoverScale`: number (default: 1.05)
- `tapScale`: number (default: 0.95)
- `customAnimation`: Framer Motion variants
- `iconLeft/iconRight`: React nodes
- `isLoading`: boolean

---

### 2. SectionHeader
**Location:** `components/ui/section-header.tsx`

Komponen header section yang konsisten dengan animasi scroll.

```tsx
import { SectionHeader } from '@/components/ui/section-header'

// Basic usage
<SectionHeader
  title="About Me"
  subtitle="Introduction"
  description="Learn more about my background and experience"
/>

// With gradient title and divider
<SectionHeader
  title="My Services"
  titleVariant="gradient"
  alignment="center"
  showDivider={true}
  badge="What I Offer"
  customIcon={<ServiceIcon />}
/>
```

**Props:**
- `title`: string (required)
- `subtitle`: string
- `description`: string
- `alignment`: 'left' | 'center' | 'right'
- `titleVariant`: 'default' | 'gradient' | 'outlined'
- `showDivider`: boolean
- `badge`: string
- `customIcon`: React node

---

### 3. AnimatedContainer
**Location:** `components/ui/animated-container.tsx`

Container dengan animasi scroll dan stagger children.

```tsx
import { AnimatedContainer, AnimatedChild } from '@/components/ui/animated-container'

// Basic usage
<AnimatedContainer animation="fadeUp" className="my-section">
  <h2>Content here</h2>
</AnimatedContainer>

// With staggered children
<AnimatedContainer 
  animation="slideLeft" 
  staggerChildren={true}
  staggerDelay={0.2}
  viewportAmount={0.5}
>
  <AnimatedChild>First item</AnimatedChild>
  <AnimatedChild delay={0.1}>Second item</AnimatedChild>
  <AnimatedChild delay={0.2}>Third item</AnimatedChild>
</AnimatedContainer>

// Custom animation
<AnimatedContainer
  animation="custom"
  customVariants={{
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 }
  }}
>
  <div>Custom animated content</div>
</AnimatedContainer>
```

**Props:**
- `animation`: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'custom'
- `customVariants`: Framer Motion variants
- `staggerChildren`: boolean
- `staggerDelay`: number
- `viewportAmount`: number (0-1)
- `once`: boolean
- `delay`: number
- `duration`: number

---

### 4. GradientText
**Location:** `components/ui/gradient-text.tsx`

Text dengan gradient effects dan animasi.

```tsx
import { GradientText, AnimatedGradientText } from '@/components/ui/gradient-text'

// Static gradient text
<GradientText 
  gradient="primary" 
  as="h1"
  className="text-4xl font-bold"
>
  Beautiful Gradient Text
</GradientText>

// Animated gradient text
<AnimatedGradientText 
  gradient="secondary"
  delay={0.5}
  className="text-2xl"
>
  Animated Gradient
</AnimatedGradientText>

// Custom gradient with animation
<GradientText
  customGradient="from-red-500 to-blue-500"
  animated={true}
  animationType="shimmer"
  as="h2"
>
  Custom Gradient
</GradientText>
```

**Props:**
- `gradient`: 'primary' | 'secondary' | 'accent' | 'rainbow'
- `customGradient`: string (Tailwind gradient classes)
- `animated`: boolean
- `animationType`: 'flow' | 'shimmer' | 'pulse'
- `as`: HTML element type
- `delay`: number (for AnimatedGradientText)

---

### 5. Motion Variants Library
**Location:** `lib/motion-variants.ts`

Kumpulan variants yang dapat digunakan ulang untuk konsistensi animasi.

```tsx
import { 
  staggerContainerVariants, 
  childVariants,
  slideUpVariants,
  cardHoverVariants,
  buttonHoverVariants
} from '@/lib/motion-variants'

// In your component
<motion.div
  variants={staggerContainerVariants}
  initial="hidden"
  animate="visible"
>
  <motion.div variants={childVariants}>Child 1</motion.div>
  <motion.div variants={childVariants}>Child 2</motion.div>
</motion.div>

// Card with hover effect
<motion.div
  variants={cardHoverVariants}
  initial="rest"
  whileHover="hover"
>
  Card content
</motion.div>
```

**Available Variants:**
- `containerVariants`, `staggerContainerVariants`
- `childVariants`, `fadeInVariants`
- `slideUpVariants`, `slideLeftVariants`, `slideRightVariants`
- `scaleInVariants`, `scaleUpVariants`
- `buttonHoverVariants`, `buttonTapVariants`
- `cardHoverVariants`
- `textRevealVariants`, `letterVariants`
- `spinVariants`, `pulseVariants`
- `pageTransitionVariants`
- `modalVariants`, `overlayVariants`

---

## 🔄 Cara Refactor Komponen Existing

### Before (Tidak Reusable):
```tsx
// Di setiap component
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-white text-zinc-900 px-6 py-3 rounded-lg"
>
  Button Text
</motion.button>
```

### After (Menggunakan Reusable Component):
```tsx
<AnimatedButton variant="primary" size="md">
  Button Text
</AnimatedButton>
```

### Contoh Refactor Section Header:

**Before:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-center mb-16"
>
  <h3 className="text-zinc-400 mb-4">SUBTITLE</h3>
  <h2 className="text-6xl font-bold text-white">Title Here</h2>
  <p className="text-zinc-400 mt-6">Description here...</p>
</motion.div>
```

**After:**
```tsx
<SectionHeader
  title="Title Here"
  subtitle="SUBTITLE" 
  description="Description here..."
  alignment="center"
/>
```

---

## 📈 Keuntungan Menggunakan Komponen Reusable

1. **Konsistensi**: Semua animasi dan styling mengikuti pattern yang sama
2. **Maintainability**: Update satu tempat, semua komponen terupdate
3. **Developer Experience**: Props yang clear dan TypeScript support
4. **Performance**: Reuse variants dan animations
5. **Scalability**: Mudah menambah variant baru tanpa duplikasi kode
6. **Testing**: Lebih mudah test komponen yang terpusat

---

## 🚀 Next Steps

1. **Refactor existing components** untuk menggunakan reusable components ini
2. **Add more variants** sesuai kebutuhan design system
3. **Create Storybook** untuk dokumentasi visual komponen
4. **Add unit tests** untuk setiap reusable component
5. **Performance monitoring** untuk memastikan tidak ada regression
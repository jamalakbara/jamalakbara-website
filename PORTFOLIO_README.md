# Interactive Portfolio Website

Aplikasi portfolio yang dibangun sesuai dengan blueprint dari `summary.md` dengan implementasi lengkap fitur-fitur interaktif yang tactile dan modern.

## ✨ Fitur yang Diimplementasikan

### 1. **Custom Cursor** ✓
- Cursor custom yang expand saat hover di elemen interaktif
- Mix blend mode untuk effect yang elegan
- Smooth animation menggunakan Framer Motion

### 2. **Hero Section** ✓
- Tactile text animation dengan staggered motion
- Parallax effect saat scroll
- Interactive hover effects pada setiap kata
- Smooth scroll indicator

### 3. **Services/Expertise Section** ✓
- Interactive cards dengan on-scroll view animation
- Hover effects dengan shadow dan lift animation
- Grid layout responsif

### 4. **Featured Work Section** ✓
- Image hover tilt effect (rotateX, rotateY)
- Text reveal animation
- Project showcase dengan alternating layout
- Tech stack display dengan kategori

### 5. **About/Studio Section** ✓
- Horizontal marquee text animation
- Image parallax effect
- Statistics display
- Philosophy quote dengan styling khusus

### 6. **CTA Section** ✓
- Animated button dengan pulse effect
- Full-screen modal contact form
- Contact information display
- Animated background patterns

### 7. **Smooth Navigation** ✓
- Fixed navigation dengan active section detection
- Smooth scroll antar section
- Mobile-responsive navigation

## 🎨 Design System

### Color Palette (Monochrome)
- **Primary**: Pure White (`#FFFFFF`) & Pure Black (`#000000`)
- **Accent**: Light Gray (`#f5f5f5`) & Dark Gray (`#111827`)
- **Hover States**: Inverted colors untuk tactile effect

### Typography
- **Heading Font**: DM Serif Display (serif untuk character)
- **Body Font**: Inter (sans-serif untuk readability)
- **Mono Font**: Space Mono (untuk accent text)

## 🚀 Teknologi

- **Framework**: Next.js 15 dengan App Router
- **Styling**: Tailwind CSS v4 dengan custom color scheme
- **Animations**: Framer Motion untuk semua interaksi
- **UI Components**: Radix UI (shadcn/ui) sebagai base
- **Typography**: Next.js Google Fonts dengan font optimization
- **TypeScript**: Full type safety

## 📱 Fitur Responsif

- Responsive design untuk desktop, tablet, dan mobile
- Touch-friendly interaction untuk mobile
- Adaptive animations berdasarkan device capabilities

## 🎯 Interactive Elements

1. **Custom Cursor**: Mengikuti mouse dengan expand effect
2. **Staggered Text Animation**: Setiap kata di hero memiliki animasi individual
3. **Scroll-Based Animations**: Animasi triggered saat element masuk viewport
4. **Hover Effects**: Scale, rotate, dan color transitions
5. **Modal Interactions**: Contact form dengan spring animations
6. **Parallax Effects**: Background dan image parallax scrolling
7. **Marquee Animation**: Infinite horizontal text scroll

## 🛠️ Cara Menjalankan

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka di browser
http://localhost:3000
```

## 🔧 Customization

### Mengubah Content
- Edit teks di setiap component (`components/*.tsx`)
- Ganti project data di `featured-work-section.tsx`
- Update services di `services-section.tsx`

### Mengubah Styling
- Monochrome colors di `app/globals.css`
- Animation timing di individual components
- Font settings di `app/layout.tsx`

### Menambah Section
1. Buat component baru di `components/`
2. Import dan tambahkan ke `app/page.tsx`
3. Update navigation items di `components/navigation.tsx`

## 📋 Checklist Implementasi

- [x] Custom cursor dengan expand effect
- [x] Hero section dengan tactile text animation
- [x] Services section dengan interactive cards
- [x] Featured work dengan image hover tilt
- [x] About section dengan marquee dan parallax
- [x] CTA section dengan modal contact form
- [x] Smooth scrolling dan navigation
- [x] Monochrome color scheme
- [x] Typography setup (serif + sans-serif)
- [x] Responsive design
- [x] Framer Motion integration

Aplikasi portfolio ini sepenuhnya mengikuti blueprint dari `summary.md` dengan implementasi yang mencerminkan kualitas "tactile" dan interaktif seperti Studio Elio yang menjadi referensi.
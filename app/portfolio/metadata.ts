import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Showcase - Jamal Akbar Alam',
  description: 'Explore the complete portfolio of Jamal Akbar Alam featuring web development projects, UI/UX design work, mobile applications, and creative digital solutions built with modern technologies.',
  keywords: ['portfolio akbar', 'portfolio jamal akbar alam', 'web development portfolio', 'UI/UX design portfolio', 'creative developer portfolio', 'React projects', 'Next.js projects', 'full-stack development', 'Bandung Indonesia developer'],
  openGraph: {
    title: 'Portfolio Showcase - Jamal Akbar Alam',
    description: 'Complete portfolio of Jamal Akbar Alam - Creative developer and designer featuring innovative web development projects and digital solutions.',
    url: 'https://jamalakbara.com/portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio Showcase - Jamal Akbar Alam Creative Developer'
      }
    ]
  },
  alternates: {
    canonical: 'https://jamalakbara.com/portfolio'
  }
}
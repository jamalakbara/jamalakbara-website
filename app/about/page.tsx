import { Metadata } from 'next'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { AboutContent } from '@/components/about-content'

export const metadata: Metadata = {
  title: 'About Jamal Akbar Alam - Expert Full-Stack Developer in Bandung, Indonesia',
  description: 'Learn about Jamal Akbar Alam, an expert full-stack developer and UI/UX designer based in Bandung, Indonesia, with 5+ years of experience in web development, mobile apps, and Indonesian market integration.',
  keywords: ['jamal akbar alam', 'about jamal akbar', 'full-stack developer bandung', 'ui/ux designer indonesia', 'web developer indonesia', 'indonesian tech expert'],
  openGraph: {
    title: 'About Jamal Akbar Alam - Expert Developer in Bandung',
    description: 'Expert full-stack developer and UI/UX designer specializing in Indonesian digital solutions with 5+ years of experience.',
    url: 'https://jamalakbara.com/about',
    type: 'profile'
  }
}

export default function AboutPage() {
  return (
    <>
      <StructuredData type="Person" />
      <CustomCursor />
      <main className="min-h-screen bg-white dark:bg-black font-sans antialiased transition-colors duration-300">
        <AboutContent />
      </main>
    </>
  )
}
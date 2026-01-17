'use client'

import { getStaticContent } from '@/lib/static-content'
import { motion, Variants } from 'framer-motion'
import { MapPin, Mail, Phone, Award, Users, Code, ArrowRight } from 'lucide-react'
import { CTASection } from '@/components/cta-section'
import { DistortedImage } from '@/components/distorted-image'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { CounterAnimated } from '@/components/ui/counter-animated'

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] // Custom ease for snappier feel
    }
  }
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

export function AboutContent() {
  const about = getStaticContent.comprehensiveAbout()

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-32">
        {/* Massive Hero Section */}
        <motion.section
          className="mb-32 flex flex-col items-center justify-center min-h-[50vh]"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="text-center relative z-10" variants={fadeInUp}>
            <h1 className="font-bold tracking-tighter leading-[0.85] uppercase mb-12 flex flex-col items-center justify-center select-none">
              <div className="overflow-hidden mb-2 md:mb-4">
                <span className="block text-[15vw] md:text-[12vw] lg:text-[10vw] text-white mix-blend-difference">
                  JAMAL
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="block text-[15vw] md:text-[12vw] lg:text-[10vw] text-transparent"
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>
                  AKBAR
                </span>
              </div>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-sans max-w-2xl mx-auto tracking-wide">
              {about.heading.subtitle}
            </p>
          </motion.div>
        </motion.section>

        {/* Professional Summary Section */}
        <motion.section
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-7 space-y-8">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">
                  Professional Summary
                </h2>
                <div className="space-y-6 text-lg text-gray-400 leading-relaxed font-sans">
                  {about.professionalSummary.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="md:col-span-5 relative mt-8 md:mt-0">
                <div className="aspect-[4/5] w-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <DistortedImage
                    src="/profile-image.png"
                    alt="Jamal Akbar Alam"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Stats Section: "Digital Pulse" */}
        <motion.section
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {about.stats.map((stat, index) => {
                // Extract numeric part for animation
                const numValue = parseInt(stat.value.replace(/\D/g, '')) || 0;
                const suffix = stat.value.replace(/[0-9]/g, '');

                return (
                  <SpotlightCard
                    key={index}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center group"
                    spotlightColor="rgba(255, 255, 255, 0.1)"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif group-hover:scale-110 transition-transform duration-300">
                      <CounterAnimated to={numValue} />{suffix}
                    </div>
                    <div className="text-sm font-sans font-medium text-gray-300 mb-1">
                      {stat.label}
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </motion.div>
        </motion.section>

        {/* Technical Expertise: "Interactive Bento Grid" */}
        <motion.section
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white flex items-center gap-4">
              <Code className="h-8 w-8 md:h-12 md:w-12 text-white" />
              {about.expertise.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {about.expertise.areas.map((area, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`${index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-1"}`}
              >
                <SpotlightCard className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors group">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white font-sans group-hover:translate-x-2 transition-transform">
                      {area.name}
                    </h3>
                    <span className="text-xs font-mono px-3 py-1 bg-white/10 rounded-full text-white border border-white/10">
                      {area.yearsExperience} YEARS
                    </span>
                  </div>

                  <p className="text-gray-400 mb-6 leading-relaxed text-sm md:text-base">
                    {area.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {area.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2 py-1 bg-black/20 text-gray-300 border border-white/5 rounded-md hover:bg-white/10 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technical Process: "The Methodology Pipeline" */}
        <motion.section
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              {about.technicalProcess.title}
            </h2>
            <div className="h-1 w-24 bg-white/20 rounded-full" />
          </motion.div>

          {/* Tech Stack Only - Enhanced Grid Layout */}
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(about.technicalProcess.technologies).map(([category, techs], index) => (
                <motion.div
                  key={category}
                  variants={fadeInUp}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
                >
                  <h4 className="text-lg font-bold text-white mb-4 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {techs.map(tech => (
                      <span key={tech} className="px-2.5 py-1 bg-black/20 border border-white/5 rounded-md text-xs font-mono text-gray-300 group-hover:border-white/20 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>



        {/* Education & Contact Grid */}
        <motion.section
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Education */}
            <SpotlightCard className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
              <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                <Award className="w-6 h-6" /> {about.education.title}
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">{about.education.details}</p>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Certifications</h3>
                  <ul className="space-y-2">
                    {about.education.certifications.map((c, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SpotlightCard>

            {/* Contact & Location */}
            <div className="space-y-8">
              <SpotlightCard className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6" /> {about.location.title}
                </h2>
                <p className="text-gray-400 mb-4">{about.location.description}</p>
                <div className="flex flex-wrap gap-2">
                  {about.location.serviceAreas.map(area => (
                    <span key={area} className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300 font-mono">{area}</span>
                  ))}
                </div>
              </SpotlightCard>

              <SpotlightCard className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-serif font-bold text-white mb-6">Get In Touch</h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                    <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/20 transition-colors"><Mail className="w-4 h-4" /></div>
                    {about.contact.email}
                  </li>
                  <li className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                    <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/20 transition-colors"><Phone className="w-4 h-4" /></div>
                    {about.contact.phone}
                  </li>
                  <li className="flex items-center gap-4 text-gray-300">
                    <div className="p-2 bg-white/5 rounded-full"><Users className="w-4 h-4" /></div>
                    {about.contact.availability}
                  </li>
                </ul>
              </SpotlightCard>
            </div>
          </div>
        </motion.section>

      </div>
      <CTASection />
    </>
  )
}
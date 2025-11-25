'use client'

import { getStaticContent } from '@/lib/content-manager'
import { motion, Variants } from 'framer-motion'
import { MapPin, Mail, Phone, Award, Users, Code, Globe } from 'lucide-react'
import { CTASection } from '@/components/cta-section'

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

export function AboutContent() {
  const about = getStaticContent.comprehensiveAbout()

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* Professional Summary Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-black dark:text-white mb-6">
              {about.heading.main}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-sans mb-8">
              {about.heading.subtitle}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-8">
                Professional Summary
              </h2>
              <div className="space-y-6">
                {about.professionalSummary.map((paragraph, index) => (
                  <p key={index} className="text-lg text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-12 text-center">
                Key Performance Metrics
              </h2>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
                {about.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center flex flex-col items-center min-w-[120px] sm:min-w-[140px]"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-sans font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {stat.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Technical Expertise Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-8 flex items-center gap-4">
                <Code className="h-8 w-8 text-black dark:text-white" />
                {about.expertise.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {about.expertise.areas.map((area, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 space-y-4 transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-sans font-semibold text-lg text-black dark:text-white">
                        {area.name}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-mono px-2 py-1 ${area.proficiencyLevel === 'Expert'
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-white/40 dark:bg-black/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10'
                          }`}>
                          {area.proficiencyLevel}
                        </span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {area.yearsExperience} years
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                      {area.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {area.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-1 bg-white/40 dark:bg-black/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Technical Process Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-12">
                {about.technicalProcess.title}
              </h2>
              <div className="space-y-12">
                <div>
                  <h3 className="font-sans font-semibold text-xl text-black dark:text-white mb-6">
                    Development Methodology
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {about.technicalProcess.methodology.map((method, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-4"
                        variants={fadeInUp}
                      >
                        <div className="w-2 h-2 bg-black dark:bg-white  mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-sans">
                          {method}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-sans font-semibold text-xl text-black dark:text-white mb-6">
                    Technology Stack
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(about.technicalProcess.technologies).map(([category, techs]) => (
                      <motion.div
                        key={category}
                        variants={fadeInUp}
                        className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-4 transition-all duration-300 hover:border-black dark:hover:border-white"
                      >
                        <h4 className="font-sans font-medium text-black dark:text-white mb-4 capitalize">
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {techs.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs font-mono px-2 py-1 bg-white/40 dark:bg-black/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Indonesian Market Expertise Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-8 flex items-center gap-4">
                <Globe className="h-8 w-8 text-black dark:text-white" />
                {about.indonesianMarketExpertise.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-sans mb-12 leading-relaxed">
                {about.indonesianMarketExpertise.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {about.indonesianMarketExpertise.specializations.map((specialization, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 space-y-6 transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-sans font-semibold text-lg text-black dark:text-white">
                      {specialization.sector}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                      {specialization.description}
                    </p>
                    <div>
                      <h4 className="font-sans font-medium text-black dark:text-white mb-3">
                        Key Achievements
                      </h4>
                      <div className="space-y-3">
                        {specialization.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-green-500  mt-2 flex-shrink-0" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-sans">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Success Stories Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-12">
                {about.successStories.title}
              </h2>
              <div className="space-y-8">
                {about.successStories.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 space-y-6 transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-sans font-semibold text-lg text-black dark:text-white">
                          {project.client}
                        </h3>
                        <span className="text-xs font-mono px-2 py-1 bg-white/40 dark:bg-black/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10 mt-2 inline-block">
                          {project.industry}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-sans font-medium text-sm text-black dark:text-white mb-2">
                            Challenge
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
                            {project.challenge}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-sans font-medium text-sm text-black dark:text-white mb-2">
                            Solution
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
                            {project.solution}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-sans font-medium text-sm text-black dark:text-white mb-2">
                            Results
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-sans font-semibold">
                            {project.results}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-sans font-medium text-sm text-black dark:text-white mb-2">
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs font-mono px-2 py-1 bg-white/40 dark:bg-black/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Education & Location Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div variants={fadeInUp}>
              <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-black dark:text-white mb-8 flex items-center gap-4">
                  <Award className="h-6 w-6 text-black dark:text-white" />
                  {about.education.title}
                </h2>
                <div className="space-y-8">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                    {about.education.details}
                  </p>

                  <div>
                    <h3 className="font-sans font-medium text-black dark:text-white mb-4">
                      Professional Certifications
                    </h3>
                    <div className="space-y-3">
                      {about.education.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 " />
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-sans">
                            {cert}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-sans font-medium text-black dark:text-white mb-4">
                      Continuous Learning
                    </h3>
                    <div className="space-y-3">
                      {about.education.continuousLearning.map((learning, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 " />
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-sans">
                            {learning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              <motion.div variants={fadeInUp}>
                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-black dark:text-white mb-8 flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-black dark:text-white" />
                    {about.location.title}
                  </h2>
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                      {about.location.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {about.location.serviceAreas.map((area) => (
                        <span
                          key={area}
                          className="text-xs font-mono px-2 py-1 bg-white/40 dark:bg-black/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 transition-all duration-300 hover:border-black dark:hover:border-white">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-black dark:text-white mb-8">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-sm">
                      <Mail className="h-4 w-4 text-black dark:text-white" />
                      <span className="text-gray-600 dark:text-gray-400 font-sans">
                        {about.contact.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Phone className="h-4 w-4 text-black dark:text-white" />
                      <span className="text-gray-600 dark:text-gray-400 font-sans">
                        {about.contact.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Users className="h-4 w-4 text-black dark:text-white" />
                      <span className="text-gray-600 dark:text-gray-400 font-sans">
                        {about.contact.availability}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
      <CTASection />
    </>
  )
}
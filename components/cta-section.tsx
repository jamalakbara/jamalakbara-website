'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Scroll-based animations for stacking effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 0.5], [200, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0])

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <>
      <motion.section 
        id="contact"
        className="pt-20 pb-16 md:pb-24 px-4 bg-black dark:bg-white text-white dark:text-black relative overflow-hidden min-h-[85vh] z-10 rounded-t-3xl shadow-2xl transition-colors duration-300"
        ref={ref}
        style={{ y, scale, opacity, rotateX }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 pb-safe">
          
          {/* Main CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span>Let&apos;s Create</span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-gray-300"
              >
                Something Amazing
              </motion.span>
            </motion.h2>

            <motion.p 
              className="text-lg md:text-xl text-gray-300 font-sans max-w-xl mx-auto mb-8 leading-normal"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Ready to transform your ideas into reality? Let&apos;s discuss your next project 
              and create something that stands out from the crowd.
            </motion.p>

            {/* Animated CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "#fff",
                  color: "#000",
                  boxShadow: "0 20px 40px rgba(255,255,255,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="group relative px-10 py-4 border-2 border-white text-white font-sans font-medium text-lg transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Start a Project</span>
                
                {/* Button background animation */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="mt-20 pt-12 border-t border-gray-700 relative z-10 mb-20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="relative">
                <div className="text-lg font-serif font-bold mb-2">Email</div>
                <div className="text-gray-400 font-mono">hello@yourname.com</div>
              </div>
              <div className="relative">
                <div className="text-lg font-serif font-bold mb-2">Phone</div>
                <div className="text-gray-400 font-mono">+1 (555) 123-4567</div>
              </div>
              <div className="relative">
                <div className="text-lg font-serif font-bold mb-2">Location</div>
                <div className="text-gray-400 font-mono">San Francisco, CA</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[9999]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-serif font-bold text-black">
                Let&apos;s Start Something Great
              </DialogTitle>
            </DialogHeader>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-medium text-black mb-2">
                    First Name
                  </label>
                  <Input 
                    className="border-2 border-gray-300 focus:border-black"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-black mb-2">
                    Last Name
                  </label>
                  <Input 
                    className="border-2 border-gray-300 focus:border-black"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-sans font-medium text-black mb-2">
                  Email
                </label>
                <Input 
                  type="email"
                  className="border-2 border-gray-300 focus:border-black"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-sans font-medium text-black mb-2">
                  Project Details
                </label>
                <Textarea 
                  className="border-2 border-gray-300 focus:border-black min-h-[120px]"
                  placeholder="Tell me about your project..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-800 font-sans font-medium"
                >
                  Send Message
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-black text-black hover:bg-black hover:text-white font-sans font-medium"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save, FileText, Settings, Users, Briefcase, Info } from 'lucide-react'
import { CustomCursor } from '@/components/custom-cursor'

// Content interfaces
import type {
  Service,
  Project,
  NavigationItem,
  AboutContent,
  SiteConfig,
  HeroContent,
  CTAContent
} from '@/lib/content-types'

// Wrapper components with cursor styling

// Tidak perlu wrapper khusus, gunakan Input dan Textarea asli

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  
  // Content states
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [navigation, setNavigation] = useState<NavigationItem[]>([])
  const [ctaContent, setCTAContent] = useState<CTAContent | null>(null)

  // Load content on mount
  useEffect(() => {
    loadAllContent()
    // Add admin-page class to body
    document.body.classList.add('admin-page')
    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [])

  const loadAllContent = async () => {
    try {
      // Load all content files via API
      const contentTypes = ['site-config', 'hero', 'services', 'projects', 'about', 'navigation', 'cta']
      const responses = await Promise.all(
        contentTypes.map(type => fetch(`/api/admin/content?type=${type}`))
      )
      
      const [siteRes, heroRes, servicesRes, projectsRes, aboutRes, navRes, ctaRes] = await Promise.all(
        responses.map(res => res.json())
      )

      setSiteConfig(siteRes.data)
      setHeroContent(heroRes.data)
      setServices(servicesRes.data)
      setProjects(projectsRes.data)
      setAboutContent(aboutRes.data)
      setNavigation(navRes.data)
      setCTAContent(ctaRes.data)
    } catch (error) {
      console.error('Error loading content:', error)
      setSaveStatus('error')
    }
  }

  const saveContent = async (type: string, content: unknown) => {
    setSaveStatus('saving')
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, content }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${type}`)
      }

      const result = await response.json()
      console.log('Save result:', result)
      
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Error saving content:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <style jsx global>{`
        body {
          cursor: none !important;
        }
      `}</style>
      <CustomCursor />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your portfolio content from one central location
          </p>
        </div>

        {/* Save Status Alert */}
        {saveStatus !== 'idle' && (
          <Alert className={`mb-6 ${saveStatus === 'saved' ? 'border-green-500' : saveStatus === 'error' ? 'border-red-500' : ''}`}>
            <AlertDescription>
              {saveStatus === 'saving' && 'Saving changes...'}
              {saveStatus === 'saved' && 'Changes saved successfully!'}
              {saveStatus === 'error' && 'Error saving changes. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Content Management Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="site" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Site
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Site Configuration
                  </CardTitle>
                  <CardDescription>Brand name, contact info, and social links</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Brand: {siteConfig?.brand.name || 'Loading...'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email: {siteConfig?.contact.email || 'Loading...'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Services
                  </CardTitle>
                  <CardDescription>Your service offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {services.length} services configured
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {services.slice(0, 3).map((service) => (
                      <Badge key={service.id} variant="secondary" className="text-xs">
                        {service.title}
                      </Badge>
                    ))}
                    {services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Projects
                  </CardTitle>
                  <CardDescription>Your portfolio projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {projects.length} projects total
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {projects.filter(p => p.featured).length} featured projects
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common content management tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => setActiveTab('services')}>
                  Add New Service
                </Button>
                <Button onClick={() => setActiveTab('projects')} variant="outline">
                  Add New Project
                </Button>
                <Button onClick={() => loadAllContent()} variant="outline">
                  Refresh All Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Configuration Tab */}
          <TabsContent value="site" className="space-y-6">
            {siteConfig && (
              <Card>
                <CardHeader>
                  <CardTitle>Site Configuration</CardTitle>
                  <CardDescription>Manage your site&apos;s basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand-name">Brand Name</Label>
                      <Input
                        id="brand-name"
                        value={siteConfig.brand.name}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          brand: { ...siteConfig.brand, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="short-name">Short Name</Label>
                      <Input
                        id="short-name"
                        value={siteConfig.brand.shortName}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          brand: { ...siteConfig.brand, shortName: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={siteConfig.brand.tagline}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        brand: { ...siteConfig.brand, tagline: e.target.value }
                      })}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={siteConfig.contact.email}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          contact: { ...siteConfig.contact, email: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={siteConfig.contact.location}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          contact: { ...siteConfig.contact, location: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => saveContent('site-config', siteConfig)}
                    disabled={saveStatus === 'saving'}
                    className="w-full md:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Site Configuration
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Hero Content Tab */}
          <TabsContent value="hero" className="space-y-6">
            {heroContent && (
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Manage your homepage hero content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="greeting">Greeting</Label>
                      <Input
                        id="greeting"
                        value={heroContent.greeting}
                        onChange={(e) => setHeroContent({
                          ...heroContent,
                          greeting: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={heroContent.name}
                        onChange={(e) => setHeroContent({
                          ...heroContent,
                          name: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={heroContent.title}
                      onChange={(e) => setHeroContent({
                        ...heroContent,
                        title: e.target.value
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={heroContent.description}
                      onChange={(e) => setHeroContent({
                        ...heroContent,
                        description: e.target.value
                      })}
                    />
                  </div>

                  <Button 
                    onClick={() => saveContent('hero', heroContent)}
                    disabled={saveStatus === 'saving'}
                    className="w-full md:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Hero Content
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Manage your service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={service.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Service {index + 1}</h3>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={service.title}
                            onChange={(e) => {
                              const newServices = [...services]
                              newServices[index] = { ...service, title: e.target.value }
                              setServices(newServices)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Input
                            value={service.icon}
                            onChange={(e) => {
                              const newServices = [...services]
                              newServices[index] = { ...service, icon: e.target.value }
                              setServices(newServices)
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={service.description}
                          onChange={(e) => {
                            const newServices = [...services]
                            newServices[index] = { ...service, description: e.target.value }
                            setServices(newServices)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => saveContent('services', services)}
                  disabled={saveStatus === 'saving'}
                  className="w-full md:w-auto mt-4"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Services
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Project {index + 1}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{project.category}</Badge>
                          {project.featured && <Badge>Featured</Badge>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={project.title}
                            onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[index] = { ...project, title: e.target.value }
                              setProjects(newProjects)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            value={project.category}
                            onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[index] = { ...project, category: e.target.value }
                              setProjects(newProjects)
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={project.description}
                          onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[index] = { ...project, description: e.target.value }
                            setProjects(newProjects)
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            value={project.year}
                            onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[index] = { ...project, year: e.target.value }
                              setProjects(newProjects)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>URL</Label>
                          <Input
                            value={project.url || ''}
                            onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[index] = { ...project, url: e.target.value }
                              setProjects(newProjects)
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Technologies (comma separated)</Label>
                        <Input
                          value={project.tech.join(', ')}
                          onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[index] = { 
                              ...project, 
                              tech: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                            }
                            setProjects(newProjects)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => saveContent('projects', projects)}
                  disabled={saveStatus === 'saving'}
                  className="w-full md:w-auto mt-4"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Projects
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {aboutContent && (
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Manage your about section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Main Heading</Label>
                      <Input
                        value={aboutContent.heading.main}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          heading: { ...aboutContent.heading, main: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={aboutContent.heading.subtitle}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          heading: { ...aboutContent.heading, subtitle: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Description Paragraphs</Label>
                    {aboutContent.description.map((paragraph, index) => (
                      <Textarea
                        key={index}
                        rows={3}
                        value={paragraph}
                        onChange={(e) => {
                          const newDescription = [...aboutContent.description]
                          newDescription[index] = e.target.value
                          setAboutContent({
                            ...aboutContent,
                            description: newDescription
                          })
                        }}
                        placeholder={`Paragraph ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Label>Statistics</Label>
                    {aboutContent.stats.map((stat, index) => (
                      <div key={index} className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Value</Label>
                          <Input
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...aboutContent.stats]
                              newStats[index] = { ...stat, value: e.target.value }
                              setAboutContent({
                                ...aboutContent,
                                stats: newStats
                              })
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...aboutContent.stats]
                              newStats[index] = { ...stat, label: e.target.value }
                              setAboutContent({
                                ...aboutContent,
                                stats: newStats
                              })
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={stat.description}
                            onChange={(e) => {
                              const newStats = [...aboutContent.stats]
                              newStats[index] = { ...stat, description: e.target.value }
                              setAboutContent({
                                ...aboutContent,
                                stats: newStats
                              })
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => saveContent('about', aboutContent)}
                    disabled={saveStatus === 'saving'}
                    className="w-full md:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save About Content
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
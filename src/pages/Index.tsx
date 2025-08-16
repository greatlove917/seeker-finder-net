
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Users, Briefcase, TrendingUp, Building2 } from "lucide-react"
import { AuthModal } from '@/components/AuthModal'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { JobSearch } from '@/components/JobSearch'
import { JobCard } from '@/components/JobCard'
import { useJobs } from '@/hooks/useJobs'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

const IndexContent = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [searchFilters, setSearchFilters] = useState<any>({})
  const { user, signOut, loading: authLoading } = useAuth()
  const { jobs, loading: jobsLoading } = useJobs()
  const { toast } = useToast()

  const handleJobSearch = (filters: any) => {
    setSearchFilters(filters)
    // Here you would implement the actual search logic
    console.log('Search filters:', filters)
  }

  const handleApplyToJob = async (jobId: string) => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          talent_id: user.id,
          status: 'pending'
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Your application has been submitted!'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive'
      })
    }
  }

  const handleSaveJob = async (jobId: string) => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          job_id: jobId,
          talent_id: user.id
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Job saved to your favorites!'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save job',
        variant: 'destructive'
      })
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JobOpportunity</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Find Jobs</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Companies</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Resources</a>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setAuthModalOpen(true)}>
                    Sign In
                  </Button>
                  <Button onClick={() => setAuthModalOpen(true)}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          
          {/* Job Search Component */}
          <div className="max-w-4xl mx-auto mb-12">
            <JobSearch onSearch={handleJobSearch} />
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-xl text-gray-600">Discover the latest job openings from top companies</p>
          </div>
          
          {jobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApplyToJob}
                  onSave={handleSaveJob}
                />
              ))}
            </div>
          )}
          
          {jobs.length === 0 && !jobsLoading && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No jobs available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Briefcase className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-600">Job Seekers</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Building2 className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1,000+</h3>
              <p className="text-gray-600">Companies</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">JobOpportunity</span>
              </div>
              <p className="text-gray-400">
                Connecting talented professionals with amazing opportunities worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Career Advice</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Post Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Find Talent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 JobOpportunity. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  )
}

export default Index

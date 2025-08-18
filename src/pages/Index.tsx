
import { useState, useEffect } from 'react'
import { JobCard } from '@/components/JobCard'
import { JobSearch } from '@/components/JobSearch'
import { JobFilters } from '@/components/JobFilters'
import { SavedJobsList } from '@/components/SavedJobsList'
import { ApplicationsList } from '@/components/ApplicationsList'
import { useJobs } from '@/hooks/useJobs'
import { useJobSearch } from '@/hooks/useJobSearch'
import { useAuth } from '@/hooks/useAuth'
import { useEmployerJobs } from '@/hooks/useEmployerJobs'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Heart, FileText, Users, MapPin, Building, Plus } from 'lucide-react'

export default function Index() {
  const { jobs: allJobs, loading: jobsLoading } = useJobs()
  const { searchResults, loading: searchLoading, searchJobs, clearResults } = useJobSearch()
  const { user } = useAuth()
  const { jobs: employerJobs, loading: employerJobsLoading, updateJobStatus } = useEmployerJobs()
  const [activeTab, setActiveTab] = useState('browse')
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const displayJobs = hasSearched ? searchResults : allJobs
  const loading = hasSearched ? searchLoading : jobsLoading

  const handleSearch = async (filters: any) => {
    setHasSearched(true)
    await searchJobs(filters)
  }

  const handleClearSearch = () => {
    setHasSearched(false)
    clearResults()
  }

  const handleFiltersChange = (filters: any) => {
    if (hasSearched) {
      // Apply filters to current search
      searchJobs({ 
        query: '', 
        location: '', 
        jobType: '', 
        category: '', 
        remoteOnly: false,
        ...filters 
      })
    }
  }

  const handleJobStatusChange = async (jobId: string, status: string) => {
    await updateJobStatus(jobId, status as 'draft' | 'active' | 'closed')
  }

  // Stats for different user types
  const getJobStats = () => {
    if (!user) return null

    const stats = [
      {
        title: 'Available Jobs',
        value: allJobs.length,
        icon: Briefcase,
        description: 'Active job postings'
      },
      {
        title: 'Remote Opportunities',
        value: allJobs.filter(job => job.remote_allowed).length,
        icon: MapPin,
        description: 'Remote-friendly positions'
      },
      {
        title: 'Companies Hiring',
        value: new Set(allJobs.map(job => job.company_id)).size,
        icon: Building,
        description: 'Unique companies'
      }
    ]

    return stats
  }

  const stats = getJobStats()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
            <p className="text-xl text-gray-600 mb-8">Connect with top employers and discover opportunities that match your skills</p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Sign Up as Job Seeker</Button>
              <Button variant="outline" size="lg">Post Jobs as Employer</Button>
            </div>
          </div>

          {/* Public job search */}
          <div className="mb-8">
            <JobSearch onSearch={handleSearch} />
          </div>

          {/* Job listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {!loading && displayJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
              />
            ))}
          </div>

          {!loading && displayJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No jobs found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening in your job search</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Jobs
            </TabsTrigger>
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="browse">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="space-y-4">
                <JobSearch onSearch={handleSearch} />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    
                    {hasSearched && (
                      <Button variant="ghost" onClick={handleClearSearch}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {displayJobs.length} jobs found
                  </div>
                </div>
              </div>

              {/* Filters and Results */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {showFilters && (
                  <div className="lg:col-span-1">
                    <JobFilters onFiltersChange={handleFiltersChange} />
                  </div>
                )}
                
                <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading && (
                      [...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 rounded w-full"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                    
                    {!loading && displayJobs.map((job) => (
                      <JobCard 
                        key={job.id} 
                        job={job}
                      />
                    ))}
                  </div>

                  {!loading && displayJobs.length === 0 && (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {hasSearched ? 'No jobs found matching your criteria.' : 'No jobs available at the moment.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved">
            <SavedJobsList />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <ApplicationsList />
          </TabsContent>

          {/* Manage Jobs Tab (For Employers) */}
          <TabsContent value="manage">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Your Job Postings</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {employerJobsLoading && (
                  [...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                
                {!employerJobsLoading && employerJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    showEmployerActions={true}
                    onStatusChange={handleJobStatusChange}
                  />
                ))}
              </div>

              {!employerJobsLoading && employerJobs.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven't posted any jobs yet</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

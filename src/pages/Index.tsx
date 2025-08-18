
import { useState, useEffect } from 'react'
import { EnhancedJobCard } from '@/components/EnhancedJobCard'
import { JobPostingModal } from '@/components/JobPostingModal'
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
import { Briefcase, Heart, FileText, Users, MapPin, Building, Plus, TrendingUp, DollarSign, Target } from 'lucide-react'

export default function Index() {
  const { jobs: allJobs, loading: jobsLoading } = useJobs()
  const { searchResults, loading: searchLoading, searchJobs, clearResults } = useJobSearch()
  const { user } = useAuth()
  const { jobs: employerJobs, loading: employerJobsLoading, updateJobStatus } = useEmployerJobs()
  const [activeTab, setActiveTab] = useState('browse')
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showJobPostingModal, setShowJobPostingModal] = useState(false)

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

  // Enhanced stats calculation
  const getJobStats = () => {
    if (!user) {
      const avgSalary = allJobs.reduce((acc, job) => {
        const salary = (job.salary_min || 0) + (job.salary_max || 0)
        return acc + (salary / 2)
      }, 0) / allJobs.length

      return [
        {
          title: 'Active Jobs',
          value: allJobs.length,
          icon: Briefcase,
          description: 'Available positions',
          gradient: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Avg Salary',
          value: `$${Math.round(avgSalary / 1000)}K`,
          icon: DollarSign,
          description: 'Average compensation',
          gradient: 'from-green-500 to-green-600'
        },
        {
          title: 'Remote Jobs',
          value: allJobs.filter(job => job.remote_allowed).length,
          icon: MapPin,
          description: 'Remote opportunities',
          gradient: 'from-purple-500 to-purple-600'
        }
      ]
    }

    return [
      {
        title: 'Available Jobs',
        value: allJobs.length,
        icon: Briefcase,
        description: 'Active job postings',
        gradient: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Remote Opportunities',
        value: allJobs.filter(job => job.remote_allowed).length,
        icon: MapPin,
        description: 'Remote-friendly positions',
        gradient: 'from-green-500 to-green-600'
      },
      {
        title: 'Companies Hiring',
        value: new Set(allJobs.map(job => job.company_id)).size,
        icon: Building,
        description: 'Unique companies',
        gradient: 'from-purple-500 to-purple-600'
      }
    ]
  }

  const stats = getJobStats()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with top employers and discover opportunities that match your skills and aspirations
            </p>
            <div className="flex justify-center gap-6">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                Sign Up as Job Seeker
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                onClick={() => setShowJobPostingModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Post Jobs as Employer
              </Button>
            </div>
          </div>

          {/* Stats for public view */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Public job search */}
          <div className="mb-8">
            <JobSearch onSearch={handleSearch} />
          </div>

          {/* Job listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading && (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
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
              <EnhancedJobCard 
                key={job.id} 
                job={job}
              />
            ))}
          </div>

          {!loading && displayJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No jobs found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
        
        <JobPostingModal 
          open={showJobPostingModal} 
          onOpenChange={setShowJobPostingModal} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening in your job search journey</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="browse" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <Heart className="h-4 w-4" />
              Saved Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <FileText className="h-4 w-4" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Users className="h-4 w-4" />
              Manage Jobs
            </TabsTrigger>
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="browse">
            <div className="space-y-6">
              <div className="space-y-4">
                <JobSearch onSearch={handleSearch} />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="hover:bg-blue-50"
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    
                    {hasSearched && (
                      <Button variant="ghost" onClick={handleClearSearch} className="hover:bg-red-50">
                        Clear Search
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {displayJobs.length} jobs found
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {showFilters && (
                  <div className="lg:col-span-1">
                    <JobFilters onFiltersChange={handleFiltersChange} />
                  </div>
                )}
                
                <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {loading && (
                      [...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse border-0 shadow-lg">
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
                      <EnhancedJobCard 
                        key={job.id} 
                        job={job}
                      />
                    ))}
                  </div>

                  {!loading && displayJobs.length === 0 && (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        {hasSearched ? 'No jobs found matching your criteria.' : 'No jobs available at the moment.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <SavedJobsList />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsList />
          </TabsContent>

          <TabsContent value="manage">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Manage Your Job Postings</h2>
                <Button 
                  onClick={() => setShowJobPostingModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post New Job
                </Button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {employerJobsLoading && (
                  [...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-0 shadow-lg">
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
                  <EnhancedJobCard 
                    key={job.id} 
                    job={job}
                    showEmployerActions={true}
                    onStatusChange={handleJobStatusChange}
                  />
                ))}
              </div>

              {!employerJobsLoading && employerJobs.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4 text-lg">You haven't posted any jobs yet</p>
                    <Button 
                      onClick={() => setShowJobPostingModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Post Your First Job
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <JobPostingModal 
        open={showJobPostingModal} 
        onOpenChange={setShowJobPostingModal} 
      />
    </div>
  )
}

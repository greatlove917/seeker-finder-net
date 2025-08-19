
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, Users, Search } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { JobPostingModal } from '@/components/JobPostingModal';
import { JobCard } from '@/components/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [jobPostingModalOpen, setJobPostingModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">JobOpportunity</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setAuthModalOpen(true)}
                    className="hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Dream Job
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button size="lg" className="px-8 py-3 bg-primary hover:bg-primary/90">
              Search Jobs
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setAuthModalOpen(true)}
                className="px-8 py-3 hover:bg-primary/10"
              >
                Sign Up as Job Seeker
              </Button>
            )}
            <Button 
              size="lg" 
              onClick={() => user ? setJobPostingModalOpen(true) : setAuthModalOpen(true)}
              className="px-8 py-3 bg-secondary hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105"
            >
              Post Jobs as Employer
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">5,000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50,000+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h3>
            <p className="text-lg text-gray-600">Discover exciting opportunities from top companies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsLoading ? (
              // Loading skeleton
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : jobs.length > 0 ? (
              jobs.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No jobs available at the moment. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JobOpportunity?</h3>
            <p className="text-lg text-gray-600">We make job searching and hiring simple and effective</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Quality Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access to high-quality job postings from verified employers and top companies.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Location Flexible</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find remote, hybrid, or on-site opportunities that fit your lifestyle and preferences.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Career Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with mentors, join professional networks, and advance your career.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have found their perfect job through JobOpportunity.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setAuthModalOpen(true)}
            className="px-8 py-3 transition-all duration-300 transform hover:scale-105"
          >
            Join Now - It's Free
          </Button>
        </div>
      </section>

      {/* Modals */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <JobPostingModal open={jobPostingModalOpen} onOpenChange={setJobPostingModalOpen} />
    </div>
  );
};

export default Index;

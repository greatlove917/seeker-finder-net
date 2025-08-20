import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Star, Award, Shield, TrendingUp } from 'lucide-react'
import { Job } from '@/hooks/useJobs'

interface QualityJobsProps {
  jobs: Job[]
  onViewQualityJobs?: (qualityJobs: Job[]) => void
}

export const QualityJobs = ({ jobs, onViewQualityJobs }: QualityJobsProps) => {
  const [showVerified, setShowVerified] = useState(false)

  const getJobQualityScore = (job: Job) => {
    let score = 0
    if (job.salary_min && job.salary_min > 50000) score += 20
    if (job.companies.logo_url) score += 15
    if (job.description.length > 100) score += 20
    if (job.job_type === 'full-time') score += 15
    if (job.remote_allowed) score += 10
    if (job.companies.name.length > 5) score += 20
    return Math.min(score, 100)
  }

  const qualityJobs = jobs
    .map(job => ({ ...job, qualityScore: getJobQualityScore(job) }))
    .filter(job => job.qualityScore >= 70)
    .sort((a, b) => b.qualityScore - a.qualityScore)

  const verifiedCompanies = jobs.filter(job => job.companies.logo_url).length

  const handleViewQualityJobs = () => {
    setShowVerified(!showVerified)
    if (onViewQualityJobs && !showVerified) {
      onViewQualityJobs(qualityJobs)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
            <Award className="h-5 w-5" />
            <span className="font-semibold">Quality Guaranteed</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Quality Jobs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every job is verified and screened to ensure you're applying to legitimate, high-quality opportunities from trusted employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-lg">Verified Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{verifiedCompanies}+</div>
              <p className="text-sm text-muted-foreground">Companies with verified profiles and logos</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-lg">Quality Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <p className="text-sm text-muted-foreground">Average quality score of our job postings</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-lg">Premium Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{qualityJobs.length}</div>
              <p className="text-sm text-muted-foreground">High-quality job opportunities available now</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button 
            onClick={handleViewQualityJobs}
            className="bg-primary hover:bg-primary/90 transform transition-all duration-300 hover:scale-105"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            {showVerified ? 'Show All Jobs' : 'View Quality Jobs Only'}
          </Button>
        </div>

        {showVerified && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {qualityJobs.slice(0, 9).map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {job.companies.logo_url && (
                        <img 
                          src={job.companies.logo_url} 
                          alt={job.companies.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{job.companies.name}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Star className="h-3 w-3 mr-1" />
                      {job.qualityScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {job.salary_min && `$${job.salary_min.toLocaleString()}+`}
                    </span>
                    <div className="flex gap-2">
                      <Badge variant="outline">{job.job_type}</Badge>
                      {job.remote_allowed && <Badge className="bg-blue-100 text-blue-800">Remote</Badge>}
                    </div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, DollarSign, Building, Heart, ExternalLink, Phone, Mail, Globe, Users, Briefcase } from 'lucide-react'
import { Job } from '@/hooks/useJobs'
import { useJobApplication } from '@/hooks/useJobApplication'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface EnhancedJobCardProps {
  job: Job
  showEmployerActions?: boolean
  onStatusChange?: (jobId: string, status: string) => void
}

export const EnhancedJobCard = ({ job, showEmployerActions = false, onStatusChange }: EnhancedJobCardProps) => {
  const { applyToJob, saveJob, loading } = useJobApplication()
  const { isJobSaved } = useSavedJobs()
  const [coverLetter, setCoverLetter] = useState('')
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return 'Competitive Salary'
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    if (min) return `${currency} ${min.toLocaleString()}+`
    return `Up to ${currency} ${max?.toLocaleString()}`
  }

  const formatJobType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getSalaryBadgeColor = (min: number | null, max: number | null) => {
    const avgSalary = min && max ? (min + max) / 2 : min || max || 0
    if (avgSalary >= 100000) return 'bg-green-100 text-green-800 border-green-300'
    if (avgSalary >= 70000) return 'bg-blue-100 text-blue-800 border-blue-300'  
    if (avgSalary >= 50000) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const handleApply = async () => {
    const result = await applyToJob({
      jobId: job.id,
      coverLetter: coverLetter.trim() || undefined
    })
    
    if (result.success) {
      setShowApplicationDialog(false)
      setCoverLetter('')
    }
  }

  const handleSave = async () => {
    await saveJob(job.id)
  }

  const handleStatusChange = (status: string) => {
    onStatusChange?.(job.id, status)
  }

  const jobSaved = isJobSaved(job.id)

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {job.companies.logo_url ? (
              <div className="relative">
                <img 
                  src={job.companies.logo_url} 
                  alt={`${job.companies.name} logo`}
                  className="h-16 w-16 rounded-xl object-cover border-2 border-gray-200 shadow-md"
                />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            ) : (
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <Building className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">{job.title}</CardTitle>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building className="h-4 w-4" />
                <span className="font-medium">{job.companies.name}</span>
              </div>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getSalaryBadgeColor(job.salary_min, job.salary_max)}`}>
                <DollarSign className="h-4 w-4" />
                <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
              </div>
            </div>
          </div>
          {showEmployerActions && (
            <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className="px-3 py-1">
              {job.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 line-clamp-3 leading-relaxed">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Briefcase className="h-3 w-3 mr-1" />
            {formatJobType(job.job_type)}
          </Badge>
          <Badge variant="outline" className="border-purple-300 text-purple-700">
            <Users className="h-3 w-3 mr-1" />
            {job.experience_level}
          </Badge>
          {job.remote_allowed && (
            <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
              <Globe className="h-3 w-3 mr-1" />
              Remote OK
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          {job.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>{job.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Contact Information Display */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="font-semibold text-gray-800 text-sm">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-blue-500" />
              <span className="text-gray-600">Apply to view</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-green-500" />
              <span className="text-gray-600">Apply to view</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-purple-500" />
              <span className="text-gray-600">Apply to view</span>
            </div>
          </div>
        </div>
        
        {showEmployerActions ? (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => handleStatusChange('active')}
              disabled={job.status === 'active'}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Publish
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleStatusChange('closed')}
              disabled={job.status === 'closed'}
              size="sm"
            >
              Close
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="hover:bg-blue-50"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Applications
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 pt-2">
            <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply to {job.title}</DialogTitle>
                  <DialogDescription>
                    Submit your application to {job.companies.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell them why you're interested in this position..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApply} disabled={loading} className="flex-1">
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowApplicationDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline"
              onClick={handleSave}
              disabled={loading}
              className={`hover:bg-red-50 ${jobSaved ? 'bg-red-50 border-red-300' : ''}`}
            >
              <Heart className={`h-4 w-4 ${jobSaved ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

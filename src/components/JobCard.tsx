
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, DollarSign, Building, Heart, ExternalLink } from 'lucide-react'
import { Job } from '@/hooks/useJobs'
import { useJobApplication } from '@/hooks/useJobApplication'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface JobCardProps {
  job: Job
  showEmployerActions?: boolean
  onStatusChange?: (jobId: string, status: string) => void
}

export const JobCard = ({ job, showEmployerActions = false, onStatusChange }: JobCardProps) => {
  const { applyToJob, saveJob, loading } = useJobApplication()
  const { isJobSaved } = useSavedJobs()
  const [coverLetter, setCoverLetter] = useState('')
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    if (min) return `${currency} ${min.toLocaleString()}+`
    return `Up to ${currency} ${max?.toLocaleString()}`
  }

  const formatJobType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {job.companies.logo_url && (
              <img 
                src={job.companies.logo_url} 
                alt={`${job.companies.name} logo`}
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{job.companies.name}</span>
              </div>
            </div>
          </div>
          {showEmployerActions && (
            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
              {job.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {formatJobType(job.job_type)}
            </Badge>
            <Badge variant="outline">
              {job.experience_level}
            </Badge>
            {job.remote_allowed && (
              <Badge variant="outline">Remote OK</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {showEmployerActions ? (
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => handleStatusChange('active')}
                disabled={job.status === 'active'}
                size="sm"
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
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Applications
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
                <DialogTrigger asChild>
                  <Button className="flex-1">
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
              >
                <Heart className={`h-4 w-4 ${jobSaved ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

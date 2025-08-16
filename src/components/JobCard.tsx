
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, DollarSign, Building } from 'lucide-react'
import { Job } from '@/hooks/useJobs'

interface JobCardProps {
  job: Job
  onApply?: (jobId: string) => void
  onSave?: (jobId: string) => void
}

export const JobCard = ({ job, onApply, onSave }: JobCardProps) => {
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
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onApply?.(job.id)}
              className="flex-1"
            >
              Apply Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => onSave?.(job.id)}
            >
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

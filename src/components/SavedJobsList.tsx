
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, AlertCircle } from 'lucide-react'
import { JobCard } from '@/components/JobCard'
import { useSavedJobs } from '@/hooks/useSavedJobs'

export const SavedJobsList = () => {
  const { savedJobs, loading, unsaveJob } = useSavedJobs()

  const handleUnsaveJob = (jobId: string) => {
    unsaveJob(jobId)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (savedJobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No saved jobs yet. Save jobs you're interested in!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedJobs.map((savedJob) => (
        <div key={savedJob.id} className="relative">
          <JobCard
            job={savedJob.jobs}
            onSave={() => handleUnsaveJob(savedJob.job_id)}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => handleUnsaveJob(savedJob.job_id)}
          >
            <Heart className="h-4 w-4 fill-current" />
          </Button>
        </div>
      ))}
    </div>
  )
}

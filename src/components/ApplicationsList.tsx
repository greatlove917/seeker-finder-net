
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Building, MapPin, AlertCircle } from 'lucide-react'
import { useJobApplications } from '@/hooks/useJobApplications'

export const ApplicationsList = () => {
  const { applications, loading, withdrawApplication } = useJobApplications()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'interview': return 'bg-purple-100 text-purple-800'
      case 'offer': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No applications yet. Start applying to jobs!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{application.jobs.title}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Building className="h-4 w-4" />
                  <span>{application.jobs.companies.name}</span>
                </div>
              </div>
              <Badge className={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {application.status === 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => withdrawApplication(application.id)}
                >
                  Withdraw
                </Button>
              )}
            </div>
            
            {application.cover_letter && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Cover Letter:</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {application.cover_letter}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

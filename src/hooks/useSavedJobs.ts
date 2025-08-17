
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { Job } from '@/hooks/useJobs'

export interface SavedJob {
  id: string
  job_id: string
  talent_id: string
  saved_at: string
  jobs: Job
}

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchSavedJobs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          jobs (
            *,
            companies (
              name,
              logo_url
            )
          )
        `)
        .eq('talent_id', user.id)
        .order('saved_at', { ascending: false })

      if (error) throw error
      setSavedJobs(data || [])
    } catch (error: any) {
      console.error('Error fetching saved jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load saved jobs',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const unsaveJob = async (jobId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', jobId)
        .eq('talent_id', user.id)

      if (error) throw error

      setSavedJobs(prev => prev.filter(saved => saved.job_id !== jobId))
      toast({
        title: 'Success',
        description: 'Job removed from saved jobs'
      })
    } catch (error: any) {
      console.error('Error unsaving job:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to unsave job',
        variant: 'destructive'
      })
    }
  }

  const isJobSaved = (jobId: string) => {
    return savedJobs.some(saved => saved.job_id === jobId)
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [user])

  return { savedJobs, loading, unsaveJob, isJobSaved, refetch: fetchSavedJobs }
}

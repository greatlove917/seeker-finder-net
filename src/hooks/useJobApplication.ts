
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

interface ApplicationData {
  jobId: string
  coverLetter?: string
  resumeUrl?: string
}

export const useJobApplication = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const applyToJob = async (applicationData: ApplicationData) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to apply for jobs',
        variant: 'destructive'
      })
      return { success: false }
    }

    setLoading(true)
    try {
      // Check if user has already applied
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', applicationData.jobId)
        .eq('talent_id', user.id)
        .single()

      if (existingApplication) {
        toast({
          title: 'Already Applied',
          description: 'You have already applied to this job',
          variant: 'destructive'
        })
        return { success: false }
      }

      const { error } = await supabase
        .from('job_applications')
        .insert([{
          job_id: applicationData.jobId,
          talent_id: user.id,
          cover_letter: applicationData.coverLetter,
          resume_url: applicationData.resumeUrl,
          status: 'pending'
        }])

      if (error) throw error

      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully!'
      })
      return { success: true }
    } catch (error: any) {
      console.error('Error applying to job:', error)
      toast({
        title: 'Application Failed',
        description: error.message || 'Failed to submit application',
        variant: 'destructive'
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const saveJob = async (jobId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save jobs',
        variant: 'destructive'
      })
      return { success: false }
    }

    try {
      // Check if job is already saved
      const { data: existingSave } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', jobId)
        .eq('talent_id', user.id)
        .single()

      if (existingSave) {
        // Remove from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('job_id', jobId)
          .eq('talent_id', user.id)

        if (error) throw error

        toast({
          title: 'Job Unsaved',
          description: 'Job removed from saved jobs'
        })
      } else {
        // Add to saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert([{
            job_id: jobId,
            talent_id: user.id
          }])

        if (error) throw error

        toast({
          title: 'Job Saved',
          description: 'Job added to your saved jobs'
        })
      }
      return { success: true }
    } catch (error: any) {
      console.error('Error saving job:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save job',
        variant: 'destructive'
      })
      return { success: false }
    }
  }

  return {
    applyToJob,
    saveJob,
    loading
  }
}

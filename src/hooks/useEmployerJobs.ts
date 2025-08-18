
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { Job } from '@/hooks/useJobs'

interface JobFormData {
  title: string
  description: string
  company_id: string
  job_type: string
  experience_level: string
  location?: string
  remote_allowed: boolean
  salary_min?: number
  salary_max?: number
  currency: string
  category_id?: string
  requirements?: string[]
  benefits?: string[]
}

export const useEmployerJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchEmployerJobs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            logo_url
          )
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error: any) {
      console.error('Error fetching employer jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your jobs',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createJob = async (jobData: JobFormData) => {
    if (!user) return { success: false }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          employer_id: user.id,
          status: 'draft'
        }])
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Job Created',
        description: 'Your job posting has been created successfully'
      })
      
      await fetchEmployerJobs() // Refresh the list
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating job:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create job',
        variant: 'destructive'
      })
      return { success: false }
    }
  }

  const updateJobStatus = async (jobId: string, status: 'draft' | 'active' | 'closed') => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', jobId)
        .eq('employer_id', user?.id)

      if (error) throw error

      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      ))

      toast({
        title: 'Job Updated',
        description: `Job status changed to ${status}`
      })
      return { success: true }
    } catch (error: any) {
      console.error('Error updating job status:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update job',
        variant: 'destructive'
      })
      return { success: false }
    }
  }

  const getJobApplications = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs!inner (
            title,
            employer_id
          )
        `)
        .eq('job_id', jobId)
        .eq('jobs.employer_id', user?.id)
        .order('applied_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      console.error('Error fetching applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive'
      })
      return { success: false, data: [] }
    }
  }

  useEffect(() => {
    fetchEmployerJobs()
  }, [user])

  return {
    jobs,
    loading,
    createJob,
    updateJobStatus,
    getJobApplications,
    refetch: fetchEmployerJobs
  }
}

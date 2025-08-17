
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

export interface JobApplication {
  id: string
  job_id: string
  talent_id: string
  cover_letter: string | null
  resume_url: string | null
  status: 'pending' | 'reviewed' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  applied_at: string
  updated_at: string
  jobs: {
    title: string
    company_id: string
    companies: {
      name: string
      logo_url: string | null
    }
  }
}

export const useJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchApplications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            company_id,
            companies (
              name,
              logo_url
            )
          )
        `)
        .eq('talent_id', user.id)
        .order('applied_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error: any) {
      console.error('Error fetching applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const withdrawApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId)
        .eq('talent_id', user?.id)

      if (error) throw error

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: 'withdrawn' as const }
            : app
        )
      )

      toast({
        title: 'Success',
        description: 'Application withdrawn successfully'
      })
    } catch (error: any) {
      console.error('Error withdrawing application:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to withdraw application',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [user])

  return { applications, loading, withdrawApplication, refetch: fetchApplications }
}

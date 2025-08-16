
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Job {
  id: string
  title: string
  description: string
  company_id: string
  employer_id: string
  job_type: string
  experience_level: string
  location: string | null
  remote_allowed: boolean
  salary_min: number | null
  salary_max: number | null
  currency: string
  status: string
  created_at: string
  companies: {
    name: string
    logo_url: string | null
  }
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchJobs = async () => {
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
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      setJobs(data || [])
    } catch (error: any) {
      console.error('Error fetching jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load jobs',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return { jobs, loading, refetch: fetchJobs }
}

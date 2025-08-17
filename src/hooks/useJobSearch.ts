
import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Job } from '@/hooks/useJobs'

interface SearchFilters {
  query: string
  location: string
  jobType: string
  category: string
  remoteOnly: boolean
}

export const useJobSearch = () => {
  const [searchResults, setSearchResults] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const searchJobs = useCallback(async (filters: SearchFilters) => {
    setLoading(true)
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            logo_url
          )
        `)
        .eq('status', 'active')

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters.jobType) {
        query = query.eq('job_type', filters.jobType)
      }

      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters.remoteOnly) {
        query = query.eq('remote_allowed', true)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setSearchResults(data || [])
    } catch (error: any) {
      console.error('Error searching jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to search jobs',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  return { searchResults, loading, searchJobs }
}

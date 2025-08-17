
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
  salaryRange?: [number, number]
  experienceLevels?: string[]
  jobTypes?: string[]
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

      // Apply basic search filters
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

      // Apply advanced filters from JobFilters component
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        query = query.in('job_type', filters.jobTypes)
      }

      if (filters.experienceLevels && filters.experienceLevels.length > 0) {
        query = query.in('experience_level', filters.experienceLevels)
      }

      if (filters.salaryRange) {
        const [minSalary, maxSalary] = filters.salaryRange
        if (minSalary > 0) {
          query = query.gte('salary_min', minSalary)
        }
        if (maxSalary < 200000) {
          query = query.lte('salary_max', maxSalary)
        }
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

  const clearResults = useCallback(() => {
    setSearchResults([])
  }, [])

  return { searchResults, loading, searchJobs, clearResults }
}


import { useState, useCallback, useMemo } from 'react'
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
  const [lastSearchFilters, setLastSearchFilters] = useState<SearchFilters | null>(null)
  const { toast } = useToast()

  // Memoize the search function to prevent unnecessary re-renders
  const searchJobs = useCallback(async (filters: SearchFilters) => {
    // Skip search if filters haven't changed
    if (lastSearchFilters && JSON.stringify(filters) === JSON.stringify(lastSearchFilters)) {
      return
    }

    setLoading(true)
    setLastSearchFilters(filters)

    try {
      let query = supabase
        .from('jobs')
        .select(`
          id,
          title,
          description,
          company_id,
          employer_id,
          job_type,
          experience_level,
          location,
          remote_allowed,
          salary_min,
          salary_max,
          currency,
          status,
          created_at,
          companies!inner (
            name,
            logo_url
          )
        `)
        .eq('status', 'active')

      // Build search conditions efficiently
      const conditions = []

      // Text search - combine title and description search
      if (filters.query?.trim()) {
        const searchTerm = filters.query.trim()
        conditions.push(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      if (conditions.length > 0) {
        query = query.or(conditions.join(','))
      }

      // Location filter with better matching
      if (filters.location?.trim()) {
        const locationTerm = filters.location.trim()
        query = query.or(`location.ilike.%${locationTerm}%,companies.location.ilike.%${locationTerm}%`)
      }

      // Job type filter - handle both basic and advanced filters
      const jobTypes = []
      if (filters.jobType && filters.jobType !== 'all-types') {
        jobTypes.push(filters.jobType)
      }
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        jobTypes.push(...filters.jobTypes)
      }
      
      // Remove duplicates and apply filter
      const uniqueJobTypes = [...new Set(jobTypes)]
      if (uniqueJobTypes.length > 0) {
        if (uniqueJobTypes.length === 1) {
          query = query.eq('job_type', uniqueJobTypes[0])
        } else {
          query = query.in('job_type', uniqueJobTypes)
        }
      }

      // Category filter
      if (filters.category && filters.category !== 'all-categories') {
        query = query.eq('category_id', filters.category)
      }

      // Remote filter
      if (filters.remoteOnly) {
        query = query.eq('remote_allowed', true)
      }

      // Experience level filter
      if (filters.experienceLevels && filters.experienceLevels.length > 0) {
        if (filters.experienceLevels.length === 1) {
          query = query.eq('experience_level', filters.experienceLevels[0])
        } else {
          query = query.in('experience_level', filters.experienceLevels)
        }
      }

      // Salary range filter - optimize by only adding conditions when needed
      if (filters.salaryRange) {
        const [minSalary, maxSalary] = filters.salaryRange
        if (minSalary > 0) {
          query = query.gte('salary_min', minSalary)
        }
        if (maxSalary < 200000) {
          query = query.lte('salary_max', maxSalary)
        }
      }

      // Order by created_at for consistency and add limit for performance
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100) // Limit results for better performance

      if (error) throw error
      
      // Transform the data to match the Job interface
      const transformedData: Job[] = (data || []).map(job => ({
        ...job,
        companies: job.companies[0] // Take the first company object from the array
      }))
      
      setSearchResults(transformedData)
    } catch (error: any) {
      console.error('Error searching jobs:', error)
      toast({
        title: 'Search Error',
        description: 'Failed to search jobs. Please try again.',
        variant: 'destructive'
      })
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }, [toast, lastSearchFilters])

  const clearResults = useCallback(() => {
    setSearchResults([])
    setLastSearchFilters(null)
  }, [])

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    searchResults,
    loading,
    searchJobs,
    clearResults
  }), [searchResults, loading, searchJobs, clearResults])

  return returnValue
}

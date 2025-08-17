
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Company {
  id: string
  name: string
  description: string | null
  website: string | null
  logo_url: string | null
  industry: string | null
  size: string | null
  location: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      if (error) throw error
      setCompanies(data || [])
    } catch (error: any) {
      console.error('Error fetching companies:', error)
      toast({
        title: 'Error',
        description: 'Failed to load companies',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single()

      if (error) throw error

      setCompanies(prev => [...prev, data])
      toast({
        title: 'Success',
        description: 'Company created successfully'
      })
      return { data, error: null }
    } catch (error: any) {
      console.error('Error creating company:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create company',
        variant: 'destructive'
      })
      return { data: null, error }
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  return { companies, loading, createCompany, refetch: fetchCompanies }
}


import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useDebounce } from '@/hooks/useDebounce'

interface JobSearchProps {
  onSearch: (filters: SearchFilters) => void
}

interface SearchFilters {
  query: string
  location: string
  jobType: string
  category: string
  remoteOnly: boolean
}

interface JobCategory {
  id: string
  name: string
}

export const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [category, setCategory] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [categories, setCategories] = useState<JobCategory[]>([])

  // Debounce search inputs to reduce API calls
  const debouncedQuery = useDebounce(query, 300)
  const debouncedLocation = useDebounce(location, 300)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('job_categories')
        .select('id, name')
        .order('name')
      
      if (data) setCategories(data)
    }

    fetchCategories()
  }, [])

  // Auto-search when debounced values change
  useEffect(() => {
    if (debouncedQuery || debouncedLocation || jobType || category || remoteOnly) {
      handleSearch(true) // Pass true to indicate auto-search
    }
  }, [debouncedQuery, debouncedLocation, jobType, category, remoteOnly])

  const handleSearch = (isAutoSearch = false) => {
    const filters = {
      query: debouncedQuery,
      location: debouncedLocation,
      jobType: jobType === 'all-types' ? '' : jobType,
      category: category === 'all-categories' ? '' : category,
      remoteOnly
    }

    onSearch(filters)
  }

  const clearFilters = () => {
    setQuery('')
    setLocation('')
    setJobType('')
    setCategory('')
    setRemoteOnly(false)
    onSearch({
      query: '',
      location: '',
      jobType: '',
      category: '',
      remoteOnly: false
    })
  }

  const hasActiveFilters = query || location || (jobType && jobType !== 'all-types') || (category && category !== 'all-categories') || remoteOnly

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Job title, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Types</SelectItem>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Remote only
          </label>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
        
        <Button onClick={() => handleSearch()}>
          Search Jobs
        </Button>
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <Badge variant="secondary">
              Query: {query}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setQuery('')} />
            </Badge>
          )}
          {location && (
            <Badge variant="secondary">
              Location: {location}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setLocation('')} />
            </Badge>
          )}
          {jobType && jobType !== 'all-types' && (
            <Badge variant="secondary">
              Type: {jobType}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setJobType('')} />
            </Badge>
          )}
          {remoteOnly && (
            <Badge variant="secondary">
              Remote only
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setRemoteOnly(false)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

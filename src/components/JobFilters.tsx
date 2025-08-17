
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface JobFiltersProps {
  onFiltersChange: (filters: any) => void
}

export const JobFilters = ({ onFiltersChange }: JobFiltersProps) => {
  const [salaryRange, setSalaryRange] = useState([0, 200000])
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [remoteOnly, setRemoteOnly] = useState(false)

  const jobTypes = [
    { id: 'full-time', label: 'Full Time' },
    { id: 'part-time', label: 'Part Time' },
    { id: 'contract', label: 'Contract' },
    { id: 'freelance', label: 'Freelance' },
    { id: 'internship', label: 'Internship' }
  ]

  const experienceLevels = [
    { id: 'entry', label: 'Entry Level' },
    { id: 'mid', label: 'Mid Level' },
    { id: 'senior', label: 'Senior Level' },
    { id: 'executive', label: 'Executive' }
  ]

  const handleJobTypeChange = (typeId: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedJobTypes, typeId]
      : selectedJobTypes.filter(id => id !== typeId)
    setSelectedJobTypes(updated)
    applyFilters({ jobTypes: updated })
  }

  const handleLevelChange = (levelId: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedLevels, levelId]
      : selectedLevels.filter(id => id !== levelId)
    setSelectedLevels(updated)
    applyFilters({ experienceLevels: updated })
  }

  const applyFilters = (updates: any = {}) => {
    onFiltersChange({
      salaryRange,
      jobTypes: selectedJobTypes,
      experienceLevels: selectedLevels,
      remoteOnly,
      ...updates
    })
  }

  const clearFilters = () => {
    setSalaryRange([0, 200000])
    setSelectedJobTypes([])
    setSelectedLevels([])
    setRemoteOnly(false)
    onFiltersChange({
      salaryRange: [0, 200000],
      jobTypes: [],
      experienceLevels: [],
      remoteOnly: false
    })
  }

  const hasActiveFilters = selectedJobTypes.length > 0 || selectedLevels.length > 0 || remoteOnly || salaryRange[0] > 0 || salaryRange[1] < 200000

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Salary Range */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
          </label>
          <Slider
            value={salaryRange}
            onValueChange={(value) => {
              setSalaryRange(value)
              applyFilters({ salaryRange: value })
            }}
            max={200000}
            min={0}
            step={5000}
            className="w-full"
          />
        </div>

        {/* Job Types */}
        <div>
          <label className="text-sm font-medium mb-3 block">Job Type</label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={selectedJobTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleJobTypeChange(type.id, checked as boolean)}
                />
                <label htmlFor={type.id} className="text-sm">{type.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="text-sm font-medium mb-3 block">Experience Level</label>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox
                  id={level.id}
                  checked={selectedLevels.includes(level.id)}
                  onCheckedChange={(checked) => handleLevelChange(level.id, checked as boolean)}
                />
                <label htmlFor={level.id} className="text-sm">{level.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={remoteOnly}
            onCheckedChange={(checked) => {
              setRemoteOnly(checked as boolean)
              applyFilters({ remoteOnly: checked })
            }}
          />
          <label htmlFor="remote" className="text-sm">Remote jobs only</label>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div>
            <label className="text-sm font-medium mb-2 block">Active Filters</label>
            <div className="flex flex-wrap gap-1">
              {selectedJobTypes.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {jobTypes.find(t => t.id === type)?.label}
                </Badge>
              ))}
              {selectedLevels.map(level => (
                <Badge key={level} variant="secondary" className="text-xs">
                  {experienceLevels.find(l => l.id === level)?.label}
                </Badge>
              ))}
              {remoteOnly && (
                <Badge variant="secondary" className="text-xs">Remote</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

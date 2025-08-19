
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Globe, Home, Building, Plane, Search } from 'lucide-react'
import { Job } from '@/hooks/useJobs'

interface LocationFlexibleProps {
  jobs: Job[]
  onLocationSearch: (location: string) => void
}

export const LocationFlexible = ({ jobs, onLocationSearch }: LocationFlexibleProps) => {
  const [selectedWorkType, setSelectedWorkType] = useState<'all' | 'remote' | 'hybrid' | 'onsite'>('all')
  const [searchLocation, setSearchLocation] = useState('')

  const remoteJobs = jobs.filter(job => job.remote_allowed).length
  const totalJobs = jobs.length
  const hybridJobs = Math.floor(totalJobs * 0.3) // Simulated hybrid jobs
  const onSiteJobs = totalJobs - remoteJobs

  const workTypes = [
    { id: 'all', label: 'All Types', icon: Globe, count: totalJobs, color: 'bg-blue-100 text-blue-800' },
    { id: 'remote', label: 'Remote', icon: Home, count: remoteJobs, color: 'bg-green-100 text-green-800' },
    { id: 'hybrid', label: 'Hybrid', icon: Building, count: hybridJobs, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'onsite', label: 'On-site', icon: Plane, count: onSiteJobs, color: 'bg-purple-100 text-purple-800' }
  ]

  const handleLocationSearch = () => {
    onLocationSearch(searchLocation)
  }

  const popularLocations = [
    'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 
    'Chicago, IL', 'Boston, MA', 'Los Angeles, CA', 'Denver, CO'
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold">Work Anywhere</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Location Flexible Opportunities</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect work arrangement for your lifestyle. Choose from remote, hybrid, or on-site positions across the globe.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {workTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedWorkType === type.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedWorkType(type.id as any)}
              >
                <CardHeader className="text-center pb-3">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">{type.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{type.count}</div>
                  <Badge className={type.color}>Available</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">Search by Location</h3>
          <div className="max-w-md mx-auto mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Enter city, state, or country"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleLocationSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Popular locations:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularLocations.map((location) => (
                <Button
                  key={location}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchLocation(location)
                    onLocationSearch(location)
                  }}
                  className="hover:bg-primary hover:text-white"
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardHeader>
              <Home className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-green-800">Remote First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">Work from anywhere in the world with full remote positions.</p>
              <Badge className="bg-green-100 text-green-800">{remoteJobs} remote jobs</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
            <CardHeader>
              <Building className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle className="text-yellow-800">Hybrid Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">Best of both worlds with flexible hybrid arrangements.</p>
              <Badge className="bg-yellow-100 text-yellow-800">{hybridJobs} hybrid positions</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
            <CardHeader>
              <Plane className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-purple-800">Global Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 mb-4">Connect with international companies and teams.</p>
              <Badge className="bg-purple-100 text-purple-800">50+ countries</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

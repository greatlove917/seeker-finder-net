
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEmployerJobs } from '@/hooks/useEmployerJobs'
import { Building, DollarSign, MapPin, Clock, Star, CheckCircle, Zap } from 'lucide-react'

interface JobPostingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const JobPostingModal = ({ open, onOpenChange }: JobPostingModalProps) => {
  const { createJob } = useEmployerJobs()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    job_type: '',
    experience_level: '',
    location: '',
    remote_allowed: false,
    salary_min: '',
    salary_max: '',
    currency: 'USD',
    requirements: '',
    benefits: '',
    contact_email: '',
    contact_phone: '',
    company_website: ''
  })

  const steps = [
    { id: 1, title: 'Basic Info', icon: Star },
    { id: 2, title: 'Job Details', icon: Clock },
    { id: 3, title: 'Compensation', icon: DollarSign },
    { id: 4, title: 'Additional', icon: MapPin }
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const jobData = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
      requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : undefined,
      benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : undefined
    }

    const result = await createJob(jobData)
    setIsSubmitting(false)
    
    if (result.success) {
      onOpenChange(false)
      setCurrentStep(1)
      setFormData({
        title: '',
        description: '',
        company_id: '',
        job_type: '',
        experience_level: '',
        location: '',
        remote_allowed: false,
        salary_min: '',
        salary_max: '',
        currency: 'USD',
        requirements: '',
        benefits: '',
        contact_email: '',
        contact_phone: '',
        company_website: ''
      })
    }
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.company_id
      case 2:
        return formData.job_type && formData.experience_level
      case 3:
        return true // Optional fields
      case 4:
        return true // Optional fields
      default:
        return false
    }
  }

  const canProceed = () => {
    return isStepComplete(currentStep)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Building className="h-6 w-6 text-blue-600" />
            Post a New Job
            <Badge className="bg-green-100 text-green-800">Quick & Easy</Badge>
          </DialogTitle>
          <DialogDescription>
            Create an attractive job posting in just 4 simple steps
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id || isStepComplete(step.id)
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : isActive 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    Step {step.id}
                  </div>
                  <div className={`text-xs ${isActive || isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                </div>
                {step.id < steps.length && (
                  <div className={`h-0.5 w-16 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="border-l-4 border-l-blue-500 animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="flex items-center gap-2">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company_id" className="flex items-center gap-2">
                      Company ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company_id"
                      value={formData.company_id}
                      onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                      placeholder="Your company identifier"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="flex items-center gap-2">
                      Job Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the role, responsibilities, and what makes your company great..."
                      rows={4}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Job Details */}
          {currentStep === 2 && (
            <Card className="border-l-4 border-l-green-500 animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Job Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job_type" className="flex items-center gap-2">
                      Job Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.job_type} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="experience_level" className="flex items-center gap-2">
                      Experience Level <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.experience_level} onValueChange={(value) => setFormData({ ...formData, experience_level: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. New York, NY"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="remote_allowed"
                      checked={formData.remote_allowed}
                      onCheckedChange={(checked) => setFormData({ ...formData, remote_allowed: checked })}
                    />
                    <Label htmlFor="remote_allowed" className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      Remote work allowed
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Compensation */}
          {currentStep === 3 && (
            <Card className="border-l-4 border-l-yellow-500 animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  Salary Range (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salary_min">Minimum Salary</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      value={formData.salary_min}
                      onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                      placeholder="50000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Maximum Salary</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      value={formData.salary_max}
                      onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                      placeholder="80000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <Card className="border-l-4 border-l-purple-500 animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Additional Details (Optional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Bachelor's degree in Computer Science&#10;3+ years of React experience&#10;Strong communication skills"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="benefits">Benefits (one per line)</Label>
                    <Textarea
                      id="benefits"
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      placeholder="Health insurance&#10;401k matching&#10;Flexible working hours&#10;Remote work options"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="hr@company.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_website">Company Website</Label>
                      <Input
                        id="company_website"
                        value={formData.company_website}
                        onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                        placeholder="https://company.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? 'Posting Job...' : 'Post Job'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

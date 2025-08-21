
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface SignUpFormProps {
  onSuccess: () => void
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'talent' | 'employer'>('talent')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: ''
  })
  const { signUp } = useAuth()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return 'Please fill in all required fields'
    }
    
    if (userType === 'employer' && !formData.companyName) {
      return 'Company name is required for employers'
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_type: userType,
      company_name: formData.companyName
    })

    if (error) {
      let errorMessage = 'Failed to create account. Please try again.'
      
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.'
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'Password must be at least 6 characters long.'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
      }

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Account Created!',
        description: userType === 'talent' 
          ? 'Welcome! Please check your email to verify your account.' 
          : 'Welcome employer! Please check your email to verify your account.'
      })
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        Create your account to get started
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-sm font-medium">I am a:</Label>
          <RadioGroup 
            value={userType} 
            onValueChange={(value) => setUserType(value as 'talent' | 'employer')}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="talent" id="talent" />
              <Label htmlFor="talent" className="font-normal">Job Seeker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="employer" id="employer" />
              <Label htmlFor="employer" className="font-normal">Employer</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="mt-1"
              autoComplete="given-name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="mt-1"
              autoComplete="family-name"
            />
          </div>
        </div>
        
        {userType === 'employer' && (
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your Company"
              className="mt-1"
              autoComplete="organization"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="signup-email">Email *</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="mt-1"
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="signup-password">Password *</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password (min 6 characters)"
            className="mt-1"
            autoComplete="new-password"
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  )
}

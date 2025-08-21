
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface SignInFormProps {
  onSuccess: () => void
}

export const SignInForm = ({ onSuccess }: SignInFormProps) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    const { error } = await signIn(formData.email, formData.password)

    if (error) {
      let errorMessage = 'Failed to sign in. Please try again.'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many attempts. Please wait a moment before trying again.'
      }

      toast({
        title: 'Sign In Failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        Welcome back! Sign in to access your account
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
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
          <Label htmlFor="signin-password">Password</Label>
          <Input
            id="signin-password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
            className="mt-1"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}

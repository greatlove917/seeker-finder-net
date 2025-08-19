
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Users, TrendingUp, BookOpen, Award, Target, Zap, ChevronRight } from 'lucide-react'

export const CareerGrowth = () => {
  const [selectedCareerPath, setSelectedCareerPath] = useState<string | null>(null)

  const careerPaths = [
    {
      id: 'tech',
      title: 'Technology',
      levels: ['Junior Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'],
      currentDemand: 95,
      growth: '+22%',
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'design',
      title: 'Design',
      levels: ['UI/UX Designer', 'Senior Designer', 'Design Lead', 'Creative Director'],
      currentDemand: 85,
      growth: '+18%',
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'marketing',
      title: 'Marketing',
      levels: ['Marketing Specialist', 'Marketing Manager', 'Marketing Director', 'CMO'],
      currentDemand: 78,
      growth: '+15%',
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      id: 'sales',
      title: 'Sales',
      levels: ['Sales Rep', 'Account Manager', 'Sales Director', 'VP Sales'],
      currentDemand: 88,
      growth: '+20%',
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    }
  ]

  const mentorshipStats = {
    activeMentors: 1250,
    mentorSessions: 8450,
    careerTransitions: 3200,
    skillsLearned: 15600
  }

  const skills = [
    { name: 'Leadership', demand: 92, growth: '+25%' },
    { name: 'Data Analysis', demand: 88, growth: '+30%' },
    { name: 'Digital Marketing', demand: 85, growth: '+22%' },
    { name: 'Project Management', demand: 90, growth: '+18%' },
    { name: 'Cloud Computing', demand: 95, growth: '+35%' },
    { name: 'AI/Machine Learning', demand: 97, growth: '+40%' }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Growth Focused</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Accelerate Your Career Growth</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with mentors, develop in-demand skills, and advance through clear career pathways designed for success.
          </p>
        </div>

        {/* Mentorship Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Active Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mentorshipStats.activeMentors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Industry experts ready to help</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Mentor Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mentorshipStats.mentorSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Career Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mentorshipStats.careerTransitions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Successful role changes</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Skills Learned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mentorshipStats.skillsLearned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">New skills acquired</p>
            </CardContent>
          </Card>
        </div>

        {/* Career Paths */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Explore Career Pathways</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerPaths.map((path) => (
              <Card 
                key={path.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedCareerPath === path.id ? 'ring-2 ring-purple-500 shadow-lg transform scale-105' : ''
                }`}
                onClick={() => setSelectedCareerPath(selectedCareerPath === path.id ? null : path.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <ChevronRight className={`h-5 w-5 transition-transform ${
                      selectedCareerPath === path.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Demand</span>
                        <span className="font-medium">{path.currentDemand}%</span>
                      </div>
                      <Progress value={path.currentDemand} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className={path.color}>Growth {path.growth}</Badge>
                      <Badge variant="outline">Hot</Badge>
                    </div>
                    {selectedCareerPath === path.id && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Career Levels:</p>
                        {path.levels.map((level, index) => (
                          <div key={level} className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <span>{level}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* In-Demand Skills */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-8">Most In-Demand Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Card key={skill.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">{skill.growth}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Demand Level</span>
                    <span className="font-medium">{skill.demand}%</span>
                  </div>
                  <Progress value={skill.demand} className="h-2 mb-3" />
                  <Button size="sm" variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learn This Skill
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Award className="h-5 w-5 mr-2" />
            Start Your Growth Journey
          </Button>
        </div>
      </div>
    </section>
  )
}

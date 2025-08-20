import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, TrendingUp, BookOpen, Award, Target, Zap, ChevronRight, Play, Star } from 'lucide-react'

interface CareerGrowthProps {
  onStartJourney?: () => void
}

interface Skill {
  name: string
  demand: number
  growth: string
  description: string
  modules: string[]
}

export const CareerGrowth = ({ onStartJourney }: CareerGrowthProps) => {
  const [selectedCareerPath, setSelectedCareerPath] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [skillModalOpen, setSkillModalOpen] = useState(false)
  const [journeyModalOpen, setJourneyModalOpen] = useState(false)
  const [successStoriesModalOpen, setSuccessStoriesModalOpen] = useState(false)

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

  const skills: Skill[] = [
    { 
      name: 'Leadership', 
      demand: 92, 
      growth: '+25%',
      description: 'Master the art of leading teams and driving organizational success',
      modules: ['Team Management', 'Strategic Thinking', 'Communication', 'Decision Making']
    },
    { 
      name: 'Data Analysis', 
      demand: 88, 
      growth: '+30%',
      description: 'Transform data into actionable insights using modern analytics tools',
      modules: ['SQL', 'Python/R', 'Visualization', 'Statistics']
    },
    { 
      name: 'Digital Marketing', 
      demand: 85, 
      growth: '+22%',
      description: 'Drive growth through digital channels and data-driven campaigns',
      modules: ['SEO/SEM', 'Social Media', 'Analytics', 'Content Strategy']
    },
    { 
      name: 'Project Management', 
      demand: 90, 
      growth: '+18%',
      description: 'Lead projects from conception to completion with agile methodologies',
      modules: ['Agile/Scrum', 'Risk Management', 'Stakeholder Management', 'Tools & Software']
    },
    { 
      name: 'Cloud Computing', 
      demand: 95, 
      growth: '+35%',
      description: 'Build and manage scalable cloud infrastructure and services',
      modules: ['AWS/Azure/GCP', 'DevOps', 'Security', 'Microservices']
    },
    { 
      name: 'AI/Machine Learning', 
      demand: 97, 
      growth: '+40%',
      description: 'Create intelligent systems that learn and adapt using cutting-edge AI',
      modules: ['Python/TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision']
    }
  ]

  const successStories = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer → Tech Lead',
      company: 'Google',
      story: 'Transitioned from junior developer to tech lead in 18 months through our mentorship program.',
      image: '/placeholder.svg'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Marketing Specialist → CMO',
      company: 'Startup Inc',
      story: 'Built digital marketing skills and leadership capabilities to become CMO of a fast-growing startup.',
      image: '/placeholder.svg'
    },
    {
      name: 'Emily Johnson',
      role: 'Data Analyst → Head of Analytics',
      company: 'Fortune 500',
      story: 'Leveraged AI/ML courses to advance from analyst to head of analytics at a Fortune 500 company.',
      image: '/placeholder.svg'
    }
  ]

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
    setSkillModalOpen(true)
  }

  const handleStartJourney = () => {
    setJourneyModalOpen(true)
    if (onStartJourney) {
      onStartJourney()
    }
  }

  const handleWatchSuccessStories = () => {
    setSuccessStoriesModalOpen(true)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Growth Focused</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Accelerate Your Career Growth</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with mentors, develop in-demand skills, and advance through clear career pathways designed for success.
          </p>

          {/* Interactive Hero Image */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={handleWatchSuccessStories}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Success Stories
                </Button>
              </div>
              
              {/* People interacting and sitting down image */}
              <div className="grid grid-cols-3 gap-8 items-center">
                <div className="text-left">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Collaborative Learning</h3>
                  <p className="text-sm opacity-90">Work together with peers and mentors</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-4 mx-auto">
                    <Target className="h-10 w-10" />
                  </div>
                  <h3 className="font-semibold mb-2">Goal-Oriented Growth</h3>
                  <p className="text-sm opacity-90">Achieve measurable career milestones</p>
                </div>
                
                <div className="text-right">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4 ml-auto">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Recognition & Rewards</h3>
                  <p className="text-sm opacity-90">Get recognized for your achievements</p>
                </div>
              </div>

              {/* Animated elements to simulate interaction */}
              <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-yellow-400/20 rounded-full animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Mentorship Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Active Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mentorshipStats.activeMentors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Industry experts ready to help</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
            <CardHeader className="pb-3">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Mentor Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mentorshipStats.mentorSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
            <CardHeader className="pb-3">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Career Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mentorshipStats.careerTransitions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Successful role changes</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
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
                      <div className="mt-4 space-y-2 animate-fade-in">
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
              <Card key={skill.name} className="hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105">
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full hover:bg-primary hover:text-white transition-colors"
                    onClick={() => handleSkillClick(skill)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learn This Skill
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Functional CTA Section */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white transform transition-all duration-300 hover:scale-105"
            onClick={handleStartJourney}
          >
            <Award className="h-5 w-5 mr-2" />
            Start Your Growth Journey
          </Button>
        </div>
      </div>

      {/* Success Stories Modal */}
      <Dialog open={successStoriesModalOpen} onOpenChange={setSuccessStoriesModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Star className="h-7 w-7 text-yellow-500" />
              Success Stories
            </DialogTitle>
            <DialogDescription>
              Real people who transformed their careers through our platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                    {story.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-lg">{story.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{story.role}</p>
                  <Badge variant="outline">{story.company}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{story.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => setSuccessStoriesModalOpen(false)}
            >
              Start Your Success Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Skill Details Modal */}
      <Dialog open={skillModalOpen} onOpenChange={setSkillModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Learn {selectedSkill?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedSkill?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSkill && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Course Modules:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedSkill.modules.map((module, index) => (
                    <div key={module} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm">{module}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div>
                  <div className="text-lg font-bold text-blue-600">{selectedSkill.growth} Growth</div>
                  <div className="text-sm text-gray-600">{selectedSkill.demand}% Market Demand</div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Star className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Growth Journey Modal */}
      <Dialog open={journeyModalOpen} onOpenChange={setJourneyModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Award className="h-7 w-7 text-purple-600" />
              Start Your Growth Journey
            </DialogTitle>
            <DialogDescription>
              Choose your path to accelerate your career growth with personalized learning and mentorship.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Find a Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with industry experts who can guide your career development.
                </p>
                <Button variant="outline" className="w-full">Browse Mentors</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Skill Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Take our assessment to identify your strengths and growth areas.
                </p>
                <Button variant="outline" className="w-full">Start Assessment</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Career Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Create a personalized roadmap for your career goals.
                </p>
                <Button variant="outline" className="w-full">Build Plan</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Skill Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Access our library of courses to develop in-demand skills.
                </p>
                <Button variant="outline" className="w-full">Browse Courses</Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Get Started - It's Free!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

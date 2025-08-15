
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Shield, ArrowRight, CheckCircle } from "lucide-react";

interface RoleCardsProps {
  onRoleSelect: (role: string) => void;
  selectedRole: string | null;
}

export const RoleCards = ({ onRoleSelect, selectedRole }: RoleCardsProps) => {
  const roles = [
    {
      id: "talent",
      title: "For Talents",
      description: "Discover opportunities that match your skills and aspirations",
      icon: Users,
      features: [
        "Smart job matching",
        "Resume builder",
        "Skill assessments",
        "Interview prep"
      ],
      gradient: "talent-gradient",
      popular: false
    },
    {
      id: "employer",
      title: "For Employers",
      description: "Find and hire the best talent for your organization",
      icon: Briefcase,
      features: [
        "Post unlimited jobs",
        "Applicant tracking",
        "Team collaboration",
        "Analytics dashboard"
      ],
      gradient: "employer-gradient",
      popular: true
    },
    {
      id: "admin",
      title: "Platform Admin",
      description: "Manage and optimize the entire job platform ecosystem",
      icon: Shield,
      features: [
        "User management",
        "Content moderation",
        "Analytics & reports",
        "System administration"
      ],
      gradient: "admin-gradient",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Choose Your Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your role to get started with features designed specifically for you
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-scale-in border-2 ${
                  isSelected 
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onRoleSelect(role.id)}
              >
                {role.popular && (
                  <Badge className="absolute top-4 right-4 hero-gradient text-white border-0">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${role.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${role.gradient} text-white border-0 hover:opacity-90 transition-all group`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRoleSelect(role.id);
                    }}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

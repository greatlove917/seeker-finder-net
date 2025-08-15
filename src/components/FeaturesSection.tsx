
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageSquare, BarChart3, Shield, Zap, Globe } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Job Matching",
      description: "AI-powered algorithm matches talents with perfect opportunities based on skills and preferences.",
      color: "text-info"
    },
    {
      icon: MessageSquare,
      title: "Direct Messaging",
      description: "Connect directly with employers and candidates through our integrated messaging system.",
      color: "text-success"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting for all user types to track performance and growth.",
      color: "text-warning"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with role-based access control and data protection.",
      color: "text-destructive"
    },
    {
      icon: Zap,
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications via email, SMS, and in-app alerts.",
      color: "text-primary"
    },
    {
      icon: Globe,
      title: "Mobile Optimized",
      description: "Fully responsive design that works perfectly on desktop, tablet, and mobile devices.",
      color: "text-talent"
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in your job search or talent acquisition journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-10 h-10 ${feature.color} rounded-lg bg-secondary/50 flex items-center justify-center mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

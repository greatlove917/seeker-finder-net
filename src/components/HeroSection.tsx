
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20 py-20 md:py-32">
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center animate-slide-up">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            🚀 Connecting Talent with Opportunity
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Find Your Dream Job
            <span className="block bg-gradient-to-r from-primary via-info to-success bg-clip-text text-transparent">
              Connect with Top Talent
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The modern job platform that connects talented professionals with innovative companies. 
            Join thousands who have found their perfect match.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="hero-gradient text-white border-0 hover:opacity-90 transition-all hover:scale-105 shadow-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 hover:bg-secondary/50 transition-all hover:scale-105"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary/5 to-info/5 blur-3xl" />
        </div>
      </div>
    </section>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Briefcase, Shield, ArrowRight, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { RoleCards } from "@/components/RoleCards";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StatsSection } from "@/components/StatsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    console.log(`Selected role: ${role}`);
    // In a real app, this would navigate to the appropriate dashboard
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="animate-fade-in">
        <HeroSection />
        <RoleCards onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
        <StatsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

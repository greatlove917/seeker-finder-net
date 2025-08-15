
import { TrendingUp, Users, Briefcase, Award } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Active Talents",
      color: "text-talent"
    },
    {
      icon: Briefcase,
      value: "5K+",
      label: "Job Openings",
      color: "text-employer"
    },
    {
      icon: Award,
      value: "95%",
      label: "Success Rate",
      color: "text-success"
    },
    {
      icon: TrendingUp,
      value: "500+",
      label: "Companies",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${stat.color} mx-auto mb-3 flex items-center justify-center rounded-lg bg-secondary/50`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

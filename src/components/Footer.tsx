
import { Search } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg hero-gradient">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">JobSeeker</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Connecting talent with opportunity through intelligent matching and seamless experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">For Talents</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Find Jobs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Build Resume</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Career Resources</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">For Employers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Post Jobs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Find Talent</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 JobSeeker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

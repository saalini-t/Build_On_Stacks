import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import StacksWalletConnection from "@/components/StacksWalletConnection";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" || path === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <Link href="/" data-testid="link-home">
                <h1 className="text-xl font-bold text-primary cursor-pointer">Blue Carbon Registry</h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" data-testid="link-dashboard">
                <span className={`transition-colors cursor-pointer ${
                  isActive("/dashboard") 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground hover:text-primary"
                }`}>
                  Dashboard
                </span>
              </Link>
              <Link href="/projects" data-testid="link-projects">
                <span className={`transition-colors cursor-pointer ${
                  isActive("/projects") 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground hover:text-primary"
                }`}>
                  Projects
                </span>
              </Link>
              <Link href="/marketplace" data-testid="link-marketplace">
                <span className={`transition-colors cursor-pointer ${
                  isActive("/marketplace") 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground hover:text-primary"
                }`}>
                  Marketplace
                </span>
              </Link>
              <Link href="/wallet" data-testid="link-wallet">
                <span className={`transition-colors cursor-pointer ${
                  isActive("/wallet") 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground hover:text-primary"
                }`}>
                  Wallet
                </span>
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <StacksWalletConnection />
              <div className="w-8 h-8 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <span className="font-bold text-primary">Blue Carbon Registry</span>
              </div>
              <p className="text-sm text-muted-foreground">Democratizing carbon credit verification through blockchain technology for blue carbon ecosystems.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard"><span className="hover:text-primary transition-colors cursor-pointer">Dashboard</span></Link></li>
                <li><Link href="/projects"><span className="hover:text-primary transition-colors cursor-pointer">Register Project</span></Link></li>
                <li><Link href="/marketplace"><span className="hover:text-primary transition-colors cursor-pointer">Marketplace</span></Link></li>
                <li><Link href="/wallet"><span className="hover:text-primary transition-colors cursor-pointer">Wallet</span></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Smart Contracts</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 Blue Carbon Registry. Built for environmental impact through blockchain innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

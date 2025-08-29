import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CreditCard } from '../components/CreditCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { TrendingUp, ShoppingCart, Target, Activity } from 'lucide-react';

interface CreditProject {
  id: string;
  name: string;
  projectType: string;
  location: string;
  totalCredits: number;
  availableCredits: number;
  pricePerCredit: number;
  status: 'active' | 'verified' | 'pending';
  description: string;
  developerName: string;
  startDate: string;
  estimatedCompletion: string;
}

export default function Marketplace() {
  const [projects, setProjects] = useState<CreditProject[]>([]);
  const [activeTab, setActiveTab] = useState('credits');

  // Mock project data - in real implementation this would come from blockchain
  useEffect(() => {
    const mockProjects: CreditProject[] = [
      {
        id: 'project-1',
        name: 'Mangrove Restoration Project',
        projectType: 'Mangrove',
        location: 'Mumbai Coast, India',
        totalCredits: 500,
        availableCredits: 350,
        pricePerCredit: 25,
        status: 'verified',
        description: 'Coastal mangrove restoration project focusing on carbon sequestration and biodiversity conservation.',
        developerName: 'Coastal Conservation India',
        startDate: '2024-01-15',
        estimatedCompletion: '2026-12-31'
      },
      {
        id: 'project-2',
        name: 'Seagrass Conservation Initiative',
        projectType: 'Seagrass',
        location: 'Goa, India',
        totalCredits: 300,
        availableCredits: 200,
        pricePerCredit: 30,
        status: 'verified',
        description: 'Seagrass bed protection and restoration project in coastal waters.',
        developerName: 'Marine Ecology Foundation',
        startDate: '2024-03-01',
        estimatedCompletion: '2027-06-30'
      },
      {
        id: 'project-3',
        name: 'Salt Marsh Protection Program',
        projectType: 'Salt Marsh',
        location: 'Kerala, India',
        totalCredits: 250,
        availableCredits: 180,
        pricePerCredit: 28,
        status: 'active',
        description: 'Salt marsh ecosystem conservation and restoration project.',
        developerName: 'Wetland Conservation Trust',
        startDate: '2024-02-15',
        estimatedCompletion: '2026-11-30'
      },
      {
        id: 'project-4',
        name: 'Kelp Forest Restoration',
        projectType: 'Kelp',
        location: 'Tamil Nadu, India',
        totalCredits: 400,
        availableCredits: 320,
        pricePerCredit: 22,
        status: 'verified',
        description: 'Underwater kelp forest restoration for marine carbon sequestration.',
        developerName: 'Ocean Conservation Society',
        startDate: '2024-01-01',
        estimatedCompletion: '2028-03-31'
      }
    ];
    setProjects(mockProjects);
  }, []);

  const handleCreditAction = () => {
    // Refresh project data after credit actions
    // In real implementation, this would fetch updated data from blockchain
    console.log('Credits updated, refreshing data...');
  };

  const getTotalMarketValue = () => {
    return projects.reduce((total, project) => {
      return total + (project.availableCredits * project.pricePerCredit);
    }, 0);
  };

  const getTotalCreditsAvailable = () => {
    return projects.reduce((total, project) => total + project.availableCredits, 0);
  };

  const getTotalCreditsIssued = () => {
    return projects.reduce((total, project) => total + project.totalCredits, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">🌊 Carbon Credit Marketplace</h1>
        <p className="text-xl text-muted-foreground">
          Buy, sell, and retire verified blue carbon credits from certified projects
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Market Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ${getTotalMarketValue().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits Available</p>
                <p className="text-2xl font-bold text-foreground">
                  {getTotalCreditsAvailable().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Credits Issued</p>
                <p className="text-2xl font-bold text-foreground">
                  {getTotalCreditsIssued().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter(p => p.status === 'verified' || p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credits" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Available Credits</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Market Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credits" className="space-y-6">
          {/* Project Filters */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Filter Projects</CardTitle>
              <CardDescription>
                Find the perfect carbon credits for your environmental goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Types</option>
                    <option value="mangrove">Mangrove</option>
                    <option value="seagrass">Seagrass</option>
                    <option value="saltmarsh">Salt Marsh</option>
                    <option value="kelp">Kelp</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Locations</option>
                    <option value="mumbai">Mumbai, India</option>
                    <option value="goa">Goa, India</option>
                    <option value="kerala">Kerala, India</option>
                    <option value="tamilnadu">Tamil Nadu, India</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Prices</option>
                    <option value="low">$0 - $25</option>
                    <option value="medium">$25 - $50</option>
                    <option value="high">$50+</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <CreditCard
                key={project.id}
                projectId={project.id}
                projectName={project.name}
                projectType={project.projectType}
                location={project.location}
                totalCredits={project.totalCredits}
                availableCredits={project.availableCredits}
                pricePerCredit={project.pricePerCredit}
                status={project.status}
                onCreditAction={handleCreditAction}
              />
            ))}
          </div>

          {/* No Projects Message */}
          {projects.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Credits Available</h3>
                <p className="text-muted-foreground">
                  No carbon credits are currently available for purchase. Check back later or register a new project.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityFeed />
        </TabsContent>
      </Tabs>

      {/* Market Information */}
      <Card>
        <CardHeader>
          <CardTitle>📚 About Carbon Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">🌱 What are Carbon Credits?</h4>
              <p className="text-sm text-muted-foreground">
                Carbon credits represent one metric ton of CO₂ that has been removed from the atmosphere 
                or prevented from being emitted. Each credit is verified and certified by independent auditors.
              </p>
              
              <h4 className="font-semibold">🔒 How Verification Works</h4>
              <p className="text-sm text-muted-foreground">
                All projects undergo rigorous verification including satellite monitoring, 
                on-site inspections, and third-party audits to ensure carbon sequestration claims are accurate.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">💚 Why Blue Carbon?</h4>
              <p className="text-sm text-muted-foreground">
                Blue carbon ecosystems (mangroves, seagrasses, salt marshes) are among the most 
                efficient carbon sinks on Earth, storing up to 10x more carbon than terrestrial forests.
              </p>
              
              <h4 className="font-semibold">🌍 Environmental Impact</h4>
              <p className="text-sm text-muted-foreground">
                By purchasing credits, you directly support conservation and restoration projects 
                that protect marine ecosystems and combat climate change.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

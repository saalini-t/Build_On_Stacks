import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProjectRegistrationForm } from '../components/ProjectRegistrationForm';
import { ActivityFeed } from '../components/ActivityFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Activity, FileText, MapPin, Calendar, User } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  projectType: string;
  location: string;
  status: 'pending' | 'active' | 'verified' | 'completed';
  developerName: string;
  startDate: string;
  estimatedCompletion: string;
  estimatedCredits: number;
  area: string;
  latitude: string;
  longitude: string;
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Mock project data - in real implementation this would come from blockchain
  const projects: Project[] = [
    {
      id: 'project-1',
      name: 'Mangrove Restoration Project',
      description: 'Coastal mangrove restoration project focusing on carbon sequestration and biodiversity conservation.',
      projectType: 'Mangrove',
      location: 'Mumbai Coast, India',
      status: 'verified',
      developerName: 'Coastal Conservation India',
      startDate: '2024-01-15',
      estimatedCompletion: '2026-12-31',
      estimatedCredits: 500,
      area: '50 hectares',
      latitude: '19.0760',
      longitude: '72.8777'
    },
    {
      id: 'project-2',
      name: 'Seagrass Conservation Initiative',
      description: 'Seagrass bed protection and restoration project in coastal waters.',
      projectType: 'Seagrass',
      location: 'Goa, India',
      status: 'active',
      developerName: 'Marine Ecology Foundation',
      startDate: '2024-03-01',
      estimatedCompletion: '2027-06-30',
      estimatedCredits: 300,
      area: '30 hectares',
      latitude: '15.2993',
      longitude: '74.1240'
    },
    {
      id: 'project-3',
      name: 'Salt Marsh Protection Program',
      description: 'Salt marsh ecosystem conservation and restoration project.',
      projectType: 'Salt Marsh',
      location: 'Kerala, India',
      status: 'pending',
      developerName: 'Wetland Conservation Trust',
      startDate: '2024-02-15',
      estimatedCompletion: '2026-11-30',
      estimatedCredits: 250,
      area: '25 hectares',
      latitude: '10.8505',
      longitude: '76.2711'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mangrove': return '🌳';
      case 'seagrass': return '🌊';
      case 'salt marsh': return '🏞️';
      case 'kelp': return '🌿';
      default: return '🌱';
    }
  };

  const getTotalCredits = () => {
    return projects.reduce((total, project) => total + project.estimatedCredits, 0);
  };

  const getTotalArea = () => {
    return projects.reduce((total, project) => {
      const area = parseInt(project.area.split(' ')[0]);
      return total + area;
    }, 0);
  };

  if (showRegistrationForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">🌊 Register New Project</h1>
          <Button 
            variant="outline" 
            onClick={() => setShowRegistrationForm(false)}
          >
            ← Back to Projects
          </Button>
        </div>
        <ProjectRegistrationForm />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">🌱 Blue Carbon Projects</h1>
          <p className="text-xl text-muted-foreground">
            Explore and manage blue carbon conservation and restoration projects
          </p>
        </div>
        <Button onClick={() => setShowRegistrationForm(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Register New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold text-foreground">{getTotalCredits().toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Area</p>
                <p className="text-2xl font-bold text-foreground">{getTotalArea()} hectares</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
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
                  {projects.filter(p => p.status === 'active' || p.status === 'verified').length}
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
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Project Overview</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Project Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span className="text-2xl">{getProjectTypeIcon(project.projectType)}</span>
                        <Badge variant="outline" className="text-xs">
                          {project.projectType}
                        </Badge>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{project.developerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{project.startDate} - {project.estimatedCompletion}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{project.estimatedCredits}</p>
                      <p className="text-xs text-muted-foreground">Estimated Credits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{project.area}</p>
                      <p className="text-xs text-muted-foreground">Project Area</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Projects Message */}
          {projects.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
                <p className="text-muted-foreground mb-4">
                  No blue carbon projects have been registered yet. Be the first to register a project!
                </p>
                <Button onClick={() => setShowRegistrationForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Register First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityFeed />
        </TabsContent>
      </Tabs>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>📚 About Blue Carbon Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">🌊 What are Blue Carbon Projects?</h4>
              <p className="text-sm text-muted-foreground">
                Blue carbon projects focus on the conservation and restoration of coastal and marine ecosystems 
                that naturally capture and store carbon dioxide from the atmosphere.
              </p>
              
              <h4 className="font-semibold">🔬 Project Types</h4>
              <p className="text-sm text-muted-foreground">
                Our platform supports mangrove restoration, seagrass conservation, salt marsh protection, 
                and kelp forest restoration projects across coastal regions.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">✅ Verification Process</h4>
              <p className="text-sm text-muted-foreground">
                All projects undergo rigorous verification including environmental impact assessments, 
                baseline measurements, and ongoing monitoring to ensure carbon sequestration claims.
              </p>
              
              <h4 className="font-semibold">🌍 Environmental Benefits</h4>
              <p className="text-sm text-muted-foreground">
                Beyond carbon capture, these projects protect biodiversity, prevent coastal erosion, 
                and support local communities through sustainable development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

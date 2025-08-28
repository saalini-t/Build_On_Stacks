import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProjectRegistrationForm from "@/components/ProjectRegistrationForm";
import { MapPin, Calendar, TreePine, Waves, Mountain } from "lucide-react";
import type { Project } from "@shared/schema";

const projectTypeIcons = {
  mangrove: TreePine,
  seagrass: Waves,
  salt_marsh: Mountain,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800", 
  rejected: "bg-red-100 text-red-800",
};

export default function Projects() {
  const [activeTab, setActiveTab] = useState("register");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  }) as { data: Project[], isLoading: boolean };

  const ProjectCard = ({ project }: { project: Project }) => {
    const IconComponent = projectTypeIcons[project.projectType as keyof typeof projectTypeIcons] || TreePine;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <Badge className={statusColors[project.status as keyof typeof statusColors]}>
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <IconComponent className="w-4 h-4" />
              <span className="capitalize">{project.projectType.replace('_', ' ')}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Area:</span>
              <span className="ml-2 font-medium">{project.area} ha</span>
            </div>
            <div>
              <span className="text-muted-foreground">Credits:</span>
              <span className="ml-2 font-medium">{project.estimatedCredits}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Submitted:</span>
              <span className="ml-2 font-medium">
                {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {project.verifiedAt && (
              <div>
                <span className="text-muted-foreground">Verified:</span>
                <span className="ml-2 font-medium">
                  {new Date(project.verifiedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {project.satelliteImagery && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-2">Satellite Imagery</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="bg-muted rounded h-20 mb-1 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Before</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-muted rounded h-20 mb-1 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">After</span>
                  </div>
                </div>
              </div>
            </div>
          ) as React.ReactNode}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Blue Carbon Projects</h2>
        <p className="text-muted-foreground">Register new projects and track verification progress</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register" data-testid="tab-register">Register Project</TabsTrigger>
          <TabsTrigger value="browse" data-testid="tab-browse">Browse Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="space-y-6">
          <ProjectRegistrationForm />
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {projects && projects.length === 0 && (
            <div className="text-center py-12">
              <TreePine className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">
                Get started by registering your first blue carbon project.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

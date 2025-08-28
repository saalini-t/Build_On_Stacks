import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectMap3D from "@/components/ProjectMap3D";
import SensorReadings from "@/components/SensorReadings";
import { Building2, CheckCircle, Leaf, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { data: projectStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/projects"],
  }) as { data: any, isLoading: boolean };

  const { data: marketStats, isLoading: marketLoading } = useQuery({
    queryKey: ["/api/analytics/market"],
  }) as { data: any, isLoading: boolean };

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  }) as { data: any[], isLoading: boolean };

  if (statsLoading || marketLoading || projectsLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Carbon Credit Dashboard</h2>
        <p className="text-muted-foreground">Monitor your blue carbon projects and track environmental impact in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-projects">
                  {projectStats?.totalProjects || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits Issued</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-credits-issued">
                  {projectStats?.creditsIssued || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CO₂ Sequestered</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-co2-sequestered">
                  {projectStats?.co2Sequestered?.toFixed(1) || 0} <span className="text-sm font-normal">tons</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Value</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-market-value">
                  ${marketStats?.marketValue?.toFixed(0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Project Map and Sensor Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Project Map</CardTitle>
            <p className="text-sm text-muted-foreground">Interactive 3D visualization of blue carbon projects</p>
          </CardHeader>
          <CardContent className="p-0">
            <ProjectMap3D projects={projects || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Sensor Readings</CardTitle>
            <p className="text-sm text-muted-foreground">Real-time IoT data from project sites</p>
          </CardHeader>
          <CardContent>
            <SensorReadings projectId="project-1" />
          </CardContent>
        </Card>
      </div>

      {/* Carbon Sequestration Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Sequestration Analytics</CardTitle>
          <p className="text-sm text-muted-foreground">Track environmental impact across all projects</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Performance */}
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">Project Performance Comparison</h4>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Mangrove Projects</span>
                    <span className="text-sm text-secondary font-semibold">156.7 t CO₂</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">85% of target achieved</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Seagrass Projects</span>
                    <span className="text-sm text-primary font-semibold">92.3 t CO₂</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">72% of target achieved</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Salt Marsh Projects</span>
                    <span className="text-sm text-chart-3 font-semibold">78.9 t CO₂</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-3 h-2 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">68% of target achieved</p>
                </div>
              </div>
            </div>

            {/* Monthly Sequestration Chart Placeholder */}
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">Monthly CO₂ Sequestration</h4>
              <div className="bg-muted/30 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Leaf className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Chart Visualization</p>
                  <p className="text-sm opacity-80">Interactive sequestration data</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

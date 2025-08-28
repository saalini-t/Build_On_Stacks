import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Leaf, Droplets } from "lucide-react";

interface SensorReadingsProps {
  projectId: string;
}

const sensorIcons = {
  co2: Thermometer,
  biomass: Leaf, 
  soil_carbon: Droplets,
};

const sensorColors = {
  co2: "text-secondary",
  biomass: "text-primary",
  soil_carbon: "text-chart-3",
};

const progressColors = {
  co2: "bg-secondary",
  biomass: "bg-primary", 
  soil_carbon: "bg-chart-3",
};

export default function SensorReadings({ projectId }: SensorReadingsProps) {
  const { data: sensorData, isLoading } = useQuery({
    queryKey: ["/api/sensor-data", projectId],
  }) as { data: any[], isLoading: boolean };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Group sensor data by type and get latest readings
  const latestReadings = sensorData?.reduce((acc: any, reading: any) => {
    if (!acc[reading.sensorType] || new Date(reading.timestamp) > new Date(acc[reading.sensorType].timestamp)) {
      acc[reading.sensorType] = reading;
    }
    return acc;
  }, {});

  const getProgressValue = (sensorType: string, value: string) => {
    switch (sensorType) {
      case "co2":
        return Math.min((parseFloat(value) / 3.0) * 100, 100); // Max 3.0 t/ha/yr
      case "biomass":
        return Math.min((parseFloat(value) / 200) * 100, 100); // Max 200 t/ha
      case "soil_carbon":
        return parseFloat(value); // Already a percentage
      default:
        return 0;
    }
  };

  const formatLabel = (sensorType: string) => {
    switch (sensorType) {
      case "co2":
        return "CO₂ Sequestration Rate";
      case "biomass":
        return "Biomass Growth";
      case "soil_carbon":
        return "Soil Carbon Content";
      default:
        return sensorType;
    }
  };

  return (
    <div className="space-y-6">
      {latestReadings && Object.entries(latestReadings).map(([sensorType, reading]: [string, any]) => {
        const IconComponent = sensorIcons[sensorType as keyof typeof sensorIcons] || Thermometer;
        const iconColor = sensorColors[sensorType as keyof typeof sensorColors];
        const progressColor = progressColors[sensorType as keyof typeof progressColors];
        const progressValue = getProgressValue(sensorType, reading.value);

        return (
          <div key={sensorType} className="sensor-reading" data-testid={`sensor-${sensorType}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <IconComponent className={`w-4 h-4 ${iconColor}`} />
                <span className="text-sm font-medium text-foreground">
                  {formatLabel(sensorType)}
                </span>
              </div>
              <span className={`text-sm font-semibold ${iconColor}`} data-testid={`sensor-value-${sensorType}`}>
                {reading.value} {reading.unit}
              </span>
            </div>
            <Progress 
              value={progressValue} 
              className="h-2"
              style={{
                "--progress-color": `var(--${sensorType === "co2" ? "secondary" : sensorType === "biomass" ? "primary" : "chart-3"})`
              } as React.CSSProperties}
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Device: {reading.metadata?.device_id || "N/A"}</span>
              <span>Updated: {new Date(reading.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        );
      })}

      {(!latestReadings || Object.keys(latestReadings).length === 0) && (
        <div className="text-center py-8">
          <Thermometer className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Sensor Data</h3>
          <p className="text-muted-foreground text-sm">
            Waiting for sensor readings from the project site.
          </p>
        </div>
      )}

      <div className="bg-muted/50 rounded-lg p-4 mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">
            Last updated: {latestReadings && Object.values(latestReadings)[0] 
              ? new Date((Object.values(latestReadings)[0] as any).timestamp).toLocaleString()
              : "No data"
            }
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Next reading: 8 minutes</p>
      </div>
    </div>
  );
}

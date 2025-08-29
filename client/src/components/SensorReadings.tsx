import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { stacksService } from '../lib/stacks-service';
import { Activity, Plus, Thermometer, Droplets, Wind, Gauge, TrendingUp } from 'lucide-react';

interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  carbonLevel: number;
  waterLevel: number;
  windSpeed: number;
  status: 'normal' | 'warning' | 'critical';
}

interface SensorData {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastReading: Date;
  readings: SensorReading[];
}

export function SensorReadings() {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [isAddingReading, setIsAddingReading] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<string>('');
  const [newReading, setNewReading] = useState({
    temperature: '',
    humidity: '',
    pressure: '',
    carbonLevel: '',
    waterLevel: '',
    windSpeed: ''
  });
  const { toast } = useToast();

  // Mock sensor data - in real implementation this would come from blockchain
  useEffect(() => {
    const mockSensors: SensorData[] = [
      {
        id: 'sensor-1',
        name: 'Coastal Sensor Alpha',
        location: 'Mumbai Coast, India',
        type: 'Environmental',
        status: 'active',
        lastReading: new Date(),
        readings: [
          {
            id: 'reading-1',
            sensorId: 'sensor-1',
            timestamp: new Date(),
            temperature: 28.5,
            humidity: 75.2,
            pressure: 1013.2,
            carbonLevel: 415.6,
            waterLevel: 1.2,
            windSpeed: 12.3,
            status: 'normal'
          }
        ]
      },
      {
        id: 'sensor-2',
        name: 'Mangrove Sensor Beta',
        location: 'Goa Mangroves, India',
        type: 'Carbon',
        status: 'active',
        lastReading: new Date(Date.now() - 3600000), // 1 hour ago
        readings: [
          {
            id: 'reading-2',
            sensorId: 'sensor-2',
            timestamp: new Date(Date.now() - 3600000),
            temperature: 26.8,
            humidity: 82.1,
            pressure: 1012.8,
            carbonLevel: 398.4,
            waterLevel: 0.8,
            windSpeed: 8.7,
            status: 'normal'
          }
        ]
      }
    ];
    setSensors(mockSensors);
  }, []);

  const handleAddSensor = async () => {
    if (!localStorage.getItem('stacks-wallet-connected')) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Leather Wallet to add sensors.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingSensor(true);
    try {
      const result = await stacksService.addSensor();
      
      if (result.success) {
        toast({
          title: "Sensor Added! 🎉",
          description: `New sensor added to the blockchain. Sensor ID: ${result.sensorId}`,
        });
        
        // Add new sensor to local state
        const newSensor: SensorData = {
          id: result.sensorId,
          name: `New Sensor ${result.sensorId}`,
          location: 'Location to be set',
          type: 'Environmental',
          status: 'active',
          lastReading: new Date(),
          readings: []
        };
        setSensors(prev => [...prev, newSensor]);
      } else {
        toast({
          title: "Sensor Addition Failed",
          description: result.error || "Failed to add sensor on blockchain",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sensor addition error:', error);
      toast({
        title: "Error",
        description: "Failed to add sensor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingSensor(false);
    }
  };

  const handleAddReading = async () => {
    if (!selectedSensor) {
      toast({
        title: "No Sensor Selected",
        description: "Please select a sensor to add readings.",
        variant: "destructive",
      });
      return;
    }

    if (!localStorage.getItem('stacks-wallet-connected')) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Leather Wallet to add sensor readings.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingReading(true);
    try {
      // Validate readings
      const temp = parseFloat(newReading.temperature);
      const hum = parseFloat(newReading.humidity);
      const press = parseFloat(newReading.pressure);
      const carbon = parseFloat(newReading.carbonLevel);
      const water = parseFloat(newReading.waterLevel);
      const wind = parseFloat(newReading.windSpeed);

      if (isNaN(temp) || isNaN(hum) || isNaN(press) || isNaN(carbon) || isNaN(water) || isNaN(wind)) {
        toast({
          title: "Invalid Data",
          description: "Please enter valid numeric values for all readings.",
          variant: "destructive",
        });
        return;
      }

      // Create new reading
      const newReadingData: SensorReading = {
        id: `reading-${Date.now()}`,
        sensorId: selectedSensor,
        timestamp: new Date(),
        temperature: temp,
        humidity: hum,
        pressure: press,
        carbonLevel: carbon,
        waterLevel: water,
        windSpeed: wind,
        status: carbon > 450 ? 'critical' : carbon > 420 ? 'warning' : 'normal'
      };

      // Add to local state
      setSensors(prev => prev.map(sensor => 
        sensor.id === selectedSensor 
          ? {
              ...sensor,
              lastReading: new Date(),
              readings: [...sensor.readings, newReadingData]
            }
          : sensor
      ));

      toast({
        title: "Reading Added! 📊",
        description: "New sensor reading has been recorded.",
      });

      // Reset form
      setNewReading({
        temperature: '',
        humidity: '',
        pressure: '',
        carbonLevel: '',
        waterLevel: '',
        windSpeed: ''
      });
      setSelectedSensor('');
    } catch (error) {
      console.error('Reading addition error:', error);
      toast({
        title: "Error",
        description: "Failed to add reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingReading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getReadingStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Sensor Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🌊 Sensor Data & Monitoring</h2>
          <p className="text-muted-foreground">Real-time environmental data from blue carbon project sensors</p>
        </div>
        <Button onClick={handleAddSensor} disabled={isAddingSensor}>
          <Plus className="w-4 h-4 mr-2" />
          {isAddingSensor ? 'Adding...' : 'Add Sensor'}
        </Button>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <Card key={sensor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{sensor.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {sensor.type}
                    </Badge>
                    <span>📍 {sensor.location}</span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(sensor.status)}>
                  {sensor.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Latest Reading */}
              {sensor.readings.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Latest Reading</span>
                    <Badge className={getReadingStatusColor(sensor.readings[sensor.readings.length - 1].status)}>
                      {sensor.readings[sensor.readings.length - 1].status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span>{sensor.readings[sensor.readings.length - 1].temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>{sensor.readings[sensor.readings.length - 1].humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="w-4 h-4 text-purple-500" />
                      <span>{sensor.readings[sensor.readings.length - 1].pressure} hPa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>{sensor.readings[sensor.readings.length - 1].carbonLevel} ppm</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last updated: {sensor.readings[sensor.readings.length - 1].timestamp.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Add Reading Button */}
              <Button
                onClick={() => setSelectedSensor(sensor.id)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Reading
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Reading Modal */}
      {selectedSensor && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>📊 Add Sensor Reading</CardTitle>
            <CardDescription>
              Record new environmental data from sensor: {sensors.find(s => s.id === selectedSensor)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={newReading.temperature}
                  onChange={(e) => setNewReading(prev => ({ ...prev, temperature: e.target.value }))}
                  placeholder="25.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  step="0.1"
                  value={newReading.humidity}
                  onChange={(e) => setNewReading(prev => ({ ...prev, humidity: e.target.value }))}
                  placeholder="65.2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pressure">Pressure (hPa)</Label>
                <Input
                  id="pressure"
                  type="number"
                  step="0.1"
                  value={newReading.pressure}
                  onChange={(e) => setNewReading(prev => ({ ...prev, pressure: e.target.value }))}
                  placeholder="1013.2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carbonLevel">CO₂ (ppm)</Label>
                <Input
                  id="carbonLevel"
                  type="number"
                  step="0.1"
                  value={newReading.carbonLevel}
                  onChange={(e) => setNewReading(prev => ({ ...prev, carbonLevel: e.target.value }))}
                  placeholder="415.6"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="waterLevel">Water Level (m)</Label>
                <Input
                  id="waterLevel"
                  type="number"
                  step="0.1"
                  value={newReading.waterLevel}
                  onChange={(e) => setNewReading(prev => ({ ...prev, waterLevel: e.target.value }))}
                  placeholder="1.2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="windSpeed">Wind Speed (m/s)</Label>
                <Input
                  id="windSpeed"
                  type="number"
                  step="0.1"
                  value={newReading.windSpeed}
                  onChange={(e) => setNewReading(prev => ({ ...prev, windSpeed: e.target.value }))}
                  placeholder="12.3"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleAddReading}
                disabled={isAddingReading}
                className="flex-1"
              >
                {isAddingReading ? 'Adding...' : 'Add Reading'}
              </Button>
              
              <Button
                onClick={() => {
                  setSelectedSensor('');
                  setNewReading({
                    temperature: '',
                    humidity: '',
                    pressure: '',
                    carbonLevel: '',
                    waterLevel: '',
                    windSpeed: ''
                  });
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Sensors Message */}
      {sensors.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sensors Found</h3>
            <p className="text-muted-foreground mb-4">
              Add your first sensor to start monitoring environmental data
            </p>
            <Button onClick={handleAddSensor} disabled={isAddingSensor}>
              <Plus className="w-4 h-4 mr-2" />
              {isAddingSensor ? 'Adding...' : 'Add First Sensor'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

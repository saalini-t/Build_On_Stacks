import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { stacksService } from '../lib/stacks-service';

interface ProjectFormData {
  name: string;
  description: string;
  projectType: string;
  location: string;
  latitude: string;
  longitude: string;
  area: string;
  estimatedCredits: number;
  startDate: string;
  endDate: string;
  developerName: string;
  developerEmail: string;
  verificationDocuments: string;
  satelliteImagery: string;
}

export function ProjectRegistrationForm() {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    projectType: '',
    location: '',
    latitude: '',
    longitude: '',
    area: '',
    estimatedCredits: 0,
    startDate: '',
    endDate: '',
    developerName: '',
    developerEmail: '',
    verificationDocuments: '',
    satelliteImagery: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProjectFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.projectType || !formData.location) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit to blockchain
      const result = await stacksService.addProject();
      
      if (result.success) {
        toast({
          title: "Project Registered! 🎉",
          description: `Project "${formData.name}" has been registered on the blockchain. Project ID: ${result.projectId}`,
        });
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          projectType: '',
          location: '',
          latitude: '',
          longitude: '',
          area: '',
          estimatedCredits: 0,
          startDate: '',
          endDate: '',
          developerName: '',
          developerEmail: '',
          verificationDocuments: '',
          satelliteImagery: ''
        });
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Failed to register project on blockchain",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Project registration error:', error);
      toast({
        title: "Error",
        description: "Failed to register project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🌊 Register Blue Carbon Project</CardTitle>
        <CardDescription>
          Submit your blue carbon project for verification and credit generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Project Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Mangrove Restoration Project"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mangrove">Mangrove Restoration</SelectItem>
                  <SelectItem value="seagrass">Seagrass Conservation</SelectItem>
                  <SelectItem value="saltmarsh">Salt Marsh Protection</SelectItem>
                  <SelectItem value="kelp">Kelp Forest Restoration</SelectItem>
                  <SelectItem value="coral">Coral Reef Protection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project goals, methodology, and expected environmental impact..."
              rows={4}
            />
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                placeholder="19.0760"
                type="number"
                step="any"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                placeholder="72.8777"
                type="number"
                step="any"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Project Area</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="50 hectares"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedCredits">Estimated Credits</Label>
              <Input
                id="estimatedCredits"
                value={formData.estimatedCredits}
                onChange={(e) => handleInputChange('estimatedCredits', parseInt(e.target.value) || 0)}
                placeholder="500"
                type="number"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                type="date"
              />
            </div>
          </div>

          {/* Developer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developerName">Developer Name</Label>
              <Input
                id="developerName"
                value={formData.developerName}
                onChange={(e) => handleInputChange('developerName', e.target.value)}
                placeholder="Your Name or Organization"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="developerEmail">Developer Email</Label>
              <Input
                id="developerEmail"
                value={formData.developerEmail}
                onChange={(e) => handleInputChange('developerEmail', e.target.value)}
                placeholder="developer@example.com"
                type="email"
              />
            </div>
          </div>

          {/* Documentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="verificationDocuments">Verification Documents</Label>
              <Input
                id="verificationDocuments"
                value={formData.verificationDocuments}
                onChange={(e) => handleInputChange('verificationDocuments', e.target.value)}
                placeholder="Link to verification documents"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="satelliteImagery">Satellite Imagery</Label>
              <Input
                id="satelliteImagery"
                value={formData.satelliteImagery}
                onChange={(e) => handleInputChange('satelliteImagery', e.target.value)}
                placeholder="Link to satellite imagery"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Expected Completion Date</Label>
            <Input
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              type="date"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Registering Project..." : "🚀 Register Project on Blockchain"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>📋 All projects are verified and audited before credit generation</p>
            <p>🔒 Your project data is stored securely on the Stacks blockchain</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

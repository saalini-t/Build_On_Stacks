import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { Upload, MapPin, TreePine, Waves, Mountain } from "lucide-react";

const formSchema = insertProjectSchema.extend({
  verificationDocuments: z.object({
    eia: z.boolean().default(false),
    baseline: z.boolean().default(false),
    community: z.boolean().default(false),
    government: z.boolean().default(false),
  }),
  satelliteImagery: z.object({
    before: z.string().optional(),
    after: z.string().optional(),
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

const projectTypes = [
  { value: "mangrove", label: "Mangrove Restoration", icon: TreePine },
  { value: "seagrass", label: "Seagrass Conservation", icon: Waves },
  { value: "salt_marsh", label: "Salt Marsh Protection", icon: Mountain },
  { value: "tidal_wetland", label: "Tidal Wetland Enhancement", icon: TreePine },
];

export default function ProjectRegistrationForm() {
  const { toast } = useToast();
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      projectType: "mangrove",
      area: "0",
      latitude: "0",
      longitude: "0",
      location: "",
      developerId: "user-1", // Simulated developer ID
      estimatedCredits: 0,
      verificationDocuments: {
        eia: false,
        baseline: false,
        community: false,
        government: false,
      },
      satelliteImagery: {
        before: "",
        after: "",
      },
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Submitted",
        description: "Your blue carbon project has been submitted for verification.",
      });
      form.reset();
      setBeforeImage(null);
      setAfterImage(null);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (file: File, type: "before" | "after") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (type === "before") {
        setBeforeImage(imageUrl);
        form.setValue("satelliteImagery.before", file.name);
      } else {
        setAfterImage(imageUrl);
        form.setValue("satelliteImagery.after", file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TreePine className="w-6 h-6 text-primary" />
          <span>Register New Blue Carbon Project</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Submit your mangrove restoration, seagrass bed, or salt marsh project for verification
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Details */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Coastal Mangrove Restoration - Tamil Nadu"
                          {...field}
                          data-testid="input-project-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project-type">
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center space-x-2">
                                  <type.icon className="w-4 h-4" />
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (hectares)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="250"
                            {...field}
                            data-testid="input-area"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="11.0168"
                            {...field}
                            data-testid="input-latitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="76.9558"
                            {...field}
                            data-testid="input-longitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Kochi, Kerala, India"
                          {...field}
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedCredits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Credits</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="125"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || 0}
                          data-testid="input-estimated-credits"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe the project goals, methodology, and expected carbon sequestration outcomes..."
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Satellite Imagery and Verification */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-4">Satellite Imagery</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Before Image</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        {beforeImage ? (
                          <img
                            src={beforeImage}
                            alt="Before restoration"
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "before");
                          }}
                          className="hidden"
                          id="before-image"
                          data-testid="input-before-image"
                        />
                        <label htmlFor="before-image" className="cursor-pointer">
                          <p className="text-xs text-muted-foreground">Upload before image</p>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">After Image</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        {afterImage ? (
                          <img
                            src={afterImage}
                            alt="After restoration"
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "after");
                          }}
                          className="hidden"
                          id="after-image"
                          data-testid="input-after-image"
                        />
                        <label htmlFor="after-image" className="cursor-pointer">
                          <p className="text-xs text-muted-foreground">Upload after image</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-foreground mb-4">Verification Documents</h4>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="verificationDocuments.eia"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-eia"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Environmental Impact Assessment</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="verificationDocuments.baseline"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-baseline"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Baseline Carbon Measurements</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="verificationDocuments.community"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-community"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Local Community Agreements</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="verificationDocuments.government"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-government"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Government Approvals</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit-project"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Project for Verification"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

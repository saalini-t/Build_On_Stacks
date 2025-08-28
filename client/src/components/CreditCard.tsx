import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { MapPin, TreePine, Waves, Mountain } from "lucide-react";

interface CreditCardProps {
  credit: any;
  onPurchase: (creditId: string, amount: number) => void;
  isPurchasing: boolean;
}

const projectTypeIcons = {
  mangrove: TreePine,
  seagrass: Waves, 
  salt_marsh: Mountain,
};

const projectImages = {
  mangrove: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  seagrass: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  salt_marsh: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
};

export default function CreditCard({ credit, onPurchase, isPurchasing }: CreditCardProps) {
  const { data: project } = useQuery({
    queryKey: ["/api/projects", credit.projectId],
  }) as { data: any };

  const projectType = project?.projectType || "mangrove";
  const IconComponent = projectTypeIcons[projectType as keyof typeof projectTypeIcons] || TreePine;
  const imageUrl = projectImages[projectType as keyof typeof projectImages] || projectImages.mangrove;

  return (
    <Card className="credit-card-hover overflow-hidden" data-testid={`credit-card-${credit.id}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${projectType} restoration project`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground" data-testid={`text-project-name-${credit.id}`}>
            {project?.name || "Loading..."}
          </h3>
          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
            Verified
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span data-testid={`text-project-location-${credit.id}`}>
            {project?.location || "Loading..."}
          </span>
          <IconComponent className="w-4 h-4 ml-2" />
          <span className="capitalize">{projectType.replace('_', ' ')}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Credits Available</span>
            <span className="font-medium" data-testid={`text-credits-available-${credit.id}`}>
              {credit.amount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price per Credit</span>
            <span className="font-medium" data-testid={`text-price-${credit.id}`}>
              ${credit.price}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CO₂ per Credit</span>
            <span className="font-medium" data-testid={`text-co2-amount-${credit.id}`}>
              {credit.co2Amount} tonne
            </span>
          </div>
        </div>
        
        <Button
          className="w-full"
          onClick={() => onPurchase(credit.id, credit.amount)}
          disabled={isPurchasing}
          data-testid={`button-purchase-${credit.id}`}
        >
          {isPurchasing ? "Processing..." : "Purchase Credits"}
        </Button>
      </CardContent>
    </Card>
  );
}

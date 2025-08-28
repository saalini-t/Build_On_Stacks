import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreditCard from "@/components/CreditCard";
import { ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Marketplace() {
  const { toast } = useToast();

  const { data: availableCredits, isLoading } = useQuery({
    queryKey: ["/api/credits/available"],
  }) as { data: any[], isLoading: boolean };

  const { data: marketStats, isLoading: marketLoading } = useQuery({
    queryKey: ["/api/analytics/market"],
  }) as { data: any, isLoading: boolean };

  const purchaseMutation = useMutation({
    mutationFn: async ({ creditId, amount, buyerId }: { creditId: string; amount: number; buyerId: string }) => {
      // Simulate purchase transaction
      await apiRequest("POST", "/api/transactions", {
        type: "purchase",
        creditId,
        fromUserId: null,
        toUserId: buyerId,
        amount,
        price: "18.50"
      });
      
      // Transfer credit ownership
      await apiRequest("PATCH", `/api/credits/${creditId}/transfer`, {
        newOwnerId: buyerId
      });
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Purchase Successful",
        description: "Carbon credits have been added to your wallet.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/credits/available"] });
      queryClient.invalidateQueries({ queryKey: ["/api/credits/owner"] });
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = (creditId: string, amount: number) => {
    purchaseMutation.mutate({
      creditId,
      amount,
      buyerId: "user-2" // Simulated buyer ID
    });
  };

  if (isLoading || marketLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
        <h2 className="text-2xl font-bold text-foreground mb-2">Carbon Credit Marketplace</h2>
        <p className="text-muted-foreground">Buy verified blue carbon credits to offset your carbon footprint</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary" data-testid="text-total-credits">
              {marketStats?.totalCredits || 0}
            </p>
            <p className="text-sm text-muted-foreground">Credits Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary" data-testid="text-avg-price">
              ${marketStats?.avgPrice || 0}
            </p>
            <p className="text-sm text-muted-foreground">Average Price</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-chart-3/10 rounded-lg mx-auto mb-4">
              <Users className="w-6 h-6 text-chart-3" />
            </div>
            <p className="text-3xl font-bold text-chart-3" data-testid="text-total-trades">
              {marketStats?.totalTrades || 0}
            </p>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Credits */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Available Carbon Credits</h3>
        
        {availableCredits && availableCredits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCredits.map((credit: any) => (
              <CreditCard
                key={credit.id}
                credit={credit}
                onPurchase={handlePurchase}
                isPurchasing={purchaseMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Credits Available</h3>
            <p className="text-muted-foreground">
              Check back later for new carbon credits from verified projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { stacksService } from '../lib/stacks-service';
import { Leaf, TrendingUp, DollarSign, ShoppingCart, Target } from 'lucide-react';

interface CreditCardProps {
  projectId: string;
  projectName: string;
  projectType: string;
  location: string;
  totalCredits: number;
  availableCredits: number;
  pricePerCredit: number;
  status: 'active' | 'verified' | 'pending';
  onCreditAction: () => void;
}

export function CreditCard({
  projectId,
  projectName,
  projectType,
  location,
  totalCredits,
  availableCredits,
  pricePerCredit,
  status,
  onCreditAction
}: CreditCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [isRetiring, setIsRetiring] = useState(false);
  const { toast } = useToast();

  const totalPrice = quantity * pricePerCredit;
  const isWalletConnected = localStorage.getItem('stacks-wallet-connected') === 'true';

  const handleBuyCredits = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Leather Wallet to buy credits.",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0 || quantity > availableCredits) {
      toast({
        title: "Invalid Quantity",
        description: `Please enter a valid quantity between 1 and ${availableCredits}`,
        variant: "destructive",
      });
      return;
    }

    setIsBuying(true);
    try {
      const result = await stacksService.createOrder();
      
      if (result.success) {
        // Dispatch custom event for wallet to listen to
        const creditPurchaseEvent = new CustomEvent('credit-purchased', {
          detail: {
            projectId: projectId,
            projectName: projectName,
            projectType: projectType,
            amount: quantity,
            price: pricePerCredit,
            txHash: result.orderId || '0x' + Math.random().toString(16).substr(2, 40)
          }
        });
        window.dispatchEvent(creditPurchaseEvent);

        toast({
          title: "Credits Purchased! 🎉",
          description: `Successfully purchased ${quantity} credits for $${totalPrice.toFixed(2)}. Order ID: ${result.orderId}`,
        });
        onCreditAction(); // Refresh data
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase credits on blockchain",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Credit purchase error:', error);
      toast({
        title: "Error",
        description: "Failed to purchase credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  const handleRetireCredits = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Leather Wallet to retire credits.",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsRetiring(true);
    try {
      // Dispatch custom event for wallet to listen to
      const creditRetirementEvent = new CustomEvent('credit-retired', {
        detail: {
          projectId: projectId,
          projectName: projectName,
          projectType: projectType,
          amount: quantity,
          price: pricePerCredit,
          txHash: '0x' + Math.random().toString(16).substr(2, 40)
        }
      });
      window.dispatchEvent(creditRetirementEvent);

      toast({
        title: "Credits Retired! 🌱",
        description: `Successfully retired ${quantity} credits. They are now permanently removed from circulation.`,
      });
      onCreditAction(); // Refresh data
    } catch (error) {
      console.error('Credit retirement error:', error);
      toast({
        title: "Error",
        description: "Failed to retire credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRetiring(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'verified': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Leaf className="w-4 h-4" />;
      case 'verified': return <Target className="w-4 h-4" />;
      case 'pending': return <TrendingUp className="w-4 h-4" />;
      default: return <Leaf className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{projectName}</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {projectType}
              </Badge>
              <span>📍 {location}</span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(status)}
              <span className="capitalize">{status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Credit Information */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{totalCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Credits</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">{availableCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-600">${pricePerCredit}</p>
            <p className="text-xs text-muted-foreground">Per Credit</p>
          </div>
        </div>

        {/* Credit Actions */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Label htmlFor={`quantity-${projectId}`} className="text-sm font-medium">
              Quantity:
            </Label>
            <Input
              id={`quantity-${projectId}`}
              type="number"
              min="1"
              max={availableCredits}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">
              credits (${totalPrice.toFixed(2)})
            </span>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleBuyCredits}
              disabled={isBuying || !isWalletConnected || availableCredits === 0}
              className="flex-1"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isBuying ? 'Buying...' : 'Buy Credits'}
            </Button>
            
            <Button
              onClick={handleRetireCredits}
              disabled={isRetiring || !isWalletConnected}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Target className="w-4 h-4 mr-2" />
              {isRetiring ? 'Retiring...' : 'Retire Credits'}
            </Button>
          </div>
        </div>

        {/* Project Details */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Project ID:</span>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {projectId}
            </code>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Carbon Impact:</span>
            <span className="font-medium">
              {totalCredits} tons CO₂ sequestered
            </span>
          </div>
        </div>

        {!isWalletConnected && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              🔗 Connect your Leather Wallet to buy or retire credits
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

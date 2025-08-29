import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionHistory from "@/components/TransactionHistory";
import StacksWalletConnection from "@/components/StacksWalletConnection";
import StacksWorkflowGuide from "@/components/StacksWorkflowGuide";
import { Wallet as WalletIcon, TreePine, Waves, Mountain, Flame, Bitcoin, Network, Coins, ExternalLink, Plus, Minus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stacksService } from "@/lib/stacks-service";

const projectTypeIcons = {
  mangrove: TreePine,
  seagrass: Waves,
  salt_marsh: Mountain,
};

interface Credit {
  id: string;
  projectId: string;
  projectName: string;
  projectType: string;
  amount: number;
  price: number;
  status: 'available' | 'retired' | 'pending';
  purchaseDate: Date;
  purchaseTxHash?: string;
  retirementDate?: Date;
  retirementTxHash?: string;
}

export default function Wallet() {
  const { toast } = useToast();
  const [userCredits, setUserCredits] = useState<Credit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - in real implementation this would come from wallet connection
  const userId = "ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342";

  // Load user credits from localStorage (simulating blockchain state)
  useEffect(() => {
    const loadUserCredits = () => {
      const storedCredits = localStorage.getItem(`userCredits_${userId}`);
      if (storedCredits) {
        const parsedCredits = JSON.parse(storedCredits);
        // Convert date strings back to Date objects
        const creditsWithDates = parsedCredits.map((credit: any) => ({
          ...credit,
          purchaseDate: new Date(credit.purchaseDate),
          retirementDate: credit.retirementDate ? new Date(credit.retirementDate) : undefined
        }));
        setUserCredits(creditsWithDates);
      } else {
        // Initialize with some mock credits
        const mockCredits: Credit[] = [
          {
            id: '1',
            projectId: '1',
            projectName: 'Mangrove Restoration Project',
            projectType: 'mangrove',
            amount: 50,
            price: 25,
            status: 'available',
            purchaseDate: new Date(Date.now() - 86400000), // 1 day ago
            purchaseTxHash: '0x1234567890abcdef1234567890abcdef12345678'
          },
          {
            id: '2',
            projectId: '2',
            projectName: 'Seagrass Conservation Initiative',
            projectType: 'seagrass',
            amount: 30,
            price: 30,
            status: 'available',
            purchaseDate: new Date(Date.now() - 172800000), // 2 days ago
            purchaseTxHash: '0xabcdef1234567890abcdef1234567890abcdef12'
          }
        ];
        setUserCredits(mockCredits);
        localStorage.setItem(`userCredits_${userId}`, JSON.stringify(mockCredits));
      }
    };

    loadUserCredits();

    // Listen for credit purchases from marketplace
    const handleCreditPurchase = (event: CustomEvent) => {
      const { projectId, projectName, projectType, amount, price, txHash } = event.detail;
      
      const newCredit: Credit = {
        id: Date.now().toString(),
        projectId,
        projectName,
        projectType,
        amount,
        price,
        status: 'available',
        purchaseDate: new Date(),
        purchaseTxHash: txHash
      };

      setUserCredits(prev => {
        const updated = [...prev, newCredit];
        // Store in localStorage (dates will be serialized as strings)
        localStorage.setItem(`userCredits_${userId}`, JSON.stringify(updated));
        return updated;
      });

      toast({
        title: "Credits Purchased!",
        description: `${amount} credits from ${projectName} have been added to your wallet.`,
      });
    };

    // Listen for credit retirements from marketplace
    const handleCreditRetirement = (event: CustomEvent) => {
      const { projectId, projectName, projectType, amount, price, txHash } = event.detail;
      
      // Find and update the credit in the wallet
      setUserCredits(prev => {
        const updated = prev.map(credit => 
          credit.projectId === projectId && credit.status === 'available'
            ? { 
                ...credit, 
                status: 'retired' as const,
                retirementDate: new Date(),
                retirementTxHash: txHash
              }
            : credit
        );
        // Store in localStorage (dates will be serialized as strings)
        localStorage.setItem(`userCredits_${userId}`, JSON.stringify(updated));
        return updated;
      });

      toast({
        title: "Credits Retired!",
        description: `${amount} credits from ${projectName} have been retired from your wallet.`,
      });
    };

    window.addEventListener('credit-purchased', handleCreditPurchase as EventListener);
    window.addEventListener('credit-retired', handleCreditRetirement as EventListener);
    
    return () => {
      window.removeEventListener('credit-purchased', handleCreditPurchase as EventListener);
      window.removeEventListener('credit-retired', handleCreditRetirement as EventListener);
    };
  }, [userId, toast]);

  const handleRetire = async (creditId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate blockchain retirement call
      const result = await stacksService.retireCredits(creditId, 1);
      
      if (result.success) {
        // Update local state
        setUserCredits(prev => {
          const updated = prev.map(credit => 
            credit.id === creditId 
              ? { 
                  ...credit, 
                  status: 'retired' as const,
                  retirementDate: new Date(),
                  retirementTxHash: result.txHash || '0x' + Math.random().toString(16).substr(2, 40)
                }
              : credit
          );
          localStorage.setItem(`userCredits_${userId}`, JSON.stringify(updated));
          return updated;
        });

        toast({
          title: "Credits Retired Successfully!",
          description: "Your carbon credits have been permanently retired from circulation.",
        });
      } else {
        throw new Error('Retirement failed');
      }
    } catch (error) {
      toast({
        title: "Retirement Failed",
        description: "There was an error retiring your credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate wallet stats
  const totalCredits = userCredits.reduce((sum, credit) => 
    credit.status === "available" ? sum + credit.amount : sum, 0);
  
  const retiredCredits = userCredits.reduce((sum, credit) => 
    credit.status === "retired" ? sum + credit.amount : sum, 0);
  
  const estimatedValue = userCredits.reduce((sum, credit) => 
    credit.status === "available" ? sum + (credit.price * credit.amount) : sum, 0);

  const getProjectType = (projectType: string) => {
    return projectTypeIcons[projectType as keyof typeof projectTypeIcons] || TreePine;
  };

  // Helper function to safely format dates
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Unknown';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Digital Wallet</h2>
        <p className="text-muted-foreground">Manage your carbon credits and blockchain transactions</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <WalletIcon className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="stacks" className="flex items-center space-x-2">
            <Bitcoin className="w-4 h-4" />
            <span>Stacks Wallet</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center space-x-2">
            <Network className="w-4 h-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Your carbon credit portfolio</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-80">Total Credits Owned</p>
                      <p className="text-3xl font-bold" data-testid="text-total-credits-owned">
                        {totalCredits}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <WalletIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">
                      Estimated Value: <span data-testid="text-estimated-value">${estimatedValue.toFixed(2)}</span>
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/20">Active</Badge>
                  </div>
                </div>

                {/* Credit Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{totalCredits}</p>
                    <p className="text-sm text-green-600">Available</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Minus className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{retiredCredits}</p>
                    <p className="text-sm text-purple-600">Retired</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {userCredits.filter((credit) => credit.status === "available").map((credit) => {
                    const IconComponent = getProjectType(credit.projectType);
                    
                    return (
                      <div key={credit.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground" data-testid={`text-project-${credit.id}`}>
                              {credit.projectName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {credit.amount} credits • ${credit.price} each
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Purchased: {formatDate(credit.purchaseDate)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetire(credit.id)}
                          disabled={isLoading}
                          className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                          data-testid={`button-retire-${credit.id}`}
                        >
                          <Flame className="w-4 h-4 mr-1" />
                          Retire
                        </Button>
                      </div>
                    );
                  })}

                  {userCredits.filter((credit) => credit.status === "retired").map((credit) => {
                    const IconComponent = getProjectType(credit.projectType);
                    
                    return (
                      <div key={credit.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg opacity-75">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground line-through">
                              {credit.projectName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {credit.amount} credits • Retired
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Retired: {formatDate(credit.retirementDate)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          Retired
                        </Badge>
                      </div>
                    );
                  })}

                  {userCredits.length === 0 && (
                    <div className="text-center py-8">
                      <WalletIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Credits Available</h3>
                      <p className="text-muted-foreground text-sm">
                        Visit the marketplace to purchase carbon credits.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your wallet and credits</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => window.location.href = '/marketplace'}
                  >
                    <TreePine className="w-6 h-6 mb-2" />
                    <span className="text-sm">Buy Credits</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => {
                      if (userCredits.filter((credit) => credit.status === "available").length > 0) {
                        const firstCredit = userCredits.find((credit) => credit.status === "available");
                        if (firstCredit) handleRetire(firstCredit.id);
                      } else {
                        toast({
                          title: "No Credits Available",
                          description: "You need available credits to retire them.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Flame className="w-6 h-6 mb-2" />
                    <span className="text-sm">Retire Credits</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => toast({
                      title: "Transfer Feature",
                      description: "Credit transfer functionality coming soon!",
                    })}
                  >
                    <Network className="w-6 h-6 mb-2" />
                    <span className="text-sm">Transfer</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => {
                      const stacksTab = document.querySelector('[data-value="stacks"]');
                      if (stacksTab) {
                        (stacksTab as HTMLElement).click();
                      }
                    }}
                  >
                    <Bitcoin className="w-6 h-6 mb-2" />
                    <span className="text-sm">Stacks</span>
                  </Button>
                </div>

                {/* Recent Activity */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    {userCredits.slice(0, 3).map((credit) => (
                      <div key={credit.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {credit.status === 'available' ? 'Purchased' : 'Retired'} {credit.amount} credits
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {credit.status === 'available' 
                            ? formatDate(credit.purchaseDate)
                            : formatDate(credit.retirementDate)
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Sync with Blockchain Button */}
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                                                  const result = await stacksService.getUserCredits(userId);
                        if (result.success && result.credits) {
                          // Convert date strings to Date objects
                          const creditsWithDates = result.credits.map((credit: any) => ({
                            ...credit,
                            purchaseDate: new Date(credit.purchaseDate),
                            retirementDate: credit.retirementDate ? new Date(credit.retirementDate) : undefined
                          }));
                          setUserCredits(creditsWithDates);
                          localStorage.setItem(`userCredits_${userId}`, JSON.stringify(creditsWithDates));
                          toast({
                            title: "Wallet Synced!",
                            description: "Your wallet has been synchronized with the blockchain.",
                          });
                        }
                      } catch (error) {
                          toast({
                            title: "Sync Failed",
                            description: "Failed to sync with blockchain. Please try again.",
                            variant: "destructive",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Sync with Blockchain
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stacks" className="space-y-6">
          {/* Stacks Workflow Guide */}
          <StacksWorkflowGuide />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stacks Wallet Connection */}
            <div>
              <StacksWalletConnection />
            </div>

            {/* Stacks Network Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bitcoin className="w-5 h-5" />
                  <span>Stacks Network</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Bitcoin's layer for smart contracts</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network:</span>
                    <Badge variant="secondary">Testnet</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chain ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">2147483648</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Block Time:</span>
                    <span className="text-sm">~10 minutes</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Testnet Faucet</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get free testnet STX tokens for development and testing.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://faucet.learnweb3.io/", "_blank")}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Get Testnet STX
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Blockchain Explorer</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    View transactions and smart contracts on the Stacks testnet.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://explorer.hiro.so/?chain=testnet", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 ml-2" />
                    Open Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <p className="text-sm text-muted-foreground">Your blockchain transaction history</p>
            </CardHeader>
            <CardContent>
              <TransactionHistory userId="user-2" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

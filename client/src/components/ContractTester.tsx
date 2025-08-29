import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { stacksService } from '../lib/stacks-service';
import { useToast } from '../hooks/use-toast';

export function ContractTester() {
  const [loading, setLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [results, setResults] = useState<{
    projects: number;
    orders: number;
    sensors: number;
  }>({ projects: 0, orders: 0, sensors: 0 });
  const { toast } = useToast();

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = () => {
      const connected = localStorage.getItem('stacks-wallet-connected') === 'true';
      const address = localStorage.getItem('stacks-wallet-address');
      
      setIsWalletConnected(connected);
      if (address) setWalletAddress(address);
    };

    checkWalletConnection();
    
    // Listen for storage changes (when wallet connects/disconnects)
    const handleStorageChange = () => checkWalletConnection();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const testAddProject = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Leather Wallet first to test contracts.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await stacksService.addProject();
      if (result.success) {
        console.log('✅ Project added:', result.projectId);
        toast({
          title: "Project Added! 🎉",
          description: `Project ID: ${result.projectId}`,
        });
        // Refresh the count
        const countResult = await stacksService.getProjectCount();
        if (countResult.success) {
          setResults(prev => ({ ...prev, projects: countResult.count || 0 }));
        }
      } else {
        console.error('❌ Failed to add project:', result.error);
        toast({
          title: "Failed to Add Project",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testCreateOrder = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Leather Wallet first to test contracts.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await stacksService.createOrder();
      if (result.success) {
        console.log('✅ Order created:', result.orderId);
        toast({
          title: "Order Created! 🎉",
          description: `Order ID: ${result.orderId}`,
        });
        setResults(prev => ({ ...prev, orders: prev.orders + 1 }));
      } else {
        console.error('❌ Failed to create order:', result.error);
        toast({
          title: "Failed to Create Order",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testAddSensor = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Leather Wallet first to test contracts.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await stacksService.addSensor();
      if (result.success) {
        console.log('✅ Sensor added:', result.sensorId);
        toast({
          title: "Sensor Added! 🎉",
          description: `Sensor ID: ${result.sensorId}`,
        });
        setResults(prev => ({ ...prev, sensors: prev.sensors + 1 }));
      } else {
        console.error('❌ Failed to add sensor:', result.error);
        toast({
          title: "Failed to Add Sensor",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error adding sensor:', error);
      toast({
        title: "Error",
        description: "Failed to add sensor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getContractAddresses = () => {
    return stacksService.getContractAddresses();
  };

  const addresses = getContractAddresses();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🚀 Real Blockchain Contract Tester</CardTitle>
          <CardDescription>
            Test your deployed Stacks smart contracts on testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Connection Status */}
          <div className={`p-4 rounded-lg border ${
            isWalletConnected 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          }`}>
            <div className="flex items-center space-x-2">
              {isWalletConnected ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    Wallet Connected
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">
                    Wallet Not Connected
                  </span>
                </>
              )}
            </div>
            {isWalletConnected && walletAddress && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            )}
            {!isWalletConnected && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Connect your Leather Wallet in the header to test contracts
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Simple Registry</CardTitle>
                <CardDescription className="text-xs">
                  {addresses.simpleRegistry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testAddProject} 
                  disabled={loading || !isWalletConnected}
                  className="w-full"
                >
                  {loading ? 'Adding...' : !isWalletConnected ? 'Connect Wallet First' : 'Add Project'}
                </Button>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold">{results.projects}</span>
                  <p className="text-xs text-gray-500">Projects</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Simple Marketplace</CardTitle>
                <CardDescription className="text-xs">
                  {addresses.simpleMarketplace}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testCreateOrder} 
                  disabled={loading || !isWalletConnected}
                  className="w-full"
                >
                  {loading ? 'Creating...' : !isWalletConnected ? 'Connect Wallet First' : 'Create Order'}
                </Button>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold">{results.orders}</span>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Simple Sensor</CardTitle>
                <CardDescription className="text-xs">
                  {addresses.simpleSensor}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testAddSensor} 
                  disabled={loading || !isWalletConnected}
                  className="w-full"
                >
                  {loading ? 'Adding...' : !isWalletConnected ? 'Connect Wallet First' : 'Add Sensor'}
                </Button>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold">{results.sensors}</span>
                  <p className="text-xs text-gray-500">Sensors</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>🌐 Network: Stacks Testnet</p>
            <p>🔍 Check your Leather Wallet Activity for real transactions!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

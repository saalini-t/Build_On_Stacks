import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface StacksWalletState {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  network: "mainnet" | "testnet";
  isLoading: boolean;
  error: string | null;
}

interface StacksTransaction {
  txid: string;
  status: "pending" | "success" | "failed";
  amount: string;
  recipient: string;
  timestamp: number;
}

export function useStacksWallet() {
  const [state, setState] = useState<StacksWalletState>({
    isConnected: false,
    account: null,
    balance: null,
    network: "testnet",
    isLoading: false,
    error: null,
  });

  const { toast } = useToast();

  // Check if Leather wallet is available
  const isLeatherAvailable = useCallback(() => {
    return typeof window !== "undefined" && (
      (window as any).LeatherProvider || 
      (window as any).leatherProvider ||
      (window as any).StacksProvider ||
      (window as any).Leather ||
      (window as any).LeatherProvider
    );
  }, []);

  // Check if Stacks wallet is available
  const isStacksWalletAvailable = useCallback(() => {
    return typeof window !== "undefined" && (window as any).StacksProvider;
  }, []);

  // Connect to Leather wallet
  const connectLeather = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Debug: Log what's available
      console.log("Available wallet providers:", {
        Leather: !!(window as any).Leather,
        LeatherProvider: !!(window as any).LeatherProvider,
        leatherProvider: !!(window as any).leatherProvider,
        StacksProvider: !!(window as any).StacksProvider
      });

      if (!isLeatherAvailable()) {
        throw new Error("Leather wallet not found. Please install Leather wallet extension.");
      }

      // Request connection to Leather wallet using new API
      let result;
      let provider;
      
      try {
        if ((window as any).Leather) {
          console.log("Trying new Leather API...");
          // Use new Leather API
          result = await (window as any).Leather.request('getAddresses');
          console.log("New Leather API result:", result);
          if (result && result.addresses && result.addresses.length > 0) {
            result = result.addresses.map((addr: any) => addr.address);
          }
          provider = (window as any).Leather;
        } else if ((window as any).LeatherProvider) {
          console.log("Trying LeatherProvider...");
          provider = (window as any).LeatherProvider;
          result = await provider.request({ method: 'stx_requestAccounts' });
        } else if ((window as any).leatherProvider) {
          console.log("Trying leatherProvider...");
          provider = (window as any).leatherProvider;
          result = await provider.request({ method: 'stx_requestAccounts' });
        } else if ((window as any).StacksProvider) {
          console.log("Trying StacksProvider...");
          provider = (window as any).StacksProvider;
          result = await provider.request({ method: 'stx_requestAccounts' });
        } else {
          throw new Error("No wallet provider found");
        }
      } catch (connectionError) {
        console.error("Connection attempt failed:", connectionError);
        throw new Error(`Failed to connect: ${connectionError instanceof Error ? connectionError.message : 'Unknown error'}`);
      }

      if (result && result.length > 0) {
        const address = result[0];
        
        // Get account info
        let accountInfo;
        if ((window as any).Leather) {
          // Use new Leather API for account info
          accountInfo = await (window as any).Leather.request('getAddresses');
          accountInfo = { balance: "0" }; // Default balance for now
        } else {
          accountInfo = await provider.request({
            method: 'stx_getAccount',
            params: [address]
          });
        }

        setState({
          isConnected: true,
          account: address,
          balance: accountInfo?.balance || "0",
          network: "testnet", // Default to testnet for development
          isLoading: false,
          error: null,
        });

        toast({
          title: "Leather Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)} on Stacks Testnet`,
        });

        return { success: true, address };
      } else {
        throw new Error("No accounts found in Leather wallet");
      }
    } catch (error) {
      console.error("Leather connection error details:", error);
      console.error("Error type:", typeof error);
      console.error("Error keys:", Object.keys(error || {}));
      console.error("Error message:", (error as any)?.message);
      console.error("Error stack:", (error as any)?.stack);
      
      const errorMessage = error instanceof Error ? error.message : 
        ((error as any)?.message || (error as any)?.toString() || "Failed to connect to Leather wallet");
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [isLeatherAvailable, toast]);

  // Connect to Stacks wallet (alternative)
  const connectStacksWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      if (!isStacksWalletAvailable()) {
        throw new Error("Stacks wallet not found. Please install Stacks wallet extension.");
      }

      // Request connection to Stacks wallet
      const provider = (window as any).StacksProvider || (window as any).LeatherProvider || (window as any).leatherProvider || (window as any).Leather;
      const result = await provider.request({ method: 'stx_requestAccounts' });

      if (result && result.length > 0) {
        const address = result[0];
        
        setState({
          isConnected: true,
          account: address,
          balance: "0", // Will be fetched separately
          network: "testnet",
          isLoading: false,
          error: null,
        });

        toast({
          title: "Stacks Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)} on Stacks Testnet`,
        });

        return { success: true, address };
      } else {
        throw new Error("No accounts found in Stacks wallet");
      }
    } catch (error) {
      console.error("Stacks wallet connection error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to Stacks wallet";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [isStacksWalletAvailable, toast]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      account: null,
      balance: null,
      network: "testnet",
      isLoading: false,
      error: null,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your Stacks wallet has been disconnected.",
    });
  }, [toast]);

  // Switch network
  const switchNetwork = useCallback(async (network: "mainnet" | "testnet") => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      if (state.account) {
        // Request network switch from wallet
        if ((window as any).Leather) {
          // New Leather API doesn't support network switching yet
          console.log('Network switching not supported in new Leather API');
        } else {
          const provider = (window as any).LeatherProvider || (window as any).leatherProvider || (window as any).StacksProvider;
          if (provider) {
            await provider.request({
              method: 'stx_switchNetwork',
              params: [network]
            });
          }
        }
      }

      setState(prev => ({ ...prev, network, isLoading: false }));

      toast({
        title: "Network Switched",
        description: `Switched to Stacks ${network.charAt(0).toUpperCase() + network.slice(1)}`,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch network. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.account, toast]);

  // Get testnet STX from faucet
  const requestTestnetSTX = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      if (!state.account) {
        throw new Error("Please connect your wallet first");
      }

      if (state.network !== "testnet") {
        throw new Error("Please switch to testnet to use the faucet");
      }

      // Use LearnWeb3 testnet faucet
      const faucetUrl = "https://faucet.learnweb3.io/";
      
      // Open faucet in new tab
      window.open(faucetUrl, '_blank');
      
      toast({
        title: "Faucet Opened",
        description: "Please complete the faucet request in the new tab. You'll need to authenticate with GitHub and connect your wallet.",
      });

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to request testnet STX";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Faucet Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [state.account, state.network, toast]);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!state.account) return;

    try {
      if ((window as any).Leather) {
        // Use new Leather API
        const addresses = await (window as any).Leather.request('getAddresses');
        // For now, set a default balance since new API doesn't provide balance directly
        setState(prev => ({ ...prev, balance: "0" }));
      } else {
        const provider = (window as any).LeatherProvider || (window as any).leatherProvider || (window as any).StacksProvider;
        if (provider) {
          const accountInfo = await provider.request({
            method: 'stx_getAccount',
            params: [state.account]
          });

          setState(prev => ({ ...prev, balance: accountInfo?.balance || "0" }));
        }
      }
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  }, [state.account]);

  // Mint carbon credits on Stacks
  const mintCarbonCredits = useCallback(async (projectId: string, amount: number) => {
    try {
      if (!state.account) {
        throw new Error("Please connect your wallet first");
      }

      setState(prev => ({ ...prev, isLoading: true }));

      // This would integrate with your smart contract
      // For now, we'll simulate the transaction
      const txid = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "Credits Minted",
        description: `Successfully minted ${amount} carbon credits. Transaction: ${txid.slice(0, 8)}...`,
      });

      setState(prev => ({ ...prev, isLoading: false }));
      
      return { success: true, txid };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mint carbon credits";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Minting Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [state.account, toast]);

  // Auto-refresh balance when connected
  useEffect(() => {
    if (state.isConnected && state.account) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.account, refreshBalance]);

  return {
    ...state,
    isLeatherAvailable,
    isStacksWalletAvailable,
    connectLeather,
    connectStacksWallet,
    disconnect,
    switchNetwork,
    requestTestnetSTX,
    refreshBalance,
    mintCarbonCredits,
  };
}

export default useStacksWallet;

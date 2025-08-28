import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Web3State {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  network: string | null;
  isLoading: boolean;
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    account: null,
    balance: null,
    network: null,
    isLoading: false,
  });

  const { toast } = useToast();

  // Simulate MetaMask availability check
  const isMetaMaskAvailable = () => {
    return typeof window !== "undefined" && (window as any).ethereum;
  };

  const connectMutation = useMutation({
    mutationFn: async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock wallet address
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      const response = await apiRequest("POST", "/api/web3/connect", {
        walletAddress: mockAddress
      });
      
      const data = await response.json();
      
      return {
        account: mockAddress,
        balance: data.balance || "2.5 ETH",
        network: data.network || "Ethereum Mainnet"
      };
    },
    onSuccess: (data) => {
      setState({
        isConnected: true,
        account: data.account,
        balance: data.balance,
        network: data.network,
        isLoading: false,
      });
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${data.account.slice(0, 6)}...${data.account.slice(-4)}`,
      });
    },
    onError: () => {
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const disconnect = () => {
    setState({
      isConnected: false,
      account: null,
      balance: null,
      network: null,
      isLoading: false,
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const mintCreditsMutation = useMutation({
    mutationFn: async ({ projectId, amount, ownerId }: { 
      projectId: string; 
      amount: number; 
      ownerId: string;
    }) => {
      const response = await apiRequest("POST", "/api/web3/mint", {
        projectId,
        amount,
        ownerId
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Credits Minted",
        description: `Successfully minted ${data.amount || "credits"} carbon credits.`,
      });
    },
    onError: () => {
      toast({
        title: "Minting Failed",
        description: "There was an error minting the credits.",
        variant: "destructive",
      });
    },
  });

  const switchNetwork = async (networkId: string) => {
    // Simulate network switching
    setState(prev => ({
      ...prev,
      network: networkId === "1" ? "Ethereum Mainnet" : "Polygon Mainnet"
    }));
    
    toast({
      title: "Network Switched",
      description: `Switched to ${networkId === "1" ? "Ethereum" : "Polygon"}`,
    });
  };

  const getTransactionReceipt = async (txHash: string) => {
    // Simulate transaction receipt retrieval
    return {
      transactionHash: txHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      gasUsed: "21000",
      status: 1,
    };
  };

  const estimateGas = async (transaction: any) => {
    // Simulate gas estimation
    return {
      gasLimit: "21000",
      gasPrice: "20000000000", // 20 gwei
      estimatedCost: "0.00042 ETH"
    };
  };

  return {
    ...state,
    isMetaMaskAvailable: isMetaMaskAvailable(),
    connect: connectMutation.mutate,
    disconnect,
    mintCredits: mintCreditsMutation.mutate,
    switchNetwork,
    getTransactionReceipt,
    estimateGas,
    isConnecting: connectMutation.isPending,
    isMinting: mintCreditsMutation.isPending,
  };
}

export default useWeb3;

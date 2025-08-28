import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

export default function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  const connectMutation = useMutation({
    mutationFn: async () => {
      // Simulate MetaMask connection
      const mockAddress = "0x1234567890123456789012345678901234567890";
      
      const response = await apiRequest("POST", "/api/web3/connect", {
        walletAddress: mockAddress
      });
      
      return { address: mockAddress, ...response };
    },
    onSuccess: (data) => {
      setIsConnected(true);
      setWalletAddress(data.address);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${data.address.slice(0, 6)}...${data.address.slice(-4)}`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConnect = () => {
    connectMutation.mutate();
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <>
      {isConnected ? (
        <Button
          variant="outline"
          onClick={handleDisconnect}
          className="text-sm"
          data-testid="button-disconnect-wallet"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={connectMutation.isPending}
          className="text-sm"
          data-testid="button-connect-wallet"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {connectMutation.isPending ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame, Coins, ExternalLink } from "lucide-react";

interface TransactionHistoryProps {
  userId: string;
}

const transactionIcons = {
  purchase: ShoppingCart,
  retirement: Flame,
  minting: Coins,
  sale: ShoppingCart,
};

const transactionColors = {
  purchase: "text-secondary",
  retirement: "text-accent",
  minting: "text-primary",
  sale: "text-chart-3",
};

export default function TransactionHistory({ userId }: TransactionHistoryProps) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions/user", userId],
  }) as { data: any[], isLoading: boolean };

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  }) as { data: any[] };

  const getProjectName = (creditId: string) => {
    // In a real app, you'd need to fetch credit details first
    // For now, we'll use mock project names
    const mockProjectNames: { [key: string]: string } = {
      "credit-1": "Kerala Mangrove Conservation",
      "credit-2": "Goa Seagrass Protection", 
      "credit-3": "Sundarbans Salt Marsh",
    };
    return mockProjectNames[creditId] || "Unknown Project";
  };

  const formatAmount = (type: string, amount: number) => {
    switch (type) {
      case "purchase":
      case "minting":
        return `+${amount} credits`;
      case "retirement":
      case "sale":
        return `-${amount} credits`;
      default:
        return `${amount} credits`;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions && transactions.length > 0 ? (
        transactions.map((tx: any) => {
          const IconComponent = transactionIcons[tx.type as keyof typeof transactionIcons] || ShoppingCart;
          const iconColor = transactionColors[tx.type as keyof typeof transactionColors];

          return (
            <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`transaction-${tx.id}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${tx.type === 'purchase' ? 'secondary' : tx.type === 'retirement' ? 'accent' : 'primary'}/10 rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="font-medium text-foreground capitalize" data-testid={`text-tx-type-${tx.id}`}>
                    {tx.type}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-tx-project-${tx.id}`}>
                    {getProjectName(tx.creditId)}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`text-tx-time-${tx.id}`}>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground" data-testid={`text-tx-amount-${tx.id}`}>
                  {formatAmount(tx.type, tx.amount)}
                </p>
                {tx.txHash && (
                  <a 
                    href={`https://etherscan.io/tx/${tx.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center justify-end"
                    data-testid={`link-tx-hash-${tx.id}`}
                  >
                    View on Explorer
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Transactions</h3>
          <p className="text-muted-foreground text-sm">
            Your transaction history will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

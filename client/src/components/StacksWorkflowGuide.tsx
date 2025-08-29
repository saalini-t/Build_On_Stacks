import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  ExternalLink, 
  Wallet, 
  Github, 
  Coins,
  ArrowRight,
  Play,
  Pause
} from "lucide-react";
import { useStacksWallet } from "@/hooks/useStacksWallet";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  action?: () => void;
  externalLink?: string;
  requirements?: string[];
}

export default function StacksWorkflowGuide() {
  const { isConnected, account, network } = useStacksWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: "Install Leather Wallet",
      description: "Install the Leather wallet browser extension",
      status: "pending",
      externalLink: "https://leather.io",
      requirements: ["Browser extension access"]
    },
    {
      id: 2,
      title: "Create/Import Wallet",
      description: "Set up your wallet with a new account or import existing one",
      status: "pending",
      requirements: ["Secret recovery phrase (if importing)"]
    },
    {
      id: 3,
      title: "Switch to Testnet",
      description: "Change your wallet network to Stacks testnet",
      status: "pending",
      requirements: ["Wallet unlocked"]
    },
    {
      id: 4,
      title: "Connect to Blue Carbon Registry",
      description: "Connect your wallet to this application",
      status: "pending",
      requirements: ["Wallet on testnet", "Extension enabled"]
    },
    {
      id: 5,
      title: "Authenticate with GitHub",
      description: "Link your GitHub account to the faucet",
      status: "pending",
      externalLink: "https://faucet.learnweb3.io/",
      requirements: ["GitHub account", "Browser session"]
    },
    {
      id: 6,
      title: "Connect Wallet to Faucet",
      description: "Connect your Leather wallet to the LearnWeb3 faucet",
      status: "pending",
      externalLink: "https://faucet.learnweb3.io/",
      requirements: ["GitHub authenticated", "Wallet unlocked"]
    },
    {
      id: 7,
      title: "Request Test Tokens",
      description: "Request testnet STX tokens for development",
      status: "pending",
      externalLink: "https://faucet.learnweb3.io/",
      requirements: ["Wallet connected to faucet", "GitHub linked"]
    },
    {
      id: 8,
      title: "Verify Balance",
      description: "Check that tokens have been received in your wallet",
      status: "pending",
      requirements: ["Transaction confirmed", "Wallet refreshed"]
    },
    {
      id: 9,
      title: "Start Development",
      description: "Begin testing carbon credit operations on testnet",
      status: "pending",
      requirements: ["Test tokens received", "Wallet connected to app"]
    }
  ];

  // Update step statuses based on current state
  const getUpdatedSteps = (): WorkflowStep[] => {
    return workflowSteps.map(step => {
      let status: WorkflowStep["status"] = "pending";

      switch (step.id) {
        case 1:
          // Check if Leather wallet is available
          status = typeof window !== "undefined" && (window as any).LeatherProvider ? "completed" : "pending";
          break;
        case 2:
          // Wallet creation/import is always pending as we can't detect this
          status = "pending";
          break;
        case 3:
          // Network status
          status = network === "testnet" ? "completed" : "pending";
          break;
        case 4:
          // Connection status
          status = isConnected ? "completed" : "pending";
          break;
        case 5:
        case 6:
        case 7:
        case 8:
          // These steps require external interaction
          status = "pending";
          break;
        case 9:
          // Final step - check if we have everything needed
          status = isConnected && network === "testnet" ? "completed" : "pending";
          break;
      }

      return { ...step, status };
    });
  };

  const updatedSteps = getUpdatedSteps();
  const completedSteps = updatedSteps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / updatedSteps.length) * 100;

  const startWorkflow = () => {
    setIsWorkflowActive(true);
    setCurrentStep(1);
  };

  const pauseWorkflow = () => {
    setIsWorkflowActive(false);
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Circle className="w-5 h-5 text-blue-500 animate-pulse" />;
      case "failed":
        return <Circle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepAction = (step: WorkflowStep) => {
    if (step.externalLink) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(step.externalLink, "_blank")}
          className="mt-2"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open {step.title.includes("Faucet") ? "Faucet" : "Link"}
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Stacks Integration Workflow</span>
          <div className="flex items-center space-x-2">
            {!isWorkflowActive ? (
              <Button onClick={startWorkflow} size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start Workflow
              </Button>
            ) : (
              <Button onClick={pauseWorkflow} variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
          </div>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress: {completedSteps}/{updatedSteps.length} steps completed</span>
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updatedSteps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all ${
                step.status === "completed"
                  ? "bg-green-50 border-green-200"
                  : step.status === "in-progress"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Step {step.id}: {step.title}
                    </h4>
                    <Badge
                      variant={
                        step.status === "completed"
                          ? "default"
                          : step.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="ml-2"
                    >
                      {step.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  
                  {step.requirements && step.requirements.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Requirements:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {step.requirements.map((req, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Circle className="w-2 h-2 text-gray-400" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {getStepAction(step)}

                  {step.status === "completed" && step.id < updatedSteps.length && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(step.id + 1)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Continue to Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://leather.io", "_blank")}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Install Leather
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://faucet.learnweb3.io/", "_blank")}
            >
              <Coins className="w-4 h-4 mr-2" />
              Open Faucet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://docs.stacks.co/", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Stacks Docs
            </Button>
          </div>
        </div>

        {/* Current Status Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Wallet Connected:</span>
              <Badge variant={isConnected ? "default" : "outline"} className="ml-2">
                {isConnected ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">Network:</span>
              <Badge variant={network === "testnet" ? "secondary" : "outline"} className="ml-2">
                {network}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">Account:</span>
              <span className="text-gray-900 ml-2">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Workflow Active:</span>
              <Badge variant={isWorkflowActive ? "secondary" : "outline"} className="ml-2">
                {isWorkflowActive ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

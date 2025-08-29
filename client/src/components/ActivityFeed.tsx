import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Activity, 
  Filter, 
  Search, 
  ExternalLink, 
  Clock, 
  User, 
  Hash,
  TrendingUp,
  ShoppingCart,
  Target,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'project_registered' | 'credits_purchased' | 'credits_retired' | 'sensor_added' | 'reading_added';
  title: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  userAddress: string;
  details: Record<string, any>;
  network: 'testnet' | 'mainnet';
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');

  // Mock activity data - in real implementation this would come from blockchain
  useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'project_registered',
        title: 'Mangrove Restoration Project Registered',
        description: 'New blue carbon project registered on the blockchain',
        timestamp: new Date(),
        status: 'confirmed',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        userAddress: 'ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342',
        details: {
          projectName: 'Mangrove Restoration Project',
          projectType: 'Mangrove',
          location: 'Mumbai Coast, India',
          estimatedCredits: 500
        },
        network: 'testnet'
      },
      {
        id: '2',
        type: 'credits_purchased',
        title: 'Carbon Credits Purchased',
        description: '50 credits purchased from Mangrove Restoration Project',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'confirmed',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        userAddress: 'ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342',
        details: {
          projectName: 'Mangrove Restoration Project',
          creditsPurchased: 50,
          pricePerCredit: 25,
          totalPrice: 1250
        },
        network: 'testnet'
      },
      {
        id: '3',
        type: 'sensor_added',
        title: 'Environmental Sensor Added',
        description: 'New sensor deployed for environmental monitoring',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        status: 'confirmed',
        transactionHash: '0x7890abcdef1234567890abcdef1234567890abcd',
        userAddress: 'ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342',
        details: {
          sensorName: 'Coastal Sensor Alpha',
          sensorType: 'Environmental',
          location: 'Mumbai Coast, India'
        },
        network: 'testnet'
      },
      {
        id: '4',
        type: 'reading_added',
        title: 'Sensor Reading Recorded',
        description: 'Environmental data recorded from Coastal Sensor Alpha',
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        status: 'confirmed',
        transactionHash: '0x4567890abcdef1234567890abcdef1234567890ab',
        userAddress: 'ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342',
        details: {
          sensorName: 'Coastal Sensor Alpha',
          temperature: 28.5,
          humidity: 75.2,
          carbonLevel: 415.6
        },
        network: 'testnet'
      },
      {
        id: '5',
        type: 'credits_retired',
        title: 'Carbon Credits Retired',
        description: '25 credits permanently retired from circulation',
        timestamp: new Date(Date.now() - 14400000), // 4 hours ago
        status: 'confirmed',
        transactionHash: '0xdef1234567890abcdef1234567890abcdef123456',
        userAddress: 'ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342',
        details: {
          creditsRetired: 25,
          retirementReason: 'Environmental offset',
          projectName: 'Mangrove Restoration Project'
        },
        network: 'testnet'
      }
    ];
    setActivities(mockActivities);
    setFilteredActivities(mockActivities);
  }, []);

  // Filter activities based on search and filters
  useEffect(() => {
    let filtered = activities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(activity => activity.status === statusFilter);
    }

    // Network filter
    if (networkFilter !== 'all') {
      filtered = filtered.filter(activity => activity.network === networkFilter);
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, typeFilter, statusFilter, networkFilter]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_registered': return <Plus className="w-5 h-5" />;
      case 'credits_purchased': return <ShoppingCart className="w-5 h-5" />;
      case 'credits_retired': return <Target className="w-5 h-5" />;
      case 'sensor_added': return <Activity className="w-5 h-5" />;
      case 'reading_added': return <TrendingUp className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project_registered': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'credits_purchased': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'credits_retired': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'sensor_added': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'reading_added': return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openTransactionExplorer = (txHash: string, network: string) => {
    const baseUrl = network === 'testnet' 
      ? 'https://explorer.stacks.co/txid' 
      : 'https://explorer.stacks.co/txid';
    window.open(`${baseUrl}/${txHash}?chain=${network}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📊 Activity Feed</h2>
          <p className="text-muted-foreground">Track all blockchain transactions and activities</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="project_registered">Project Registration</SelectItem>
                  <SelectItem value="credits_purchased">Credit Purchase</SelectItem>
                  <SelectItem value="credits_retired">Credit Retirement</SelectItem>
                  <SelectItem value="sensor_added">Sensor Addition</SelectItem>
                  <SelectItem value="reading_added">Reading Addition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Network Filter */}
            <div className="space-y-2">
              <Label htmlFor="network-filter">Network</Label>
              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All networks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Activity Icon */}
                <div className={`p-3 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(activity.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(activity.status)}
                          <span className="capitalize">{activity.status}</span>
                        </div>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activity.network}
                      </Badge>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      {Object.entries(activity.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User:</span>
                        <span className="font-mono text-xs">{formatAddress(activity.userAddress)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="text-xs">{activity.timestamp.toLocaleString()}</span>
                      </div>
                      {activity.transactionHash && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transaction:</span>
                          <span className="font-mono text-xs">{formatAddress(activity.transactionHash)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    {activity.transactionHash && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openTransactionExplorer(activity.transactionHash!, activity.network)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Explorer
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Hash className="w-4 h-4 mr-2" />
                      Copy ID
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* No Activities Message */}
        {filteredActivities.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Activities Found</h3>
              <p className="text-muted-foreground">
                {activities.length === 0 
                  ? "No activities have been recorded yet. Start by registering a project or adding sensors."
                  : "No activities match your current filters. Try adjusting your search criteria."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{activities.length}</p>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.status === 'confirmed').length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {activities.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {activities.filter(a => a.status === 'failed').length}
              </p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

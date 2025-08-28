import type { Project, CarbonCredit, Transaction, SensorData } from "@shared/schema";

export const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Kerala Mangrove Conservation",
    description: "Large-scale mangrove restoration project along the Kerala coastline focusing on biodiversity conservation and carbon sequestration.",
    projectType: "mangrove",
    area: "250",
    latitude: "11.0168",
    longitude: "76.9558", 
    location: "Kochi, Kerala, India",
    developerId: "user-1",
    status: "verified",
    estimatedCredits: 125,
    verificationDocuments: {
      eia: true,
      baseline: true,
      community: true,
      government: true
    },
    satelliteImagery: {
      before: "mangrove_before.jpg",
      after: "mangrove_after.jpg"
    },
    createdAt: new Date("2024-01-15"),
    verifiedAt: new Date("2024-02-01")
  },
  {
    id: "project-2", 
    name: "Goa Seagrass Protection",
    description: "Seagrass bed conservation and restoration in Goa coastal waters to enhance marine carbon storage.",
    projectType: "seagrass",
    area: "180",
    latitude: "15.2993",
    longitude: "74.1240",
    location: "Panaji, Goa, India", 
    developerId: "user-1",
    status: "verified",
    estimatedCredits: 78,
    verificationDocuments: {
      eia: true,
      baseline: true,
      community: true,
      government: true
    },
    satelliteImagery: {
      before: "seagrass_before.jpg",
      after: "seagrass_after.jpg"
    },
    createdAt: new Date("2024-02-10"),
    verifiedAt: new Date("2024-02-25")
  },
  {
    id: "project-3",
    name: "Sundarbans Salt Marsh",
    description: "Salt marsh restoration in the Sundarbans delta region to protect coastal communities and sequester carbon.",
    projectType: "salt_marsh",
    area: "320", 
    latitude: "21.9497",
    longitude: "89.1833",
    location: "West Bengal, India",
    developerId: "user-1",
    status: "verified",
    estimatedCredits: 203,
    verificationDocuments: {
      eia: true,
      baseline: true, 
      community: true,
      government: true
    },
    satelliteImagery: {
      before: "saltmarsh_before.jpg",
      after: "saltmarsh_after.jpg"
    },
    createdAt: new Date("2024-01-05"),
    verifiedAt: new Date("2024-01-20")
  },
  {
    id: "project-4",
    name: "Tamil Nadu Coastal Restoration",
    description: "Comprehensive coastal ecosystem restoration combining mangroves and seagrass in Tamil Nadu.",
    projectType: "mangrove",
    area: "450",
    latitude: "13.0827",
    longitude: "80.2707",
    location: "Chennai, Tamil Nadu, India",
    developerId: "user-1", 
    status: "pending",
    estimatedCredits: 280,
    verificationDocuments: {
      eia: true,
      baseline: false,
      community: true,
      government: false
    },
    satelliteImagery: {
      before: "tn_before.jpg",
      after: "tn_after.jpg"
    },
    createdAt: new Date("2024-03-01"),
    verifiedAt: null
  }
];

export const mockCarbonCredits: CarbonCredit[] = [
  {
    id: "credit-1",
    projectId: "project-1",
    tokenId: "BCR-001-125",
    amount: 125,
    price: "17.50",
    ownerId: "user-1",
    status: "available",
    co2Amount: "1.0",
    mintedAt: new Date("2024-02-01"),
    retiredAt: null,
    retiredBy: null
  },
  {
    id: "credit-2", 
    projectId: "project-2",
    tokenId: "BCR-002-078",
    amount: 78,
    price: "19.25",
    ownerId: "user-1", 
    status: "available",
    co2Amount: "1.0",
    mintedAt: new Date("2024-02-25"),
    retiredAt: null,
    retiredBy: null
  },
  {
    id: "credit-3",
    projectId: "project-3", 
    tokenId: "BCR-003-203",
    amount: 203,
    price: "16.75",
    ownerId: "user-1",
    status: "available", 
    co2Amount: "1.0",
    mintedAt: new Date("2024-01-20"),
    retiredAt: null,
    retiredBy: null
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "purchase",
    creditId: "credit-1", 
    fromUserId: null,
    toUserId: "user-2",
    amount: 25,
    price: "17.50",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    blockchainNetwork: "ethereum",
    createdAt: new Date("2024-03-15T10:30:00Z")
  },
  {
    id: "tx-2",
    type: "retirement",
    creditId: "credit-2",
    fromUserId: "user-2", 
    toUserId: null,
    amount: 10,
    price: null,
    txHash: "0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef123",
    blockchainNetwork: "ethereum",
    createdAt: new Date("2024-03-14T15:45:00Z")
  },
  {
    id: "tx-3",
    type: "minting",
    creditId: "credit-1",
    fromUserId: null,
    toUserId: "user-1",
    amount: 125,
    price: null,
    txHash: "0x3456789012cdef123456789012cdef123456789012cdef123456789012cdef1234",
    blockchainNetwork: "ethereum", 
    createdAt: new Date("2024-02-01T08:15:00Z")
  }
];

export const mockSensorData: SensorData[] = [
  {
    id: "sensor-1",
    projectId: "project-1",
    sensorType: "co2",
    value: "2.3",
    unit: "t/ha/yr",
    latitude: "11.0168",
    longitude: "76.9558",
    timestamp: new Date(),
    metadata: { device_id: "CO2-001", accuracy: "±0.1" }
  },
  {
    id: "sensor-2",
    projectId: "project-1", 
    sensorType: "biomass",
    value: "145.6",
    unit: "t/ha",
    latitude: "11.0168",
    longitude: "76.9558",
    timestamp: new Date(),
    metadata: { device_id: "BIO-001", accuracy: "±5%" }
  },
  {
    id: "sensor-3",
    projectId: "project-1",
    sensorType: "soil_carbon",
    value: "89.2", 
    unit: "%",
    latitude: "11.0168",
    longitude: "76.9558",
    timestamp: new Date(),
    metadata: { device_id: "SOIL-001", depth: "30cm" }
  },
  {
    id: "sensor-4",
    projectId: "project-2",
    sensorType: "co2",
    value: "1.8",
    unit: "t/ha/yr",
    latitude: "15.2993",
    longitude: "74.1240", 
    timestamp: new Date(),
    metadata: { device_id: "CO2-002", accuracy: "±0.1" }
  },
  {
    id: "sensor-5",
    projectId: "project-2",
    sensorType: "biomass",
    value: "98.4",
    unit: "t/ha",
    latitude: "15.2993",
    longitude: "74.1240",
    timestamp: new Date(),
    metadata: { device_id: "BIO-002", accuracy: "±5%" }
  }
];

export const mockAnalytics = {
  projectStats: {
    totalProjects: 4,
    verifiedProjects: 3,
    creditsIssued: 406,
    co2Sequestered: 406.0,
    totalArea: 1200,
    activeProjects: 3
  },
  marketStats: {
    totalCredits: 406,
    avgPrice: "17.83",
    totalTrades: 15,
    marketValue: 7243.98,
    volumeToday: 45,
    priceChange24h: "+2.5%"
  },
  monthlySequestration: [
    { month: "Jan", co2: 12.3 },
    { month: "Feb", co2: 18.7 },
    { month: "Mar", co2: 15.2 },
    { month: "Apr", co2: 24.8 },
    { month: "May", co2: 21.9 },
    { month: "Jun", co2: 29.4 }
  ]
};

// API Keys and external service configurations
export const API_CONFIG = {
  ETHEREUM_RPC_URL: process.env.VITE_ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/your-api-key",
  POLYGON_RPC_URL: process.env.VITE_POLYGON_RPC_URL || "https://polygon-mainnet.infura.io/v3/your-api-key", 
  ETHERSCAN_API_KEY: process.env.VITE_ETHERSCAN_API_KEY || "your-etherscan-api-key",
  GOOGLE_EARTH_ENGINE_API_KEY: process.env.VITE_GOOGLE_EARTH_ENGINE_API_KEY || "your-gee-api-key",
  COPERNICUS_API_KEY: process.env.VITE_COPERNICUS_API_KEY || "your-copernicus-api-key"
};

// Smart Contract Addresses (testnet/mainnet)
export const CONTRACT_ADDRESSES = {
  BLUE_CARBON_REGISTRY: process.env.VITE_REGISTRY_CONTRACT || "0x742d35Cc6ab008b3C76d3D73fB7c3c6e3c7b0C8C",
  CARBON_CREDIT_TOKEN: process.env.VITE_TOKEN_CONTRACT || "0x8ba1f109551bD432803012645Hac136c22C28c2",
  MARKETPLACE: process.env.VITE_MARKETPLACE_CONTRACT || "0x45f123ab89c456def012345678901234567890ab"
};

// Network configurations 
export const NETWORK_CONFIG = {
  1: {
    name: "Ethereum Mainnet",
    rpcUrl: API_CONFIG.ETHEREUM_RPC_URL,
    explorerUrl: "https://etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
  },
  137: {
    name: "Polygon Mainnet", 
    rpcUrl: API_CONFIG.POLYGON_RPC_URL,
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 }
  }
};

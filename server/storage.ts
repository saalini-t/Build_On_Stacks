import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type CarbonCredit,
  type InsertCarbonCredit,
  type Transaction,
  type InsertTransaction,
  type SensorData,
  type InsertSensorData,
  type VerificationRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByDeveloper(developerId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectStatus(id: string, status: string): Promise<Project | undefined>;

  // Carbon Credits
  getCarbonCredit(id: string): Promise<CarbonCredit | undefined>;
  getCarbonCredits(): Promise<CarbonCredit[]>;
  getCarbonCreditsByProject(projectId: string): Promise<CarbonCredit[]>;
  getCarbonCreditsByOwner(ownerId: string): Promise<CarbonCredit[]>;
  getAvailableCarbonCredits(): Promise<CarbonCredit[]>;
  createCarbonCredit(credit: InsertCarbonCredit): Promise<CarbonCredit>;
  updateCarbonCreditStatus(id: string, status: string, retiredBy?: string): Promise<CarbonCredit | undefined>;
  transferCarbonCredit(id: string, newOwnerId: string): Promise<CarbonCredit | undefined>;

  // Transactions
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Sensor Data
  getSensorData(projectId: string): Promise<SensorData[]>;
  getLatestSensorData(projectId: string, sensorType: string): Promise<SensorData | undefined>;
  createSensorData(data: InsertSensorData): Promise<SensorData>;

  // Analytics
  getProjectStats(): Promise<any>;
  getMarketStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private carbonCredits: Map<string, CarbonCredit>;
  private transactions: Map<string, Transaction>;
  private sensorData: Map<string, SensorData>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.carbonCredits = new Map();
    this.transactions = new Map();
    this.sensorData = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const sampleUsers = [
      {
        id: "user-1",
        username: "developer1",
        password: "password123",
        walletAddress: "0x1234567890123456789012345678901234567890",
        role: "developer" as const
      },
      {
        id: "user-2", 
        username: "buyer1",
        password: "password123",
        walletAddress: "0x0987654321098765432109876543210987654321",
        role: "user" as const
      }
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user as User));

    // Create sample projects
    const sampleProjects = [
      {
        id: "project-1",
        name: "Kerala Mangrove Conservation",
        description: "Large-scale mangrove restoration project along the Kerala coastline",
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
        description: "Seagrass bed conservation and restoration in Goa coastal waters",
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
        description: "Salt marsh restoration in the Sundarbans delta region",
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
      }
    ];

    sampleProjects.forEach(project => this.projects.set(project.id, project as Project));

    // Create sample carbon credits
    const sampleCredits = [
      {
        id: "credit-1",
        projectId: "project-1",
        tokenId: "BCR-001-125",
        amount: 125,
        price: "17.50",
        ownerId: "user-1",
        status: "available",
        co2Amount: "1.0",
        mintedAt: new Date("2024-02-01")
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
        mintedAt: new Date("2024-02-25")
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
        mintedAt: new Date("2024-01-20")
      }
    ];

    sampleCredits.forEach(credit => this.carbonCredits.set(credit.id, credit as CarbonCredit));

    // Create sample sensor data
    const sampleSensorData = [
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
      }
    ];

    sampleSensorData.forEach(data => this.sensorData.set(data.id, data as SensorData));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByDeveloper(developerId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.developerId === developerId
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      status: "pending",
      createdAt: new Date(),
      verifiedAt: null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProjectStatus(id: string, status: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (project) {
      const updatedProject = { 
        ...project, 
        status,
        verifiedAt: status === "verified" ? new Date() : project.verifiedAt
      };
      this.projects.set(id, updatedProject);
      return updatedProject;
    }
    return undefined;
  }

  // Carbon Credit methods
  async getCarbonCredit(id: string): Promise<CarbonCredit | undefined> {
    return this.carbonCredits.get(id);
  }

  async getCarbonCredits(): Promise<CarbonCredit[]> {
    return Array.from(this.carbonCredits.values());
  }

  async getCarbonCreditsByProject(projectId: string): Promise<CarbonCredit[]> {
    return Array.from(this.carbonCredits.values()).filter(
      credit => credit.projectId === projectId
    );
  }

  async getCarbonCreditsByOwner(ownerId: string): Promise<CarbonCredit[]> {
    return Array.from(this.carbonCredits.values()).filter(
      credit => credit.ownerId === ownerId
    );
  }

  async getAvailableCarbonCredits(): Promise<CarbonCredit[]> {
    return Array.from(this.carbonCredits.values()).filter(
      credit => credit.status === "available"
    );
  }

  async createCarbonCredit(insertCredit: InsertCarbonCredit): Promise<CarbonCredit> {
    const id = randomUUID();
    const credit: CarbonCredit = { 
      ...insertCredit, 
      id,
      status: "available",
      mintedAt: new Date(),
      retiredAt: null,
      retiredBy: null,
      tokenId: `BCR-${Date.now()}-${insertCredit.amount}`
    };
    this.carbonCredits.set(id, credit);
    return credit;
  }

  async updateCarbonCreditStatus(id: string, status: string, retiredBy?: string): Promise<CarbonCredit | undefined> {
    const credit = this.carbonCredits.get(id);
    if (credit) {
      const updatedCredit = { 
        ...credit, 
        status,
        retiredAt: status === "retired" ? new Date() : credit.retiredAt,
        retiredBy: status === "retired" ? (retiredBy || null) : credit.retiredBy
      };
      this.carbonCredits.set(id, updatedCredit);
      return updatedCredit;
    }
    return undefined;
  }

  async transferCarbonCredit(id: string, newOwnerId: string): Promise<CarbonCredit | undefined> {
    const credit = this.carbonCredits.get(id);
    if (credit) {
      const updatedCredit = { ...credit, ownerId: newOwnerId };
      this.carbonCredits.set(id, updatedCredit);
      return updatedCredit;
    }
    return undefined;
  }

  // Transaction methods
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      tx => tx.fromUserId === userId || tx.toUserId === userId
    ).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      price: insertTransaction.price || null,
      fromUserId: insertTransaction.fromUserId || null,
      toUserId: insertTransaction.toUserId || null,
      blockchainNetwork: insertTransaction.blockchainNetwork || "ethereum"
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Sensor Data methods
  async getSensorData(projectId: string): Promise<SensorData[]> {
    return Array.from(this.sensorData.values()).filter(
      data => data.projectId === projectId
    ).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getLatestSensorData(projectId: string, sensorType: string): Promise<SensorData | undefined> {
    const data = Array.from(this.sensorData.values()).filter(
      item => item.projectId === projectId && item.sensorType === sensorType
    ).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return data[0];
  }

  async createSensorData(insertData: InsertSensorData): Promise<SensorData> {
    const id = randomUUID();
    const data: SensorData = { 
      ...insertData, 
      id,
      timestamp: new Date(),
      latitude: insertData.latitude || null,
      longitude: insertData.longitude || null
    };
    this.sensorData.set(id, data);
    return data;
  }

  // Analytics methods
  async getProjectStats(): Promise<any> {
    const projects = Array.from(this.projects.values());
    const credits = Array.from(this.carbonCredits.values());
    
    return {
      totalProjects: projects.length,
      verifiedProjects: projects.filter(p => p.status === "verified").length,
      creditsIssued: credits.reduce((sum, c) => sum + c.amount, 0),
      co2Sequestered: credits.reduce((sum, c) => sum + parseFloat(c.co2Amount) * c.amount, 0)
    };
  }

  async getMarketStats(): Promise<any> {
    const credits = Array.from(this.carbonCredits.values());
    const availableCredits = credits.filter(c => c.status === "available");
    const transactions = Array.from(this.transactions.values());
    
    const avgPrice = availableCredits.length > 0 
      ? availableCredits.reduce((sum, c) => sum + parseFloat(c.price), 0) / availableCredits.length
      : 0;
      
    return {
      totalCredits: availableCredits.reduce((sum, c) => sum + c.amount, 0),
      avgPrice: avgPrice.toFixed(2),
      totalTrades: transactions.filter(t => t.type === "purchase").length,
      marketValue: availableCredits.reduce((sum, c) => sum + (parseFloat(c.price) * c.amount), 0)
    };
  }
}

export const storage = new MemStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertCarbonCreditSchema, insertTransactionSchema, insertSensorDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const project = await storage.updateProjectStatus(req.params.id, status);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project status" });
    }
  });

  // Carbon Credit routes
  app.get("/api/credits", async (req, res) => {
    try {
      const credits = await storage.getCarbonCredits();
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  });

  app.get("/api/credits/available", async (req, res) => {
    try {
      const credits = await storage.getAvailableCarbonCredits();
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available credits" });
    }
  });

  app.get("/api/credits/owner/:ownerId", async (req, res) => {
    try {
      const credits = await storage.getCarbonCreditsByOwner(req.params.ownerId);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user credits" });
    }
  });

  app.post("/api/credits", async (req, res) => {
    try {
      const validatedData = insertCarbonCreditSchema.parse(req.body);
      const credit = await storage.createCarbonCredit(validatedData);
      res.status(201).json(credit);
    } catch (error) {
      res.status(400).json({ error: "Invalid credit data" });
    }
  });

  app.patch("/api/credits/:id/transfer", async (req, res) => {
    try {
      const { newOwnerId } = req.body;
      const credit = await storage.transferCarbonCredit(req.params.id, newOwnerId);
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }
      res.json(credit);
    } catch (error) {
      res.status(500).json({ error: "Failed to transfer credit" });
    }
  });

  app.patch("/api/credits/:id/retire", async (req, res) => {
    try {
      const { retiredBy } = req.body;
      const credit = await storage.updateCarbonCreditStatus(req.params.id, "retired", retiredBy);
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }
      res.json(credit);
    } catch (error) {
      res.status(500).json({ error: "Failed to retire credit" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/user/:userId", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  // Sensor Data routes
  app.get("/api/sensor-data/:projectId", async (req, res) => {
    try {
      const data = await storage.getSensorData(req.params.projectId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sensor data" });
    }
  });

  app.get("/api/sensor-data/:projectId/:sensorType/latest", async (req, res) => {
    try {
      const data = await storage.getLatestSensorData(req.params.projectId, req.params.sensorType);
      if (!data) {
        return res.status(404).json({ error: "No sensor data found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest sensor data" });
    }
  });

  app.post("/api/sensor-data", async (req, res) => {
    try {
      const validatedData = insertSensorDataSchema.parse(req.body);
      const data = await storage.createSensorData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid sensor data" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/projects", async (req, res) => {
    try {
      const stats = await storage.getProjectStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project analytics" });
    }
  });

  app.get("/api/analytics/market", async (req, res) => {
    try {
      const stats = await storage.getMarketStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market analytics" });
    }
  });

  // Web3 simulation routes
  app.post("/api/web3/connect", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      // Simulate wallet connection
      res.json({ 
        success: true, 
        walletAddress,
        balance: "2.5 ETH",
        network: "Ethereum Mainnet"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to connect wallet" });
    }
  });

  app.post("/api/web3/mint", async (req, res) => {
    try {
      const { projectId, amount, ownerId } = req.body;
      // Simulate smart contract minting
      const credit = await storage.createCarbonCredit({
        projectId,
        amount,
        price: "18.50",
        ownerId,
        co2Amount: "1.0"
      });
      
      res.json({ 
        success: true, 
        tokenId: credit.tokenId,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to mint tokens" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

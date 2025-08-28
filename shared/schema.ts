import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  role: text("role").default("user"), // user, developer, verifier
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  projectType: text("project_type").notNull(), // mangrove, seagrass, salt_marsh
  area: numeric("area").notNull(), // in hectares
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  location: text("location").notNull(),
  developerId: text("developer_id").notNull(),
  status: text("status").default("pending"), // pending, verified, rejected
  estimatedCredits: integer("estimated_credits").default(0),
  verificationDocuments: jsonb("verification_documents"),
  satelliteImagery: jsonb("satellite_imagery"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  verifiedAt: timestamp("verified_at"),
});

export const carbonCredits = pgTable("carbon_credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  tokenId: text("token_id").unique(),
  amount: integer("amount").notNull(), // number of credits
  price: numeric("price").notNull(), // price per credit in USD
  ownerId: text("owner_id").notNull(),
  status: text("status").default("available"), // available, sold, retired
  co2Amount: numeric("co2_amount").notNull(), // tonnes of CO2 per credit
  mintedAt: timestamp("minted_at").default(sql`CURRENT_TIMESTAMP`),
  retiredAt: timestamp("retired_at"),
  retiredBy: text("retired_by"),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // purchase, sale, retirement, minting
  creditId: text("credit_id").notNull(),
  fromUserId: text("from_user_id"),
  toUserId: text("to_user_id"),
  amount: integer("amount").notNull(),
  price: numeric("price"),
  txHash: text("tx_hash"),
  blockchainNetwork: text("blockchain_network").default("ethereum"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sensorData = pgTable("sensor_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  sensorType: text("sensor_type").notNull(), // co2, biomass, soil_carbon, weather
  value: numeric("value").notNull(),
  unit: text("unit").notNull(),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  timestamp: timestamp("timestamp").default(sql`CURRENT_TIMESTAMP`),
  metadata: jsonb("metadata"),
});

export const verificationRequests = pgTable("verification_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  requesterId: text("requester_id").notNull(),
  verifierId: text("verifier_id"),
  status: text("status").default("pending"), // pending, approved, rejected
  verificationData: jsonb("verification_data"),
  comments: text("comments"),
  submittedAt: timestamp("submitted_at").default(sql`CURRENT_TIMESTAMP`),
  reviewedAt: timestamp("reviewed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  role: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  projectType: true,
  area: true,
  latitude: true,
  longitude: true,
  location: true,
  developerId: true,
  estimatedCredits: true,
  verificationDocuments: true,
  satelliteImagery: true,
});

export const insertCarbonCreditSchema = createInsertSchema(carbonCredits).pick({
  projectId: true,
  amount: true,
  price: true,
  ownerId: true,
  co2Amount: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  type: true,
  creditId: true,
  fromUserId: true,
  toUserId: true,
  amount: true,
  price: true,
  txHash: true,
  blockchainNetwork: true,
});

export const insertSensorDataSchema = createInsertSchema(sensorData).pick({
  projectId: true,
  sensorType: true,
  value: true,
  unit: true,
  latitude: true,
  longitude: true,
  metadata: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertCarbonCredit = z.infer<typeof insertCarbonCreditSchema>;
export type CarbonCredit = typeof carbonCredits.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;
export type SensorData = typeof sensorData.$inferSelect;

export type VerificationRequest = typeof verificationRequests.$inferSelect;

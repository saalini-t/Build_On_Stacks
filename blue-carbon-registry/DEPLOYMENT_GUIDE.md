# 🚀 Blue Carbon Registry - Direct Deployment Guide

## 📋 **Overview**

This guide will help you deploy your Blue Carbon Registry smart contracts directly to the Stacks testnet from VS Code, bypassing Clarinet syntax issues.

## 🛠️ **Prerequisites**

- ✅ **Node.js & npm** installed
- ✅ **Stacks dependencies** installed (`npm install` completed)
- ✅ **Leather Wallet** with testnet enabled
- ✅ **Testnet STX** tokens (get from [Hiro Faucet](https://faucet.testnet.hiro.so))

## 🔑 **Step 1: Get Your Private Key**

1. **Open Leather Wallet** in your browser
2. **Switch to Testnet** (Settings → Enable Testnet)
3. **Export Private Key**:
   - Go to Settings → Export Private Key
   - Enter your password
   - **Copy the private key** (starts with a long string of characters)

## 📝 **Step 2: Update Deployment Script**

1. **Open** `deploy.ts` in VS Code
2. **Replace** `YOUR_PRIVATE_KEY_HERE` with your actual private key:

```typescript
const PRIVATE_KEY = 'your-actual-private-key-here';
```

## 🚀 **Step 3: Deploy Your Contracts**

### **Option A: Deploy All Contracts**
```bash
npx ts-node deploy.ts
```

### **Option B: Deploy Single Contract**
```bash
npx ts-node deploy.ts --contract blue-carbon-registry
```

## 📊 **Expected Output**

```
🚀 Starting Blue Carbon Registry Contract Deployment...
📍 Network: Stacks Testnet
👤 Sender: ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342

🚀 Deploying blue-carbon-registry...
📝 Contract code loaded (XXX characters)
📡 Broadcasting transaction...
✅ blue-carbon-registry deployed successfully!
🔗 Transaction ID: 0x1234...
🌐 Explorer: https://explorer.hiro.so/txid/0x1234...?chain=testnet
📋 Contract Address: ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.blue-carbon-registry
```

## 🔍 **Step 4: Verify Deployment**

### **Check Transaction Status**
1. **Copy the Transaction ID** from the output
2. **Visit** [Hiro Explorer Testnet](https://explorer.hiro.so/?chain=testnet)
3. **Paste the TX ID** in the search bar
4. **Wait for confirmation** (usually 1-2 minutes)

### **Check Contract Address**
Your contracts will be available at:
- **Registry**: `ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.blue-carbon-registry`
- **Marketplace**: `ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.blue-carbon-marketplace`
- **Sensor**: `ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.sensor-verification`

## 🧪 **Step 5: Test Your Contracts**

### **Using Stacks Sandbox**
1. **Go to** [Stacks Sandbox](https://explorer.stacks.co/sandbox?chain=testnet)
2. **Enter your contract address** (e.g., `ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.blue-carbon-registry`)
3. **Test functions**:
   - `register-project` with name "Mangrove Restoration"
   - `get-project` with id `u1`
   - `get-total-projects`

## 🔧 **Step 6: Update Your Frontend**

### **Update Stacks Service**
In `client/src/lib/stacks-service.ts`:

```typescript
const contractAddresses = {
  testnet: {
    blueCarbonRegistry: "ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.blue-carbon-registry",
    blueCarbonMarketplace: "ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.blue-carbon-marketplace",
    sensorVerification: "ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342.sensor-verification"
  }
};
```

## 🚨 **Troubleshooting**

### **Private Key Error**
```
❌ ERROR: Please set your private key in the PRIVATE_KEY variable
```
**Solution**: Make sure you've replaced `YOUR_PRIVATE_KEY_HERE` with your actual private key.

### **Insufficient STX**
```
❌ Deployment failed: Insufficient balance
```
**Solution**: Get more testnet STX from the [Hiro Faucet](https://faucet.testnet.hiro.so).

### **Contract Syntax Error**
```
❌ Failed to deploy: Invalid contract syntax
```
**Solution**: The deployment script will skip problematic contracts and continue with others.

## 🎯 **What You'll See in Leather Wallet**

After successful deployment:
1. **Open Leather Wallet**
2. **Go to Activity tab**
3. **You'll see**:
   - Contract deployment transactions
   - Transaction IDs
   - Status (pending → confirmed)
   - Contract addresses

## 🔗 **Useful Links**

- [Stacks Testnet Explorer](https://explorer.hiro.so/?chain=testnet)
- [Stacks Sandbox](https://explorer.stacks.co/sandbox?chain=testnet)
- [Testnet Faucet](https://faucet.testnet.hiro.so)
- [Stacks Documentation](https://docs.stacks.co/)

## 📞 **Support**

If you encounter issues:
1. **Check the error messages** in the deployment output
2. **Verify your private key** is correct
3. **Ensure you have testnet STX** in your wallet
4. **Check transaction status** in Hiro Explorer

---

**Happy Deploying! 🎉**

Your Blue Carbon Registry will be live on the Stacks testnet!

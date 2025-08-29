import { readFileSync } from 'fs';
import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  StacksTestnet,
  StacksMainnet,
  StacksNetwork,
} from '@stacks/transactions';

// ==== CONFIGURATION ====
const CONTRACTS = [
  {
    name: 'blue-carbon-registry',
    file: './contracts/blue-carbon-registry.clar'
  },
  {
    name: 'blue-carbon-marketplace',
    file: './contracts/blue-carbon-marketplace.clar'
  },
  {
    name: 'sensor-verification',
    file: './contracts/sensor-verification.clar'
  }
];

// Your Stacks address and private key
const SENDER_ADDRESS = 'ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342';
const PRIVATE_KEY = 'YOUR_PRIVATE_KEY_HERE'; // Replace with your private key

// Network configuration
const NETWORK = new StacksTestnet({ 
  url: 'https://api.testnet.hiro.so' 
});

// ==== DEPLOYMENT FUNCTIONS ====

async function deployContract(contractName: string, contractFile: string): Promise<string> {
  try {
    console.log(`🚀 Deploying ${contractName}...`);
    
    // Read contract code
    const codeBody = readFileSync(contractFile, 'utf8');
    console.log(`📝 Contract code loaded (${codeBody.length} characters)`);
    
    // Create deployment transaction
    const tx = await makeContractDeploy({
      contractName,
      codeBody,
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
    });
    
    console.log(`📡 Broadcasting transaction...`);
    
    // Broadcast transaction
    const result = await broadcastTransaction(tx, NETWORK);
    
    if (result.error) {
      throw new Error(`Deployment failed: ${result.error}`);
    }
    
    console.log(`✅ ${contractName} deployed successfully!`);
    console.log(`🔗 Transaction ID: ${result.txid}`);
    console.log(`🌐 Explorer: https://explorer.hiro.so/txid/${result.txid}?chain=testnet`);
    console.log(`📋 Contract Address: ${SENDER_ADDRESS}.${contractName}`);
    console.log('');
    
    return result.txid;
    
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error);
    throw error;
  }
}

async function deployAllContracts() {
  console.log('🚀 Starting Blue Carbon Registry Contract Deployment...');
  console.log('📍 Network: Stacks Testnet');
  console.log('👤 Sender: ' + SENDER_ADDRESS);
  console.log('');
  
  const results: { name: string; txid: string; address: string }[] = [];
  
  for (const contract of CONTRACTS) {
    try {
      const txid = await deployContract(contract.name, contract.file);
      results.push({
        name: contract.name,
        txid,
        address: `${SENDER_ADDRESS}.${contract.name}`
      });
      
      // Wait a bit between deployments
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Deployment of ${contract.name} failed, continuing with next contract...`);
    }
  }
  
  // Summary
  console.log('📊 Deployment Summary:');
  console.log('========================');
  results.forEach(result => {
    console.log(`✅ ${result.name}: ${result.address}`);
    console.log(`🔗 TX: ${result.txid}`);
  });
  
  if (results.length === CONTRACTS.length) {
    console.log('');
    console.log('🎉 All contracts deployed successfully!');
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('1. Wait for transactions to confirm (usually 1-2 minutes)');
    console.log('2. Test your contracts in Stacks Sandbox');
    console.log('3. Update your frontend with the new contract addresses');
  } else {
    console.log('');
    console.log('⚠️ Some contracts failed to deploy. Check the errors above.');
  }
}

// ==== MAIN EXECUTION ====

if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
  console.error('❌ ERROR: Please set your private key in the PRIVATE_KEY variable');
  console.log('');
  console.log('🔑 To get your private key:');
  console.log('1. Open Leather Wallet');
  console.log('2. Go to Settings → Export Private Key');
  console.log('3. Copy the private key and replace YOUR_PRIVATE_KEY_HERE');
  console.log('');
  process.exit(1);
}

deployAllContracts().catch(console.error);

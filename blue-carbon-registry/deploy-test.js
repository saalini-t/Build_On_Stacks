import { readFileSync } from 'fs';
import pkg from '@stacks/transactions';
const { makeContractDeploy, broadcastTransaction, AnchorMode } = pkg;
import network from '@stacks/network';
const { StacksTestnet } = network;

// Configuration
const CONTRACT_NAME = 'test-contract';
const CONTRACT_FILE = './contracts/test-contract.clar';
const SENDER_ADDRESS = 'ST2AS2J9GZK2FDSCB6J4450G45DV7WNVY9W3V0342';
const PRIVATE_KEY = 'enhance want actress guard market swap tumble business suit doctor legend over noodle scrub castle mean daring flush balcony group plastic short around account';

const NETWORK = new StacksTestnet({ 
  url: 'https://api.testnet.hiro.so' 
});

async function deployTestContract() {
  try {
    console.log('🚀 Deploying Test Contract...');
    console.log('📍 Network: Stacks Testnet');
    console.log('👤 Sender: ' + SENDER_ADDRESS);
    console.log('');
    
    // Read contract code
    const codeBody = readFileSync(CONTRACT_FILE, 'utf8');
    console.log(`📝 Contract code loaded (${codeBody.length} characters)`);
    
    // Create deployment transaction
    const tx = await makeContractDeploy({
      contractName: CONTRACT_NAME,
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
    
    console.log(`✅ Contract deployed successfully!`);
    console.log(`🔗 Transaction ID: ${result.txid}`);
    console.log(`🌐 Explorer: https://explorer.hiro.so/txid/${result.txid}?chain=testnet`);
    console.log(`📋 Contract Address: ${SENDER_ADDRESS}.${CONTRACT_NAME}`);
    console.log('');
    console.log('🎉 Check your Leather Wallet Activity tab to see the transaction!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
}

deployTestContract();

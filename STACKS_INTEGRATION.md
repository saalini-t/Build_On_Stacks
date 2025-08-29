# Stacks Blockchain Integration for Blue Carbon Registry

This document explains how to integrate and use the Stacks blockchain functionality in your Blue Carbon Registry application.

## Overview

The Blue Carbon Registry now supports Stacks blockchain integration, allowing you to:
- Connect Leather wallet or Stacks wallet
- Mint carbon credits on the Stacks blockchain
- Transfer and retire credits
- Use the testnet faucet for development

## Prerequisites

### 1. Install Leather Wallet
1. Go to [leather.io](https://leather.io)
2. Click "Install Extension"
3. Add to your browser
4. Create or import a wallet
5. **Important**: Switch to Testnet in wallet settings

### 2. Alternative: Stacks Wallet
You can also use the official Stacks wallet extension from your browser's extension store.

## Getting Started

### 1. Connect Your Wallet
1. Navigate to the Wallet page in your application
2. Click on the "Stacks Wallet" tab
3. Click "Connect Leather Wallet" or "Connect Stacks Wallet"
4. Approve the connection in your wallet extension

### 2. Get Testnet STX Tokens
1. Ensure your wallet is connected and on testnet
2. Click "Get Testnet STX" button
3. This will open the Hiro testnet faucet in a new tab
4. Authenticate with GitHub (required to prevent abuse)
5. Enter your wallet address
6. Receive 500,000 microSTX (0.5 STX)

### 3. Switch Networks
- **Testnet**: Recommended for development and testing
- **Mainnet**: For production use (requires real STX)

## Features

### Wallet Connection
- **Leather Wallet**: Primary wallet support with full functionality
- **Stacks Wallet**: Alternative wallet option
- **Network Switching**: Toggle between testnet and mainnet
- **Balance Display**: Real-time STX balance updates

### Carbon Credit Operations
- **Minting**: Create new carbon credits on the blockchain
- **Transfer**: Send credits to other addresses
- **Retirement**: Permanently retire credits (cannot be transferred again)

### Blockchain Integration
- **Transaction History**: View all blockchain transactions
- **Status Tracking**: Monitor transaction confirmations
- **Explorer Links**: Direct links to Stacks blockchain explorer

## Technical Details

### Network Information
- **Testnet Chain ID**: 2147483648
- **Mainnet Chain ID**: 1
- **Block Time**: ~10 minutes
- **API Endpoints**: 
  - Testnet: `https://api.testnet.hiro.so`
  - Mainnet: `https://api.hiro.so`

### Smart Contract Integration
The system is designed to work with Stacks smart contracts for:
- Carbon credit minting
- Credit transfers
- Credit retirement
- Metadata storage

### API Methods
```typescript
// Connect wallet
await connectLeather()

// Switch network
await switchNetwork("mainnet" | "testnet")

// Mint credits
await mintCarbonCredits(project, amount, ownerAddress)

// Transfer credits
await transferCarbonCredits(tokenId, from, to, amount)

// Retire credits
await retireCarbonCredits(tokenId, owner, amount, reason)
```

## Development Workflow

### 1. Local Development
1. Start your application
2. Connect to testnet
3. Use faucet to get test STX
4. Test all functionality with testnet

### 2. Testing Smart Contracts
1. Deploy contracts to testnet
2. Test minting, transfer, and retirement
3. Verify transactions on explorer
4. Debug any issues

### 3. Production Deployment
1. Switch to mainnet
2. Ensure sufficient STX balance
3. Deploy verified smart contracts
4. Monitor transactions

## Troubleshooting

### Common Issues

#### Wallet Not Detected
- Ensure wallet extension is installed
- Check if extension is enabled
- Try refreshing the page

#### Connection Failed
- Verify wallet is unlocked
- Check network settings
- Ensure proper permissions

#### Faucet Issues
- Must be on testnet
- GitHub authentication required
- Wait for faucet cooldown periods

#### Transaction Failures
- Check STX balance
- Verify network connection
- Review transaction parameters

### Error Messages
- **"Leather wallet not found"**: Install Leather extension
- **"No accounts found"**: Create or import wallet
- **"Network switch failed"**: Check wallet permissions
- **"Insufficient balance"**: Get more STX from faucet

## Security Considerations

### Wallet Security
- Never share your secret recovery phrase
- Use hardware wallets for large amounts
- Regularly backup your wallet

### Network Security
- Testnet is for development only
- Mainnet transactions are permanent
- Verify contract addresses before interaction

### Smart Contract Security
- Audit contracts before deployment
- Test thoroughly on testnet
- Use verified contract templates

## Resources

### Official Documentation
- [Stacks Documentation](https://docs.stacks.co/)
- [Leather Wallet Guide](https://leather.io/learn)
- [Hiro Developer Hub](https://hiro.so/developers)

### Tools and Services
- [Stacks Explorer](https://explorer.hiro.so/)
- [Testnet Faucet](https://faucet.testnet.hiro.so/)
- [Stacks API](https://docs.hiro.so/api)

### Community
- [Stacks Discord](https://discord.gg/stacks)
- [Stacks Forum](https://forum.stacks.org/)
- [GitHub Discussions](https://github.com/stacks-network/stacks/discussions)

## Support

If you encounter issues:
1. Check this documentation
2. Review error messages
3. Check wallet and network status
4. Consult Stacks community resources
5. Open an issue in the project repository

## Future Enhancements

Planned features:
- Multi-signature wallet support
- Advanced smart contract interactions
- Cross-chain credit transfers
- Automated verification systems
- Integration with other blockchains

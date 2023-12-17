# Solana-Bootcamp-The_Final-Project
# Solana Documents as NFTs in a wallet 

## Overview
Made with love
The development of this project was aided tremendously by the guidance of the https://www.risein.com/ team. Thank you for your help.
This project implements a Smart contract on the Solana blockchain for managing digital document wallets as non-fungible tokens (NFTs). Users can mint, transfer, and burn document NFTs, representing various document types with associated metadata.

## Features
- Mint new document NFTs with customizable metadata.
- Transfer document NFTs between Solana wallets.
- Burn document NFTs to remove them from circulation.
- Smart contract ensures transparency and trust in document NFT transactions.

## Getting Started
Follow these steps to set up the project locally and interact with the Solana document wallet.

### Prerequisites
- [Node.js](https://nodejs.org/) - Ensure Node.js is installed.

### Installation
1. Clone the repository:
    bash
   git clone [repository-url]
   cd [project-directory]
    
2. Install required npm packages:
    
   npm install
    

### Usage
Please note that these instructions work in Codigo Studio, and devnet Testnet

1. Build the contract:

Open a terminal window and run 

    cargo build-sbf   
    

2. Set your config file

solana config set --url devnet
    

3. Get devnet tokens

solana airdrop 1 

4.  Build and Deploy the Contract

solana program deploy target/deploy/nft.so 

5. You can use the app.ts file for testing this contract.

6. Mint, transfer, and burn document NFTs.

## Smart Contracts
The smart contracts in this project facilitate document NFT minting, transferring, and burning. They handle metadata and ensure secure transactions.

- 'DocumentMetadata.sol' : Represents the metadata structure for document NFTs.
- 'DocumentWalletNFT.sol': Implements methods for minting, transferring, and burning document NFTs.

## Testing
Smart contract tests are located in the `tests` folder. Run the tests using the PROGRAM_ID :

The full command:

npx ts-node app.ts H2ZFiX9Cjvs4omnTJQ6Bdc5JgchfciCQ6yuroorE9d1X
 

## Frontend
The frontend is built using Solana web3 libraries. It provides an intuitive and interactive user interface for document NFT management.

- 'app.ts': Main entry point for the document NFT.
- 'index.ts': Helper functions for NFT program interaction.

## Contributing
Contributions to this project are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Make changes and test thoroughly.
4. Commit with clear and concise messages.
5. Push changes to your fork.
6. Submit a pull request describing your changes.

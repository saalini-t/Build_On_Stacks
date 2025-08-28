blue-carbon-registry/
│
├── README.md
├── package.json
├── .gitignore
│
├── frontend/                          # React.js Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── ProjectMap.js
│   │   │   │   ├── DataVisualization.js
│   │   │   │   └── SensorReadings.js
│   │   │   ├── ProjectRegistration/
│   │   │   │   ├── ProjectForm.js
│   │   │   │   └── ProjectForm.css
│   │   │   ├── Marketplace/
│   │   │   │   ├── Marketplace.js
│   │   │   │   ├── CreditCard.js
│   │   │   │   └── Marketplace.css
│   │   │   ├── Wallet/
│   │   │   │   ├── WalletView.js
│   │   │   │   ├── TransactionHistory.js
│   │   │   │   └── Wallet.css
│   │   │   ├── Navigation/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   └── Navigation.css
│   │   │   └── Common/
│   │   │       ├── LoadingSpinner.js
│   │   │       ├── Modal.js
│   │   │       └── Common.css
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Projects.js
│   │   │   ├── Market.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── web3.js
│   │   │   └── blockchain.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── formatters.js
│   │   ├── hooks/
│   │   │   ├── useWeb3.js
│   │   │   ├── useContract.js
│   │   │   └── useProject.js
│   │   ├── context/
│   │   │   ├── Web3Context.js
│   │   │   └── ProjectContext.js
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── satellite/
│   │   │   │   │   ├── mangrove_before.jpg
│   │   │   │   │   ├── mangrove_after.jpg
│   │   │   │   │   ├── seagrass_restoration.jpg
│   │   │   │   │   └── coastal_wetland.jpg
│   │   │   │   ├── icons/
│   │   │   │   │   ├── co2-icon.png
│   │   │   │   │   ├── biomass-icon.png
│   │   │   │   │   └── location-icon.png
│   │   │   │   └── logo/
│   │   │   │       └── blue-carbon-logo.png
│   │   │   └── styles/
│   │   │       ├── globals.css
│   │   │       ├── variables.css
│   │   │       └── themes.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── backend/                           # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   ├── dataController.js
│   │   │   ├── blockchainController.js
│   │   │   ├── marketController.js
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── cors.js
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   ├── SensorData.js
│   │   │   ├── Transaction.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── projects.js
│   │   │   ├── data.js
│   │   │   ├── blockchain.js
│   │   │   ├── market.js
│   │   │   └── auth.js
│   │   ├── services/
│   │   │   ├── blockchainService.js
│   │   │   ├── dataService.js
│   │   │   ├── verificationService.js
│   │   │   └── web3Service.js
│   │   ├── utils/
│   │   │   ├── database.js
│   │   │   ├── logger.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── blockchain.js
│   │   │   └── environment.js
│   │   └── app.js
│   ├── tests/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── integration/
│   ├── package.json
│   ├── .env.example
│   └── server.js
│
├── blockchain/                        # Smart Contracts & Blockchain Layer
│   ├── contracts/
│   │   ├── BlueCarbonRegistry.sol
│   │   ├── CarbonCreditToken.sol
│   │   ├── ProjectRegistry.sol
│   │   ├── Marketplace.sol
│   │   └── Verification.sol
│   ├── migrations/
│   │   ├── 1_initial_migration.js
│   │   ├── 2_deploy_contracts.js
│   │   └── 3_setup_initial_data.js
│   ├── test/
│   │   ├── BlueCarbonRegistry.test.js
│   │   ├── CarbonCreditToken.test.js
│   │   └── Marketplace.test.js
│   ├── scripts/
│   │   ├── deploy.js
│   │   ├── setup.js
│   │   └── interact.js
│   ├── abis/
│   │   └── (generated contract ABIs)
│   ├── build/
│   │   └── (compiled contracts)
│   ├── truffle-config.js
│   ├── package.json
│   └── .env.example
│
├── data/                              # Datasets and Mock Data
│   ├── datasets/
│   │   ├── kaggle/
│   │   │   ├── mangrove_carbon_data.csv
│   │   │   ├── coastal_vegetation_biomass.csv
│   │   │   ├── blue_carbon_sequestration.csv
│   │   │   └── satellite_imagery_index.csv
│   │   ├── sensor_data/
│   │   │   ├── co2_readings.json
│   │   │   ├── biomass_measurements.json
│   │   │   ├── soil_data.json
│   │   │   └── weather_data.json
│   │   └── mock/
│   │       ├── projects.json
│   │       ├── users.json
│   │       ├── transactions.json
│   │       └── market_data.json
│   ├── satellite_imagery/
│   │   ├── mangrove_sites/
│   │   │   ├── site_1_before.tif
│   │   │   ├── site_1_after.tif
│   │   │   ├── site_2_before.tif
│   │   │   └── site_2_after.tif
│   │   ├── seagrass_beds/
│   │   └── salt_marshes/
│   └── scripts/
│       ├── data_generator.py
│       ├── csv_to_json.js
│       └── image_processor.py
│
├── docs/                              # Documentation
│   ├── api/
│   │   ├── endpoints.md
│   │   └── authentication.md
│   ├── blockchain/
│   │   ├── smart_contracts.md
│   │   └── deployment.md
│   ├── setup/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   └── deployment.md
│   └── user_guide/
│       ├── project_registration.md
│       ├── credit_trading.md
│       └── verification_process.md
│
├── scripts/                           # Utility Scripts
│   ├── setup.sh
│   ├── deploy.sh
│   ├── test.sh
│   └── start.sh
│
└── config/                           # Global Configuration
    ├── docker-compose.yml
    ├── .env.example
    └── constants.js
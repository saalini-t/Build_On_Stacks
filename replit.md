# Blue Carbon Registry

## Overview

The Blue Carbon Registry is a blockchain-enabled platform for managing carbon credits from marine and coastal ecosystem restoration projects. The application demonstrates an end-to-end carbon credit lifecycle, from project registration and data collection to credit minting, trading, and retirement. The platform focuses on blue carbon projects such as mangrove restoration, seagrass conservation, and salt marsh protection, providing a transparent and verifiable system for carbon offset transactions.

The system simulates real-world environmental monitoring through sensor data integration and satellite imagery verification, with automatic smart contract-based verification and token minting capabilities. It includes a comprehensive marketplace for credit trading and wallet functionality for managing carbon credit portfolios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a modern component-based architecture. The frontend uses Vite for development tooling and build optimization, with Wouter for client-side routing. The UI is constructed with Radix UI primitives and styled using Tailwind CSS with a custom design system based on the shadcn/ui component library.

State management is handled through TanStack Query (React Query) for server state and API caching, eliminating the need for additional global state management solutions. The application follows a page-based routing structure with dedicated views for Dashboard, Projects, Marketplace, and Wallet management.

The three-dimensional globe visualization is implemented using Three.js for interactive project location mapping, providing an engaging way to display global blue carbon projects.

### Backend Architecture
The server-side implementation uses Express.js with TypeScript, providing a RESTful API architecture. The backend serves both API endpoints and static assets, with Vite integration for development hot-reloading.

The API follows RESTful conventions with clear resource-based routing for projects, carbon credits, transactions, and sensor data. The backend includes comprehensive error handling and request logging middleware for monitoring and debugging.

Data validation is implemented using Zod schemas shared between client and server, ensuring type safety and data integrity across the application boundaries.

### Database Layer
The application uses Drizzle ORM with PostgreSQL for data persistence. The database schema defines entities for users, projects, carbon credits, transactions, and sensor data with proper relationships and constraints.

The schema includes support for JSON data types for flexible storage of verification documents and satellite imagery metadata. Database migrations are managed through Drizzle Kit with environment-based configuration.

Currently, the application includes a fallback in-memory storage implementation for development and testing purposes, with the ability to switch to full database persistence.

### Authentication and Authorization
The system implements a role-based access control model with user types including regular users, project developers, and verifiers. Wallet connection functionality is integrated for blockchain interactions, supporting MetaMask and other Web3 wallet providers.

Authentication state is managed through the API layer with session-based persistence, and the frontend adapts UI elements based on user roles and authentication status.

### Blockchain Integration
The platform includes Web3 integration capabilities for blockchain interactions, specifically designed for Ethereum or Polygon networks. Smart contract integration handles carbon credit token minting, transfers, and retirement operations.

The blockchain layer is abstracted through service modules that handle wallet connections, transaction submissions, and contract interactions. The system includes mock implementations for development and demonstration purposes.

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive primitive component library providing accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework for styling with custom design tokens
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **Class Variance Authority**: Utility for creating type-safe component variants

### Data and State Management
- **TanStack React Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Form state management with validation integration
- **Zod**: Schema validation for type-safe data validation across client and server

### Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Static typing for improved developer experience and code reliability
- **ESBuild**: Fast JavaScript bundler used by Vite for production builds

### Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM with excellent TypeScript integration
- **Neon Database**: Serverless PostgreSQL database service (via @neondatabase/serverless)
- **PostgreSQL**: Primary database system for data persistence

### 3D Visualization
- **Three.js**: JavaScript 3D library for rendering the interactive globe and project visualizations

### Web3 and Blockchain
- **Web3 wallet libraries**: Integration capabilities for MetaMask and other Ethereum wallet providers
- **Blockchain interaction utilities**: For smart contract deployment and interaction on Ethereum/Polygon networks

### Additional Utilities
- **Date-fns**: Date manipulation and formatting library
- **Embla Carousel**: Touch-friendly carousel component for image galleries
- **Wouter**: Lightweight client-side routing library for single-page application navigation
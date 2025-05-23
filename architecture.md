# Airlines Manager Webapp Architecture

## Overview
This document outlines the architecture for the Airlines Manager recommendation webapp. The application will help users optimize their airline operations by recommending the best aircraft for specific routes, optimal cabin configurations, and flight scheduling to maximize profitability.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: Tailwind CSS with shadcn/ui
- **State Management**: React Context API / Redux
- **Data Visualization**: Recharts for profitability graphs and route maps
- **HTTP Client**: Axios for API communication

### Backend
- **Framework**: Flask (Python)
- **Authentication & Database**: SupaBase
- **API Structure**: RESTful endpoints

## Database Schema (SupaBase)

### Users Table
- id (primary key)
- email
- password (handled by SupaBase auth)
- created_at
- last_login

### Airlines Table
- id (primary key)
- user_id (foreign key)
- name
- hub_airport_code
- balance
- created_at

### Aircraft Table
- id (primary key)
- manufacturer
- model
- range_km
- speed_kmh
- fuel_consumption
- capacity_eco
- capacity_business
- capacity_first
- price
- maintenance_cost
- category (shorthaul, midhaul, longhaul)
- cargo_capacity
- required_runway_length
- r_and_d_level

### Airports Table
- code (primary key)
- name
- city
- country
- continent
- runway_length
- hub_size
- latitude
- longitude

### Routes Table
- id (primary key)
- airline_id (foreign key)
- origin_airport_code
- destination_airport_code
- distance_km
- demand_economy
- demand_business
- demand_first
- demand_cargo
- competition_level
- created_at

### Owned Aircraft Table
- id (primary key)
- airline_id (foreign key)
- aircraft_id (foreign key)
- purchase_date
- configuration_eco
- configuration_business
- configuration_first
- assigned_route_id (foreign key, nullable)
- status (active, maintenance, etc.)

## Core Modules

### Authentication Module
- Handles user registration, login, and session management via SupaBase
- Manages user profiles and airline information

### Aircraft Recommendation Module
- Analyzes routes and recommends optimal aircraft based on:
  - Distance between airports
  - Passenger demand
  - Runway requirements
  - Aircraft range and capacity
  - Operational costs
  - Profitability calculations

### Cabin Configuration Optimizer
- Recommends optimal seat configuration based on:
  - Route demand for each class (economy, business, first)
  - Aircraft capacity constraints
  - Profitability calculations for different configurations
  - Competitive analysis

### Route Analysis Module
- Calculates route profitability
- Analyzes demand patterns
- Recommends flight frequency
- Considers hub-and-spoke vs. point-to-point strategies

### Data Import/Export Module
- Allows users to import their current airline data
- Exports recommendations and reports

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/user
- POST /api/auth/logout

### Airlines
- GET /api/airlines
- POST /api/airlines
- GET /api/airlines/:id
- PUT /api/airlines/:id
- DELETE /api/airlines/:id

### Aircraft
- GET /api/aircraft
- GET /api/aircraft/:id
- GET /api/aircraft/recommend?route_id=:id
- GET /api/aircraft/filter?params

### Routes
- GET /api/routes
- POST /api/routes
- GET /api/routes/:id
- PUT /api/routes/:id
- DELETE /api/routes/:id
- GET /api/routes/recommend?hub=:code&aircraft=:id

### Cabin Configuration
- GET /api/config/recommend?aircraft=:id&route=:id
- POST /api/config/optimize

## Data Flow

1. **User Authentication**:
   - User registers/logs in via SupaBase authentication
   - Application retrieves user profile and airline data

2. **Route Selection**:
   - User selects departure hub and destination
   - System retrieves airport data and calculates route distance
   - System analyzes passenger demand for the route

3. **Aircraft Recommendation**:
   - System filters aircraft based on route requirements
   - Calculates operational costs and potential revenue
   - Ranks aircraft by profitability
   - Presents recommendations to user

4. **Cabin Configuration Optimization**:
   - User selects an aircraft for a specific route
   - System analyzes demand for different classes
   - Calculates optimal seat configuration
   - Presents configuration recommendations with profitability metrics

5. **Results & Visualization**:
   - Display recommendations with detailed profitability analysis
   - Provide visual comparisons of different options
   - Allow user to save recommendations to their account

## SupaBase Integration

### Authentication
- Utilize SupaBase Auth for user management
- Implement email/password authentication
- Store user session tokens securely

### Database
- Create tables in SupaBase PostgreSQL database
- Set up row-level security policies for data protection
- Implement real-time subscriptions for collaborative features

### Storage
- Store aircraft images and airline logos
- Manage user-uploaded data

## Deployment Strategy
- Deploy Flask backend with SupaBase integration
- Deploy React frontend as a static website
- Set up proper CORS and security configurations

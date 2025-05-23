# SupaBase Database Setup Guide

## Overview
This guide will help you set up the necessary tables in your SupaBase project for the Airlines Manager application.

## Prerequisites
- SupaBase project created at https://klxiwfahaqwxwgmquipl.supabase.co
- Admin access to your SupaBase project

## Required Tables

### 1. users
This table stores user information and is managed by SupaBase Auth.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
```

### 2. airlines
This table stores information about each user's airline.

```sql
CREATE TABLE public.airlines (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  name TEXT NOT NULL,
  hub_airport_code TEXT NOT NULL,
  balance BIGINT DEFAULT 1000000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.airlines ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own airlines" ON public.airlines
  FOR SELECT USING (auth.uid() = user_id);
```

### 3. aircraft
This table stores aircraft specifications.

```sql
CREATE TABLE public.aircraft (
  id SERIAL PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  range_km INTEGER NOT NULL,
  speed_kmh INTEGER NOT NULL,
  fuel_consumption FLOAT NOT NULL,
  capacity_eco INTEGER NOT NULL,
  capacity_business INTEGER NOT NULL,
  capacity_first INTEGER NOT NULL,
  price BIGINT NOT NULL,
  maintenance_cost INTEGER NOT NULL,
  category TEXT NOT NULL,
  required_runway_length INTEGER NOT NULL,
  cargo_capacity INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view aircraft" ON public.aircraft
  FOR SELECT USING (true);
```

### 4. routes
This table stores route information.

```sql
CREATE TABLE public.routes (
  id SERIAL PRIMARY KEY,
  airline_id INTEGER REFERENCES public.airlines(id) NOT NULL,
  origin_airport_code TEXT NOT NULL,
  destination_airport_code TEXT NOT NULL,
  destination_name TEXT,
  destination_city TEXT,
  destination_country TEXT,
  distance_km INTEGER NOT NULL,
  demand_economy INTEGER NOT NULL,
  demand_business INTEGER NOT NULL,
  demand_first INTEGER NOT NULL,
  demand_cargo INTEGER DEFAULT 0,
  competition_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own routes" ON public.routes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.airlines
      WHERE airlines.id = routes.airline_id
      AND airlines.user_id = auth.uid()
    )
  );
```

### 5. owned_aircraft
This table stores aircraft owned by airlines.

```sql
CREATE TABLE public.owned_aircraft (
  id SERIAL PRIMARY KEY,
  airline_id INTEGER REFERENCES public.airlines(id) NOT NULL,
  aircraft_id INTEGER REFERENCES public.aircraft(id) NOT NULL,
  name TEXT,
  configuration_eco INTEGER NOT NULL,
  configuration_business INTEGER NOT NULL,
  configuration_first INTEGER NOT NULL,
  route_id INTEGER REFERENCES public.routes(id),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.owned_aircraft ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own aircraft" ON public.owned_aircraft
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.airlines
      WHERE airlines.id = owned_aircraft.airline_id
      AND airlines.user_id = auth.uid()
    )
  );
```

## Setting Up Tables

1. Go to your SupaBase project dashboard
2. Navigate to the "SQL Editor" section
3. Create a new query
4. Copy and paste each table creation script
5. Run the scripts one by one

## Sample Data

After creating the tables, you may want to add some sample data for testing:

### Sample Aircraft Data

```sql
INSERT INTO public.aircraft (manufacturer, model, range_km, speed_kmh, fuel_consumption, capacity_eco, capacity_business, capacity_first, price, maintenance_cost, category, required_runway_length)
VALUES
('Boeing', '737-800', 5765, 842, 2.5, 162, 12, 0, 80000000, 4500, 'midhaul', 2500),
('Airbus', 'A320', 6150, 828, 2.6, 150, 12, 0, 85000000, 4800, 'midhaul', 2200),
('Boeing', '787-9', 14140, 903, 5.8, 290, 48, 8, 270000000, 12000, 'longhaul', 3000),
('Airbus', 'A350-900', 15000, 903, 5.9, 300, 48, 8, 280000000, 13000, 'longhaul', 2800),
('Embraer', 'E190', 4537, 829, 2.0, 98, 6, 0, 45000000, 3000, 'shorthaul', 1800);
```

## Verification

To verify your setup:

1. Go to the "Table Editor" section in SupaBase
2. Check that all tables are created with the correct structure
3. Verify that the sample data is visible in the aircraft table
4. Test the application to ensure it can connect and retrieve data

## Troubleshooting

If you encounter issues:

1. Check that all tables are created with the exact names specified
2. Verify that Row Level Security policies are correctly applied
3. Ensure your SupaBase URL and API key are correctly configured in the application
4. Check the browser console for any error messages when using the application

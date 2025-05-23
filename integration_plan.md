# Frontend-Backend Integration

## Environment Configuration
```
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_KEY=your-supabase-key
```

## API Integration Points

### Authentication
- Login: POST /api/auth/login
- Register: POST /api/auth/register
- Logout: POST /api/auth/logout
- Get User: GET /api/auth/user

### Aircraft
- Get All Aircraft: GET /api/aircraft/
- Get Aircraft by ID: GET /api/aircraft/:id
- Recommend Aircraft: GET /api/aircraft/recommend?route_id=:id
- Filter Aircraft: GET /api/aircraft/filter?params

### Routes
- Get All Routes: GET /api/routes/
- Get Route by ID: GET /api/routes/:id
- Create Route: POST /api/routes/
- Update Route: PUT /api/routes/:id
- Delete Route: DELETE /api/routes/:id
- Recommend Routes: GET /api/routes/recommend?hub=:code&aircraft=:id

### Cabin Configuration
- Recommend Configuration: GET /api/config/recommend?aircraft=:id&route=:id
- Optimize Configuration: POST /api/config/optimize

## Integration Testing Checklist

### Authentication
- [ ] User registration with email/password
- [ ] User login with email/password
- [ ] Token storage and retrieval
- [ ] Protected route access
- [ ] User logout

### Aircraft Module
- [ ] Fetch and display all aircraft
- [ ] Filter aircraft by parameters
- [ ] Get aircraft recommendations for routes

### Route Module
- [ ] Fetch and display all routes
- [ ] Create new routes
- [ ] Update existing routes
- [ ] Delete routes
- [ ] Get route recommendations based on hub

### Cabin Configuration Module
- [ ] Get configuration recommendations
- [ ] Run advanced optimization
- [ ] Display configuration results

## CORS Configuration
Ensure the Flask backend has CORS enabled to accept requests from the frontend domain.

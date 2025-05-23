# Flask Backend Deployment Configuration

## Required Environment Variables
```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-key
SECRET_KEY=your-flask-secret-key
DEBUG=False
```

## CORS Configuration
The Flask backend has CORS enabled to accept requests from any origin during development. For production, we should restrict this to the specific frontend domain.

## Deployment Steps

1. Ensure all dependencies are in requirements.txt:
```bash
pip freeze > requirements.txt
```

2. Configure the Flask app to listen on 0.0.0.0:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

3. Set up environment variables for production

4. Deploy the Flask application using the deployment tool

## React Frontend Deployment Configuration

1. Create production build:
```bash
cd airline-manager-frontend
pnpm build
```

2. Configure environment variables for production in .env.production:
```
VITE_API_URL=https://your-api-domain.com/api
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_KEY=your-supabase-key
```

3. Deploy the static build using the deployment tool

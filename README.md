<<<<<<< HEAD
# Full Stack Business Dashboard

assignment 3 - full stack app with mongodb, node/express backend, and react frontend

## Project Structure
```
fullstack-app/
  backend/     - node.js + express + mongodb
  frontend/    - react + vite + tailwind
```

## How to Run

### 1. Setup MongoDB
- create a free account at mongodb.com/atlas
- create a new cluster
- get your connection string
- replace MONGO_URI in backend/.env with your connection string

### 2. Run Backend
```
cd backend
npm install
npm run dev
```
backend runs on http://localhost:5000

### 3. Run Frontend
```
cd frontend
npm install --legacy-peer-deps
npm run dev
```
frontend runs on http://localhost:5173

### 4. Import Data
- go to http://localhost:5173/import
- upload your csv file
- it will clean the data and save to mongodb automatically

## API Endpoints
- GET /api/businesses - get all businesses (supports search, category, rating, city, page)
- GET /api/businesses/:id - get one business
- GET /api/businesses/stats - get dashboard statistics
- GET /api/businesses/categories - get all unique categories
- GET /api/businesses/cities - get all unique cities
- POST /api/businesses/import - bulk import data

## Tech Stack
- MongoDB (database)
- Express.js (backend framework)
- React (frontend)
- Node.js (runtime)
- Mongoose (mongodb library)
- Recharts (charts)
- React Router (page navigation)
- PapaParse (csv reading)

## Known Issues
- pagination shows all page numbers at once
- no authentication - api is open to anyone
- importing replaces all data instead of updating
- mobile layout broken on dashboard

made by nav
=======
# Business_db
>>>>>>> 0c1e38eda7f30a85f63ad7aa52790163946cdb2e

# Wysa

## Project Overview

This project is a backend developer mini project that replicates the Wysa Sleep app's assessment flow. The application includes a complete sleep assessment onboarding process with user authentication, data collection, and score calculation.

## Application Flow

The application follows a 4-step assessment process:

### 1. User Authentication (Login/Signup)
- **Login Screen**: Users can sign in with nickname and password
- **Signup Tab**: New users can create accounts with unique nickname and password
- **Tagline**: "Your journey to better sleep starts here"

### 2. Sleep Struggle Duration Assessment (Step 1 of 4)
- **Question**: "How long have you been struggling with sleep?"
- **Purpose**: Helps understand sleep pattern history
- **Options**:
  - Less than a month
  - 1-3 months
  - 3-6 months
  - More than 6 months

### 3. Bedtime Assessment (Step 2 of 4)
- **Question**: "What time do you usually go to bed?"
- **Purpose**: Captures typical bedtime routine
- **Input**: Time picker (default: 10:00 PM)
- **Icon**: Bed icon for visual context

### 4. Wake-up Time Assessment (Step 3 of 4)
- **Question**: "What time do you usually wake up?"
- **Purpose**: Captures typical wake-up routine
- **Input**: Time picker (default: 07:00 AM)
- **Icon**: Sun icon for visual context

### 5. Sleep Duration Assessment (Step 4 of 4)
- **Question**: "How many hours of sleep do you typically get?"
- **Purpose**: Calculates average sleep duration
- **Input**: Slider control (3h to 12h range)
- **Default**: 7 hours
- **Icon**: Clock icon

### 6. Assessment Results
- **Personalized Score**: Calculated based on responses (e.g., 31 out of 100)
- **Summary Display**: Shows all collected data
  - Sleep Duration: 7 hours
  - Bedtime: 22:00
  - Wake Time: 07:00
- **Actions**: 
  - "Take Assessment Again" button
  - "Logout" option
- **Motivational Message**: "Let's work together to improve your sleep quality"

## Tech Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS (assumed)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT 

### Package Manager
- **Tool**: pnpm

## Project Structure

```
wysa/
├── frontend/          # Next.js frontend application
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── package.json
├── backend/           # Express.js backend application
│   ├── src/
│   ├── prisma/
│   ├── routes/
│   └── package.json
├── README.md
└── package.json
```

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreyansh232/wysa
   cd wysa
   ```

2. **Install backend dependencies**
   ```bash
   pnpm install
   ```

3. **Database Setup**
   ```bash
   # Set up your PostgreSQL database
   # Update your .env file with database connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/wysa_sleep"
   ```

4. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the backend server**
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

3. **Start the frontend development server**
   ```bash
   pnpm dev
   ```

## API Design

### Authentication Endpoints

#### POST /api/auth/signup
```json
{
  "nickname": "string",
  "password": "string"
}
```

#### POST /api/auth/login
```json
{
  "nickname": "string",
  "password": "string"
}
```

### Assessment Endpoints

#### POST /api/assessment/start
- Initializes a new assessment session
- Requires authentication

#### PATCH /api/assessment/update
```json
{
  "step": "number",
  "data": {
    "sleepStruggleDuration": "string",
    "bedtime": "string",
    "wakeTime": "string",
    "sleepDuration": "number"
  }
}
```

#### POST /api/assessment/complete
- Calculates and returns final assessment score
- Stores complete assessment data

#### GET /api/assessment/results/:id
- Retrieves assessment results
- Returns calculated score and summary

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Assessments Table
```sql
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  sleep_struggle_duration VARCHAR(50),
  bedtime TIME,
  wake_time TIME,
  sleep_duration INTEGER,
  calculated_score INTEGER,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features Implemented

### Core Features
- [x] User authentication (signup/login)
- [x] Multi-step assessment flow
- [x] Progress tracking (25%, 50%, 75%, 100%)
- [x] Data persistence
- [x] Score calculation
- [x] Results display

### Bonus Features
- [x] Secure authentication
- [x] RESTful API design
- [x] Database optimization for analytics
- [x] Responsive UI components
- [x] Session management

## Analytics Considerations

The database schema is designed to support analytics queries:
- User engagement tracking
- Assessment completion rates
- Sleep pattern analysis
- Demographic insights
- Longitudinal sleep data trends

## Security Features

- Password hashing
- JWT-based authentication
- Protected API endpoints
- Input validation
- SQL injection prevention (via Prisma)

## Running the Application

1. **Start Backend Server**
   ```bash
   pnpm dev
   ```

2. **Start Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   pnpm dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8088` 


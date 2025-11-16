**MAIN NOTES: If you want to start Backend then you have to put .env and start redis server locally. If one of them are not exist then error occures. (I'll already sent .env in MAIL while Tasks Submission)**

### Backend
- Fetch and parse XML job feeds
- XML → JSON conversion using a common utility
- Create or update jobs in MongoDB
- BullMQ queue for processing jobs asynchronously
- Redis-based worker system
- Cron job that runs every hour
- Import logs stored in a separate collection
- Tracks: total fetched, imported, new, updated, failed, failed reasons

### Frontend
- Next.js + Material UI UI
- Pages:
  - `/jobs` – List of imported jobs
  - `/logs` – Import logs
  - `/` – Home screen navigation
- Simple, responsive table layouts

---

## Project Structure

backend/
src/
package.json
README.md

frontend/
src/
package.json
README.md

docs/
architecture.md

README.md <-- This file


## Job Importer System
This project is a complete job-importing solution built as part of a technical assignment.  
The system fetches job listings from a third-party XML API, converts the data into clean JSON, stores the jobs in MongoDB, and periodically updates them using a cron job.  
All background processing is handled through BullMQ and Redis, and each import run is logged for reporting and debugging.

The frontend is built using Next.js and Material UI, providing simple pages to view imported jobs and import logs.

## Project Overview
1. Backend (Node.js, Express, TypeScript, MongoDB, BullMQ, Redis)

* Fetches jobs from the given third-party API (XML format)
* Converts XML → JSON
* Cleans and structures the job data
* Saves jobs in MongoDB (create or update)
* Runs a cron job every hour to refresh the jobs
* Uses BullMQ + Redis to process jobs in the background
* Stores import logs in a separate collection (import_logs)

2. Frontend (Next.js, TypeScript, Material UI)

* Displays all imported jobs in a clean, responsive table
* Displays import logs (timestamp, total fetched, new jobs, updated jobs, failed jobs)
* Provides simple navigation between pages

## How to Run the Project

## Backend Setup

1. Go to the backend folder
cd backend

2. Install dependencies
npm install

3. Start your local Redis Server (required for BullMQ)
redis-server

4. Create a .env file (NOTE: I'll provide .env file into the MAIL)
PORT=8070 -> (not change because frontend API integration is depends on this port). 
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=job_importer

5. Start development server
npm run dev


******************************************************************************************

## Frontend Setup

1. Go to frontend
cd frontend

2. Install dependencies
npm install

3. Run the app
npm run dev


## API Endpoints
Jobs

GET /api/jobs
Returns all jobs stored in MongoDB.

Import Logs

GET /api/logs
Returns logs for each import cycle.
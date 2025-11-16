The system has three major components:

**MAIN NOTES: If you want to start Backend then you have to put .env and start redis server locally. If one of them are not exist then error occures. (I'll already sent .env in MAIL while Tasks Submission)** 


1. **Data Fetching Layer**  
   Responsible for requesting XML job feeds and converting the XML response into structured JSON.

2. **Processing Layer (Queue + Worker)**  
   Uses BullMQ + Redis to process job imports asynchronously so the server stays fast and scalable.

3. **Storage + Logging Layer**  
   Stores job entries in MongoDB and keeps a detailed history of every import run.

4. **Frontend Viewer**  
   Next.js + MUI pages used to display imported jobs and import l


## Backend Architecture

### 1. Fetching XML from Third-Party API
- API URLs are predefined in the cron task.
- The system builds dynamic URLs based on required query params.
- Raw XML is fetched using Axios.
- XML is converted to JSON using a reusable helper utility.

### 2. Processing Jobs (BullMQ)
The processing flow is: Cron Job → Queue → Worker → MongoDB

### 3. Worker Logic
The worker:
- Receives a batch of jobs
- Loops through each item
- Creates or updates
- Tracks:
  - created count
  - updated count
  - failed count

If a job fails:
- Worker catches the error
- Saves reason + job ID

### 4. Cron Job Execution
The cron runs **every hour**:
- Fetches all feeds
- Pushes results into BullMQ queue
- Worker processes them asynchronously

### 5. Import Logs
Every time an import finishes, an entry is written to `import_logs`:

Stored fields:
- totalFetched
- totalImported
- newJobs
- updatedJobs
- failedCount
- failedJobs (array of reasons)
- timestamp
- feedURL

This gives a clear history of system behavior.



## Frontend Architecture

### Framework: Next.js + Material UI

Pages:
- `/` → Home page with navigation
- `/jobs` → Displays all imported jobs
- `/logs` → Displays import log history

API layer is simple:
- Uses `fetch()` to call backend
- Renders data in Material UI tables

The design intentionally keeps padding, spacing, and typography clean and consistent.## 🔧 Major Design Decisions

### **TypeScript Everywhere**
TypeScript was used in both frontend and backend to ensure type safety.

### **Separation of Concerns**
- Services handle business logic
- Controllers remain thin
- Workers handle heavy lifting
- Utils provide shared helpers

### **MongoDB for Flexible Storage**
Job data shape varies based on API feed.  
MongoDB handles this variation easily.

### **BullMQ for Scalability**
Even if API returns thousands of jobs, the worker processes them without blocking incoming requests.

### **Logging for Observability**
Import logs help developers and admins:
- understand system health  
- track failures  
- debug issues  
- see hourly activity  

### **Minimal but Clean Frontend**
Material UI keeps the UI simple, readable, and consistent.

## Future Improvements (If this were a real project)
- Pagination and filtering on jobs list
- Better error grouping
- Retry mechanism for failed jobs
- Email/SMS alerts on major failures
- Dashboard visual charts

## Summary

This system was designed with:
- clarity  
- reliability  
- modularity  
- and clean code structure  

The entire workflow is predictable, maintainable, and easy to extend in a real environment.
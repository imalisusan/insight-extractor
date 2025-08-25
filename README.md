# Insight Extractor Backend API

A robust backend API that allows clients to upload text files, analyze them using the Gemini API, and manage submission history through GraphQL and REST endpoints.

## Video Demo Link
Please find the link to the video demo at: https://drive.google.com/file/d/1dLHxcT62TKPYAufb-XERPpXGpQnB7xpd/view?usp=sharing

## Architecture Overview

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **API**: GraphQL with REST file upload endpoint
- **External Service**: Google Gemini API for text analysis
- **File Storage**: Local file system for temporary uploads
- **API Testing**: Postman, cURL, or any HTTP client


## Project Structure

```
insight-extractor/
└── backend/                 # NestJS backend application
    ├── src/
    │   ├── database/        # Database entities and configuration
    │   ├── file/           # File handling service
    │   ├── gemini/         # Gemini API integration
    │   ├── submissions/    # Submissions module (GraphQL)
    │   ├── upload/         # File upload controller (REST)
    │   └── schema.gql      # GraphQL schema
    ├── uploads/            # Temporary file storage
    ├── .env.example        # Environment variables template
    └── database.sqlite     # SQLite database file
```

## Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn
- Gemini API key from Google AI Studio
- API testing tool (Postman, cURL, or similar)

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher) 
- **npm** (comes with Node.js)
- **Git** - 
- **Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **API testing tool** (Postman, cURL, or similar)

### Backend Setup

1. **Clone and navigate to the repository:**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   DATABASE_PATH=./database.sqlite
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key
   - Paste it in your `.env` file

5. **Create upload directory:**
   ```bash
   mkdir -p uploads
   ```

6. **Start the development server:**
   ```bash
   npm run start:dev
   ```

   The backend will be available at:
   - REST API: http://localhost:3000

### API Testing Setup

#### Using Postman 
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create requests with these settings:
   - **GraphQL Endpoint**: `POST http://localhost:3000/graphql`
   - **Headers**: `Content-Type: application/json`
   - **File Upload**: `POST http://localhost:3000/upload` (form-data)


## API Documentation

### GraphQL Schema

#### Types
```graphql
type Submission {
  id: ID!
  originalFilename: String!
  geminiSummary: String
  geminiKeyPoints: String
  userEditedSummary: String
  userEditedKeyPoints: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum AnalysisType {
  SUMMARIZE
  EXTRACT_KEY_POINTS
}
```

#### Queries
```graphql
# Get all submissions
query GetSubmissions {
  submissions {
    id
    originalFilename
    geminiSummary
    geminiKeyPoints
    createdAt
  }
}

# Get single submission
query GetSubmission($id: ID!) {
  submission(id: $id) {
    id
    originalFilename
    geminiSummary
    geminiKeyPoints
    userEditedSummary
    userEditedKeyPoints
    createdAt
    updatedAt
  }
}
```

#### Mutations
```graphql
# Analyze uploaded file
mutation AnalyzeFile($fileId: String!, $analysisType: AnalysisType!) {
  analyzeFile(fileId: $fileId, analysisType: $analysisType) {
    id
    originalFilename
    geminiSummary
    geminiKeyPoints
  }
}

# Update submission with user edits
mutation UpdateSubmission($id: ID!, $input: UpdateSubmissionInput!) {
  updateSubmission(id: $id, input: $input) {
    id
    userEditedSummary
    userEditedKeyPoints
    updatedAt
  }
}
```

### REST Endpoints

#### File Upload
```
POST /upload
Content-Type: multipart/form-data

Body: file (form field)
Response: { fileId: string }
```

## Usage Flow

1. **Upload File**: Client uploads a .txt file via REST endpoint (`POST /upload`)
2. **File Processing**: Backend receives and temporarily stores the file
3. **AI Analysis**: Client triggers analysis via GraphQL mutation with file ID
4. **Gemini Processing**: Backend sends file content to Gemini API for analysis
5. **Data Storage**: Analysis results are saved to SQLite database
6. **Retrieve Results**: Client queries submission data via GraphQL
7. **Edit & Update**: Client can update submissions with custom edits via GraphQL mutations
8. **History Management**: All submissions accessible via GraphQL queries

### Database Schema
The application uses SQLite with TypeORM. The database is automatically created when the backend starts. The main entity is `Submission` which stores:
- Original filename
- Gemini-generated summary and key points
- User-edited versions (optional)
- Timestamps


**Database Issues:**
```bash
# Delete and recreate database
rm database.sqlite
# Restart the server to recreate
```


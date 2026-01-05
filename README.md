# 🚀 ElevateCV - AI-Powered Resume Analysis Platform

<div align="center">

![ElevateCV](https://img.shields.io/badge/ElevateCV-Resume%20Analyzer-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19.0-brightgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)

**Transform your resume into a winning document with AI-powered analysis and actionable feedback.**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [API Documentation](#api-documentation) • [File Structure](#file-structure)

</div>

---

## 📋 Overview

**ElevateCV** is a full-stack web application that provides intelligent resume analysis and real-time feedback. Users can upload resumes in multiple formats (PDF, DOCX, or images), receive AI-powered analysis tailored to specific job descriptions, and download detailed PDF reports with actionable improvement suggestions.

The platform combines **OCR technology**, **document parsing**, and **AI-driven analysis** to evaluate resumes across multiple dimensions including ATS compatibility, content quality, skills relevance, formatting, and professional tone.

---

## ✨ Features

### 👤 User Management

- **User Registration & Authentication** - Secure signup with JWT tokens
- **Profile Management** - Edit profile details, upload profile pictures
- **Role-Based Access** - Support for students, mentors, and recruiters
- **Persistent Authentication** - Token-based session management

### 📄 Resume Analysis

- **Multi-Format Support** - PDF, DOCX, and image file uploads
- **Text Extraction** - Advanced OCR for images using Tesseract
- **AI-Powered Analysis** - Uses OpenRouter/OpenAI-compatible APIs
- **Comprehensive Feedback** - Evaluation across 6 key dimensions:
  - **ATS Score** - Applicant Tracking System compatibility
  - **Content Quality** - Clarity, relevance, and structure
  - **Metrics & Impact** - Quantified achievements and results
  - **Formatting & Structure** - Layout, readability, and organization
  - **Skills** - Hard and soft skills relevance
  - **Tone & Style** - Professional language and consistency

### 📊 Reports & Downloads

- **PDF Reports** - Generate beautiful, downloadable analysis reports
- **Dashboard** - View all analyzed resumes and their feedback
- **Resume History** - Track multiple resume versions and analyses

### 🌐 Additional Pages

- **How It Works** - Guide users through the process
- **Blog** - Share resume tips and best practices
- **Support** - Customer support and FAQs
- **Landing** - Engaging homepage

---

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.0 - Modern UI library
- **Vite** 7.2.2 - Lightning-fast build tool
- **React Router** 7.9.5 - Client-side routing
- **Tailwind CSS** 4.1.17 - Utility-first styling
- **Recharts** 3.5.1 - Data visualization
- **React Hot Toast** 2.6.0 - Toast notifications
- **React Icons** 5.5.0 - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **MongoDB** 8.19.0 - NoSQL database
- **Mongoose** - MongoDB object modeling

### AI & Document Processing

- **OpenRouter API** - AI model integration
- **pdf-parse** 2.1.7 - PDF text extraction
- **Mammoth** 1.11.0 - DOCX text extraction
- **Tesseract.js** 6.0.1 - OCR for images
- **PDFKit** 0.17.2 - PDF generation

### Security & Utilities

- **JWT** (jsonwebtoken) - Token-based authentication
- **Bcrypt** - Password hashing
- **Multer** 2.0.2 - File upload handling
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

---

## 📁 Project Structure

```
ElevateCV/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── main.jsx                 # App entry point with routing
│   │   ├── App.jsx                  # Main component wrapper
│   │   ├── index.css                # Global styles
│   │   ├── components/
│   │   │   ├── NavBar.jsx           # Navigation bar
│   │   │   ├── ResumeReview.jsx     # Resume feedback display
│   │   │   ├── ErrorBox.jsx         # Error messages
│   │   │   ├── Loader.jsx           # Loading spinner
│   │   │   └── Footer.jsx           # Footer component
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Homepage
│   │   │   ├── Login.jsx            # Sign in page
│   │   │   ├── SignUp.jsx           # Registration page
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── ResumeUpload.jsx     # Upload interface
│   │   │   ├── ResumeReviewPage.jsx # Analysis results
│   │   │   ├── EditProfile.jsx      # Profile editor
│   │   │   ├── HowItWorksPage.jsx   # Instructions
│   │   │   ├── BlogPage.jsx         # Blog content
│   │   │   └── SupportPage.jsx      # Help & support
│   │   ├── lib/
│   │   │   └── api.js               # API communication
│   │   ├── constants/
│   │   │   └── resumes.js           # Constants
│   │   └── assets/                  # Images & static files
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── index.js                 # Server entry point
│   │   ├── config/
│   │   │   └── dbConnect.js         # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Resume.js            # Resume schema
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── resumeController.js  # Resume upload & analysis
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── resumeRoutes.js      # Resume endpoints
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT protection
│   │   ├── services/
│   │   │   └── aiService.js         # AI analysis service
│   │   └── utils/
│   │       └── aiUtils.js           # AI prompt templates
│   ├── uploads/                     # User uploaded files
│   │   └── avatars/                 # Profile pictures
│   ├── eng.traineddata              # Tesseract OCR data
│   ├── package.json
│   └── .env                         # Environment config
│
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **OpenRouter API Key** (or OpenAI-compatible endpoint)

### 1️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server
PORT=8000
```

**Start the backend:**

```bash
npm run dev
```

The server will run on `http://localhost:8000`

### 2️⃣ Frontend Setup

```bash
cd client
npm install
```

**Start the development server:**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3️⃣ Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

Create an account, upload a resume, and get AI-powered feedback!

---

## 🔐 Environment Variables Reference

### Backend (`.env`)

| Variable             | Type   | Required | Description                                   |
| -------------------- | ------ | -------- | --------------------------------------------- |
| `MONGO_URI`          | String | ✅       | MongoDB connection URI (without `/db` suffix) |
| `JWT_SECRET`         | String | ✅       | Secret key for JWT token signing              |
| `OPENROUTER_API_KEY` | String | ✅       | API key for OpenRouter                        |
| `ROUTER_ACCESS`      | String | ✅       | OpenRouter API endpoint                       |
| `ROUTER_MODEL`       | String | ✅       | Model name (e.g., `openai/gpt-oss-20b:free`)  |
| `PORT`               | Number | ❌       | Server port (default: `5000`)                 |

**Important Note:** The `MONGO_URI` should not include the database name. The application automatically appends `/elevatecv` to it.

Example: `mongodb+srv://user:pass@cluster.mongodb.net` ✅ (correct)
Example: `mongodb+srv://user:pass@cluster.mongodb.net/elevatecv` ❌ (incorrect)

---

## 📚 Database Schema

### User Model (`server/src/models/User.js`)

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  company: String,
  role: String (enum: ["student", "mentor", "recruiter"]),
  resumes: [ObjectId] (references to Resume documents),
  profileImage: String (path to avatar),
  contactNumber: String,
  timestamps: true
}
```

### Resume Model (`server/src/models/Resume.js`)

```javascript
{
  user: ObjectId (reference to User, required),
  companyName: String,
  jobTitle: String,
  jobDescription: String,
  resumePath: String (path to uploaded file),
  feedback: Mixed (AI analysis results),
  timestamps: true
}
```

---

## 🔌 API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

All protected endpoints require an `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

### 🔓 Authentication Endpoints

#### 1. Register User

```
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "company": "Tech Corp",
  "role": "student"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Implementation:** `server/src/controllers/authController.js` - `registerUser()`

---

#### 2. Login User

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Implementation:** `server/src/controllers/authController.js` - `loginUser()`

---

#### 3. Logout User

```
POST /auth/logout
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

**Implementation:** `server/src/controllers/authController.js` - `logoutUser()`

---

#### 4. Get User Profile

```
GET /auth/profile
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "company": "Tech Corp",
    "profileImage": "/uploads/avatars/1702031234567-profile.jpg",
    "resumes": [
      {
        "_id": "607f1f77bcf86cd799439012",
        "jobTitle": "Software Engineer",
        "jobDescription": "...",
        "feedback": {...},
        "createdAt": "2024-12-07T10:00:00Z"
      }
    ]
  }
}
```

**Implementation:** `server/src/controllers/authController.js` - `getUserProfile()`

---

#### 5. Update User Profile

```
POST /auth/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "company": "New Corp",
  "contactNumber": "+1-555-0123",
  "role": "mentor"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "role": "mentor",
    "company": "New Corp",
    "contactNumber": "+1-555-0123"
  }
}
```

**Implementation:** `server/src/controllers/authController.js` - `updateUser()`

---

#### 6. Upload Profile Image

```
POST /auth/profile/image
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data
```

**Request:**

- Form field: `image` (file)

**Response (200):**

```json
{
  "success": true,
  "message": "Profile image updated successfully.",
  "user": {...},
  "imagePath": "/uploads/avatars/1702031234567-profile.jpg"
}
```

**Implementation:** `server/src/controllers/authController.js` - `uploadProfileImage()`

---

### 📄 Resume Endpoints

#### 1. Upload Resume & Analyze

```
POST /resume/upload
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data
```

**Request:**

- File field: `resume` (PDF, DOCX, or image)
- Optional fields:
  - `jobTitle` (String)
  - `jobDescription` (String)
  - `companyName` (String)

**Response (201):**

```json
{
  "success": true,
  "resumeId": "607f1f77bcf86cd799439012",
  "jobTitle": "Software Engineer",
  "jobDescription": "Build scalable systems...",
  "feedback": {
    "overallScore": 78,
    "sections": {
      "ATS": {
        "score": 82,
        "tips": [
          {
            "type": "good",
            "tip": "Good use of standard section headers",
            "explanation": "Headings like 'Experience' and 'Education' are ATS-friendly"
          },
          {
            "type": "improve",
            "tip": "Remove tables and graphics",
            "explanation": "ATS systems struggle with complex formatting"
          }
        ]
      },
      "Content": {...},
      "MetricsAndImpact": {...},
      "FormattingAndStructure": {...},
      "Skills": {...},
      "ToneAndStyle": {...}
    }
  }
}
```

**File Processing Flow:**

1. File uploaded and saved via Multer
2. Text extracted based on file type:
   - PDF: `pdf-parse` library
   - DOCX: `mammoth` library
   - Images: `tesseract.js` OCR
3. Text sent to `analyzeWithAI()` in `server/src/services/aiService.js`
4. AI response normalized and stored in MongoDB
5. Resume linked to user's resumes array

**Implementation:** `server/src/controllers/resumeController.js` - `uploadResume()`

---

#### 2. Get Resume Details

```
GET /resume/:id
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "resume": {
    "_id": "607f1f77bcf86cd799439012",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "jobTitle": "Software Engineer",
    "jobDescription": "...",
    "resumePath": "/uploads/1702031234567-resume.pdf",
    "feedback": {...},
    "createdAt": "2024-12-07T10:00:00Z",
    "updatedAt": "2024-12-07T10:00:00Z"
  }
}
```

**Implementation:** `server/src/controllers/resumeController.js` - `getResumeById()`

---

#### 3. Delete Resume

```
DELETE /resume/:id
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

**Deletes:**

- Physical file from `uploads/`
- Resume document from MongoDB
- Reference from user's resumes array

**Implementation:** `server/src/controllers/resumeController.js` - `deleteResumeById()`

---

#### 4. Download Resume Report (PDF)

```
GET /resume/:id/report/pdf
Authorization: Bearer <TOKEN>
```

**Response:** Binary PDF file

**PDF Contents:**

- Header with "ElevateCV Resume Analysis Report"
- User and job information
- Overall score
- Section-wise scores and tips:
  - ATS Score
  - Content Quality
  - Metrics & Impact
  - Formatting & Structure
  - Skills
  - Tone & Style

**Implementation:** `server/src/controllers/resumeController.js` - `downloadResumeReportPdf()`

---

## 🤖 AI Analysis System

### AI Service Architecture

**File:** `server/src/services/aiService.js`

The `analyzeWithAI()` function orchestrates the AI analysis:

```javascript
export async function analyzeWithAI(
  resumeText = "",
  jobTitle = "",
  jobDescription = "",
  roleLevel = "mid"
)
```

**Process:**

1. Validates `OPENROUTER_API_KEY` environment variable
2. Prepares structured prompt using `prepareInstructions()` from `aiUtils.js`
3. Sends request to OpenRouter API via `process.env.ROUTER_ACCESS`
4. Parses JSON response
5. Handles double-escaped JSON and nested feedback structures
6. Returns normalized feedback object

**Key Features:**

- Automatic JSON extraction from AI response
- Fallback handling for malformed responses
- Nested feedback parsing for backward compatibility

---

### AI Prompt Template

**File:** `server/src/utils/aiUtils.js`

The prompt instructs the AI model to evaluate resumes across 6 dimensions:

```javascript
const AIResponseFormat = `
interface Feedback {
  overallScore: number;            // 0-100 scale
  sections: {
    ATS: {
      score: number;
      tips: { type: "good" | "improve"; tip: string; }[];
    };
    Content: {
      score: number;
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    MetricsAndImpact: {
      score: number;
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    FormattingAndStructure: {
      score: number;
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    Skills: {
      score: number;
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    ToneAndStyle: {
      score: number;
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
  };
}
`;
```

**Evaluation Criteria:**

- **ATS**: Keyword matching, clear headings, simple formatting, file type
- **Content**: Experience matching, quantified achievements, clarity
- **Metrics & Impact**: Measurable results, quantification
- **Formatting & Structure**: Readability, section order, layout
- **Skills**: Hard & soft skills relevance, keyword matching
- **Tone & Style**: Professional voice, consistency, avoiding clichés

---

## 🔐 Authentication & Authorization

### JWT Implementation

**File:** `server/src/middleware/authMiddleware.js`

The `protect` middleware:

1. Checks for `Authorization: Bearer <token>` header
2. Extracts and verifies JWT token
3. Retrieves user from database
4. Attaches user to `req.user`

```javascript
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token." });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");
  next();
};
```

### Password Security

**File:** `server/src/controllers/authController.js`

- Passwords hashed using bcrypt with 10 salt rounds
- JWT tokens expire in 7 days

---

## 📤 File Upload & Storage

### Upload Locations

```
server/
├── uploads/
│   ├── [resume files]           # User uploaded resumes
│   └── avatars/                 # Profile pictures
```

### Multer Configuration

**Resume uploads** - `server/src/routes/resumeRoutes.js`:

```javascript
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
```

**Avatar uploads** - `server/src/routes/authRoutes.js`:

```javascript
const avatarStorage = multer.diskStorage({
  destination: avatarsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
```

### Served Statically

**File:** `server/src/index.js`

```javascript
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
```

Files accessible at: `http://localhost:8000/uploads/<filename>`

---

## 🌐 Frontend Routing

**File:** `client/src/main.jsx`

### Route Structure

| Path                 | Component        | Protected | Description    |
| -------------------- | ---------------- | --------- | -------------- |
| `/`                  | Landing          | No        | Homepage       |
| `/signin`            | Login            | No        | Sign in page   |
| `/signup`            | SignUp           | No        | Registration   |
| `/blog`              | BlogPage         | No        | Blog posts     |
| `/support`           | SupportPage      | No        | Help & support |
| `/how-it-works`      | HowItWorksPage   | No        | Instructions   |
| `/resume-upload`     | ResumeUpload     | Yes       | Upload resumes |
| `/resume-review/:id` | ResumeReviewPage | Yes       | View analysis  |
| `/dashboard`         | Dashboard        | Yes       | User dashboard |
| `/profile/edit`      | EditProfile      | Yes       | Edit profile   |
| `*`                  | NotFound         | No        | 404 page       |

### Protected Routes

Routes guarded by `ProtectedRoute` wrapper:

- Check for JWT token in `localStorage`
- Redirect to `/signin` if not authenticated
- Redirect to `/dashboard` if already logged in on public routes

---

## 🎨 Frontend Features

### Components

| Component    | File                                     | Purpose           |
| ------------ | ---------------------------------------- | ----------------- |
| NavBar       | `client/src/components/NavBar.jsx`       | Navigation header |
| ResumeReview | `client/src/components/ResumeReview.jsx` | Feedback display  |
| ErrorBox     | `client/src/components/ErrorBox.jsx`     | Error messages    |
| Loader       | `client/src/components/Loader.jsx`       | Loading spinner   |
| Footer       | `client/src/components/Footer.jsx`       | Footer section    |

### API Integration

**File:** `client/src/lib/api.js`

Centralized API communication module for all endpoints.

---

## 📊 Example Usage

### 1. Register & Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "SecurePass123",
    "company": "Tech Start",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

### 2. Upload Resume

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@/path/to/resume.pdf" \
  -F "jobTitle=Senior Developer" \
  -F "jobDescription=We are looking for a senior developer with 5+ years of experience" \
  -F "companyName=Tech Company"
```

### 3. Download PDF Report

```bash
curl -X GET http://localhost:5000/api/resume/RESUME_ID/report/pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o report.pdf
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoDB Connection Failed`

**Solutions:**

- Verify `MONGO_URI` is correct and database name is NOT included
- Check MongoDB Atlas IP whitelist includes your machine
- Ensure credentials are URL-encoded
- Test connection with MongoDB Compass

---

### AI Service Errors

**Error:** `OpenRouter API error (401)`

**Solutions:**

- Verify `OPENROUTER_API_KEY` is correct
- Check `ROUTER_ACCESS` endpoint is valid
- Ensure `ROUTER_MODEL` exists and is accessible
- Check API rate limits and quota

---

### File Upload Issues

**Error:** `No file uploaded` or file not found

**Solutions:**

- Ensure `uploads/` and `uploads/avatars/` directories exist
- Check server process has write permissions
- Verify multipart/form-data headers are set correctly
- Check file size limits in Multer config

---

### OCR Problems

**Error:** Poor text extraction from images

**Solutions:**

- Verify `eng.traineddata` is present in server root
- Ensure image quality is good (high DPI, clear text)
- Try uploading PDF or DOCX instead
- Check console logs for Tesseract errors

---

### CORS Issues

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions:**

- Ensure CORS middleware is enabled in `server/src/index.js`
- Check frontend API URL matches backend hostname
- Verify request headers are correct
- Clear browser cache and try again

---

## 🚀 Deployment

### Build Frontend

```bash
cd client
npm run build
```

Output: `client/dist/` directory

### Environment Setup (Production)

Create `.env` in `server/`:

```env
NODE_ENV=production
MONGO_URI=production_mongodb_uri
JWT_SECRET=production_secret_key_change_this
OPENROUTER_API_KEY=your_api_key
ROUTER_ACCESS=https://openrouter.ai/api/v1/chat/completions
ROUTER_MODEL=your_chosen_model
PORT=5000
```

### Start Production Server

```bash
cd server
npm install
npm run dev  # or use pm2/systemd for production
```

---

## 📝 Database Maintenance

### Backup MongoDB

```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/elevatecv"
```

### Restore MongoDB

```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/elevatecv" ./dump/elevatecv
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👥 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check the `/support` page in the application
- Review the `/blog` for tips and guides

---

## 🙏 Acknowledgments

- **OpenRouter** - For AI model integration
- **MongoDB** - For robust database solution
- **React & Vite** - For modern frontend development
- **Express** - For elegant backend framework
- All contributors and users of ElevateCV

---

<div align="center">

**Made with ❤️ by the ElevateCV Team**

[Back to Top](#-elevateCV---ai-powered-resume-analysis-platform)

</div>

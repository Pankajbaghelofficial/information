# AI Text to Voice Generator

A full-featured AI website that uses Google Cloud Text-to-Speech API to convert text to high-quality voice output (MP3).

## Features

### Frontend Features
- Text input box
- Language/voice type selector (Standard / WaveNet)
- Play audio button
- Download audio button
- Show character count
- User login/signup system
- Display remaining credits
- Usage history
- Mobile responsive UI

### Backend Features
- Google Cloud TTS API integration
- Credits-based system (deduct per character)
- User database
- Secure login/signup
- History logging per user
- Admin route to update voice plans & monitor usage
- Serve MP3 audio as downloadable link
- Rate limiting to avoid abuse

## Credit System
- Each character = 1 credit
- Free users = 10,000 credits/month
- Premium = 100,000 or unlimited (based on plan)

## Premium Monetization Plans
| Plan Name | Price | Features |
|-----------|-------|----------|
| Free | ₹0 | 10K credits/month, Standard voice only |
| Premium Basic | ₹199/mo | 1L credits, WaveNet voice access |
| Premium Pro | ₹499/mo | Unlimited usage, priority generation |

## Tech Stack
- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express
- DB: MongoDB
- Authentication: JWT
- API: Google Cloud Text-to-Speech

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Cloud account with Text-to-Speech API enabled
- Google Cloud Service Account key

### Backend Setup
1. Navigate to the server directory:
   ```
   cd ai-text-to-voice/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google-credentials.json
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   ```

4. Set up Google Cloud credentials:
   - Create a project in Google Cloud Console
   - Enable the Text-to-Speech API
   - Create a Service Account and download the JSON key
   - Place the JSON key in a secure location and update the `GOOGLE_APPLICATION_CREDENTIALS` path in your `.env` file

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd ai-text-to-voice/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

5. The application should now be running at `http://localhost:3000`

### Setting up an Admin User
1. Register a new user through the application
2. Connect to your MongoDB database and update the user's role to 'admin':
   ```
   db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } })
   ```

## Deployment
### Backend Deployment
1. Set up a server on Render, Railway, or similar platform
2. Configure environment variables
3. Deploy the server directory

### Frontend Deployment
1. Build the React application:
   ```
   cd client
   npm run build
   ```
2. Deploy the build folder to Vercel, Netlify, or similar platform

## License
MIT


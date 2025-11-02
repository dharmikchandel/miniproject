# Adaptive Project Generator (Demo)

Small MERN + LLM demo that generates a project spec, scaffolds file manifests, and bundles a zip for download.

## Quick run (dev / local)

1. Clone or create project files.
2. In `backend` folder: `npm install` then `npm run dev` (or `npm start`).
3. In `frontend` folder: `npm install` then `npm start`.
4. Open frontend at `http://localhost:3000` — pick skills and click Generate.
5. Generate a couple files, click Download, unzip and run the backend `npm install && npm start` then check `http://localhost:4000/health`.

## Demo checklist for faculty

- Open UI, click Generate → shows spec and manifest.
- Generate at least one file and preview it.
- Download zip and run backend health endpoint.

## Notes for implementer

- Fill in `backend/src/llm/adapters.js` with your provider calls (Cursor, Lovable, ChatGPT proxy).
- Keep model responses to valid JSON when generating project spec. For file content generation, instruct model to return *only* file content.
- Make sure MongoDB is running locally or set `MONGO_URI` environment variable.

## Environment Setup

Create a `backend/.env` file with the following variables:

```env
# MongoDB Connection
# Option 1: MongoDB Atlas (Cloud) - Recommended
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adaptive-generator?retryWrites=true&w=majority

# Option 2: Local MongoDB
# MONGO_URI=mongodb://127.0.0.1:27017/adaptive-generator

# Server Port
PORT=4000

# Gemini API Key (required)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Gemini model selection
# GEMINI_MODEL=gemini-pro
```

### MongoDB Atlas Setup (Cloud)

1. **Create a MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0)

2. **Get Your Connection String**
   - In Atlas Dashboard, click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (starts with `mongodb+srv://`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `adaptive-generator` (or your preferred database name)

3. **Configure Network Access**
   - Go to Atlas Dashboard → Network Access
   - Click "Add IP Address"
   - Add your current IP or `0.0.0.0/0` for development (less secure)

4. **Create Database User**
   - Go to Atlas Dashboard → Database Access
   - Create a new user with username and password
   - Grant "Atlas Admin" or "Read and write to any database" role

5. **Add Connection String to .env**
   - Paste your connection string into `backend/.env` as `MONGO_URI`

### Local MongoDB Setup

If using local MongoDB instead:
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://127.0.0.1:27017/adaptive-generator`

The LLM adapter is now implemented and uses Google Gemini API. Make sure to set your `GEMINI_API_KEY` in the `.env` file.


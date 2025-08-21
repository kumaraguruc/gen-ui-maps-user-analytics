# Gen UI Maps User Analytics

A full-stack application for visualizing and analyzing user data with interactive maps and charts.

## Project Structure

- `gen-ui-analytics/` - Frontend React application built with TypeScript, Vite, and Tailwind CSS
- `gen-ananlytics-backend/` - Backend FastAPI application

## Prerequisites

- Node.js (v22 or higher)
- Python (v3.8 or higher)
- pip3

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd gen-ananlytics-backend
   ```

2. Install the required dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```

3. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd gen-ui-analytics
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd gen-ananlytics-backend
   ```

2. Run the server:
   ```bash
   python3 run.py
   ```

   The backend server will start on http://localhost:8000

### Start the Frontend Development Server

1. Navigate to the frontend directory:
   ```bash
   cd gen-ui-analytics
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend application will be available at http://localhost:5173

## Environment Variables

### Backend (.env)

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: The port on which the backend server will run (default: 8000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

### Frontend

The frontend connects to the backend API at http://localhost:8000 by default.

## Building for Production

### Frontend

```bash
cd gen-ui-analytics
npm run build
```

The build output will be in the `dist` directory.

## License

[MIT](LICENSE)

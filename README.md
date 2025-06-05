

# TherapySim - AI Therapy Training Platform

An AI-powered therapy training platform that allows mental health professionals to practice with realistic LLM patient simulations.

## Features

- Two patient personas: Cooperative veteran (Sam) and challenging trauma survivor (Aisha)
- Real-time AI conversations powered by Meta Llama 3.2
- Professional therapist-focused interface
- Streaming responses with natural typing animation
- Session management and conversation history
- Graceful fallbacks when API unavailable

## Installation Guide

### Prerequisites
- Node.js 18+ installed
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

### Setup

1. **Clone Repository**
```bash
git clone https://github.com/wxuan03/empathetic-patient-pal
cd empathetic-patient-pal
```

2.  **Backend Setup**

bash

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
npm run dev
```

Backend runs on [http://localhost:3001](http://localhost:3001)

3.  **Frontend Setup**

bash

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on [http://localhost:8080](http://localhost:8080)

4.  **Open Application** Visit [http://localhost:8080](http://localhost:8080) in your browser

### Testing

-   **Health Check:** [http://localhost:3001/api/health](http://localhost:3001/api/health)
-   **API Test:** [http://localhost:3001/api/test](http://localhost:3001/api/test)

## Tech Stack

-   **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn/ui, Vite
-   **Backend:** Node.js, Express, OpenRouter API
-   **AI Model:** Meta Llama 3.2-3B (with mock response fallbacks)
-   **Features:** Server-Sent Events streaming, CORS, error handling
-   **Architecture:** RESTful API with separated frontend/backend

## Usage

1.  Select your experience level (Experienced or New therapist)
2.  Start chatting with AI patient personas
3.  Practice therapeutic responses in a safe environment

![image](https://github.com/user-attachments/assets/fce8b33d-375c-42b5-bd62-8cf78f4acf4d)

----------

Built for mental health professionals to enhance their therapeutic skills.

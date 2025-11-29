from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import agents

load_dotenv()

app = FastAPI(
    title="Fully Community AI Agent",
    description="AI-powered assistant for Fully Community platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

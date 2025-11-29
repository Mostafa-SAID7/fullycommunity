from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import recommendations, predictions, agents

load_dotenv()

app = FastAPI(
    title="Community Car AI Agent",
    description="AI-powered recommendations and predictions for Community Car",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendations.router, prefix="/api/recommend", tags=["Recommendations"])
app.include_router(predictions.router, prefix="/api/predict", tags=["Predictions"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

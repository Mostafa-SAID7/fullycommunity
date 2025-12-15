# CommunityCar AI Agent

AI-powered services for the CommunityCar platform.

## 📁 Project Structure

```
AiAgent/
├── app/                          # Main application package
│   ├── api/                      # API layer
│   │   ├── v1/                   # API version 1
│   │   │   ├── endpoints/        # Route handlers
│   │   │   │   ├── agents.py     # Chat assistant
│   │   │   │   ├── car.py        # Car advice & diagnostics
│   │   │   │   ├── damage.py     # Image damage detection
│   │   │   │   ├── voice.py      # Speech-to-text & TTS
│   │   │   │   ├── recommendations.py
│   │   │   │   ├── content.py    # Content generation
│   │   │   │   ├── training.py   # Dataset & training
│   │   │   │   ├── analyzer.py   # Text analysis
│   │   │   │   ├── moderation.py # Content moderation
│   │   │   │   ├── translator.py # Translation
│   │   │   │   └── scraping.py   # Web scraping
│   │   │   └── __init__.py       # API router
│   │   └── deps.py               # Dependencies
│   ├── core/                     # Core configuration
│   │   └── config.py             # Settings
│   ├── db/                       # Database
│   │   ├── models/               # SQLAlchemy models
│   │   │   ├── conversation.py
│   │   │   ├── training.py
│   │   │   ├── user.py
│   │   │   ├── embedding.py
│   │   │   └── logs.py
│   │   └── session.py            # DB connection
│   ├── agents/                   # AI agents
│   │   └── assistant.py          # Community assistant
│   ├── services/                 # Business logic
│   │   ├── analyzer.py
│   │   ├── car_assistant.py
│   │   ├── content_generator.py
│   │   ├── damage_detection.py
│   │   ├── moderation.py
│   │   ├── recommendation.py
│   │   ├── scraping.py
│   │   ├── translator.py
│   │   ├── voice_assistant.py
│   │   └── backend_client.py     # .NET API client
│   ├── training/                 # ML training
│   │   ├── dataset_manager.py
│   │   └── trainer.py
│   └── models/                   # Pydantic schemas
│       ├── common.py
│       ├── community.py
│       ├── marketplace.py
│       ├── user.py
│       └── ai.py
├── data/                         # Data directory
│   ├── models/                   # Trained models
│   ├── datasets/                 # Training datasets
│   └── uploads/                  # Uploaded files
├── tests/                        # Tests
├── main.py                       # FastAPI application
├── requirements.txt              # Dependencies
├── .env.example                  # Environment template
└── README.md
```

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd AiAgent
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run the server

```bash
uvicorn main:app --reload --port 8001
```

### 4. Open Swagger UI

Visit: http://localhost:8001/docs

## 🔌 API Endpoints

### Core Services

| Service | Endpoint | Description |
|---------|----------|-------------|
| **Agents** | `/api/v1/agents/chat` | AI chat assistant |
| **Car Assistant** | `/api/v1/car/advice` | Car advice & diagnostics |
| **Damage Detection** | `/api/v1/damage/analyze` | Image damage analysis |
| **Voice** | `/api/v1/voice/chat` | Voice chat (STT + TTS) |
| **Recommendations** | `/api/v1/recommendations/for-you` | Personalized recommendations |
| **Content** | `/api/v1/content/post` | AI content generation |

### Training

| Endpoint | Description |
|----------|-------------|
| `/api/v1/training/datasets` | Manage training datasets |
| `/api/v1/training/train/classifier` | Train classification models |

### Utility Services

| Service | Endpoint | Description |
|---------|----------|-------------|
| **Analyzer** | `/api/v1/analyzer/sentiment` | Sentiment analysis |
| **Moderation** | `/api/v1/moderation/moderate` | Content moderation |
| **Translator** | `/api/v1/translator/translate` | Translation |
| **Scraping** | `/api/v1/scraping/scrape` | Web scraping |

## 🗄️ Database

Supports SQLite (default), PostgreSQL, or SQL Server.

Configure via `DATABASE_URL` in `.env`:

```bash
# SQLite (default)
DATABASE_URL=sqlite:///./data/ai_agent.db

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost/ai_agent

# SQL Server
DATABASE_URL=mssql+pyodbc://user:pass@server/ai_agent?driver=ODBC+Driver+17+for+SQL+Server
```

## 🤖 ML Models

Models are loaded on-demand from HuggingFace:

- **Sentiment**: `distilbert-base-uncased-finetuned-sst-2-english`
- **Speech-to-Text**: `openai/whisper-tiny`
- **Text-to-Speech**: `microsoft/speecht5_tts`
- **Translation**: `Helsinki-NLP/opus-mt-*`

Set `HUGGINGFACE_TOKEN` in `.env` for private models.

## 📝 License

Part of the CommunityCar platform.

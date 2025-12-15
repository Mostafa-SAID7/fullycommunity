"""Scraping endpoint - Web content extraction."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scraping import scraping_service

router = APIRouter()


class ScrapeRequest(BaseModel):
    url: str
    extract_links: bool = True
    extract_images: bool = True


class TextOnlyRequest(BaseModel):
    url: str


@router.post("/scrape")
async def scrape_url(request: ScrapeRequest):
    """Scrape content from a URL."""
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    try:
        return await scraping_service.scrape_url(
            request.url, request.extract_links, request.extract_images
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape URL: {str(e)}")


@router.post("/text")
async def extract_text(request: TextOnlyRequest):
    """Extract only text content from a URL."""
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    try:
        return await scraping_service.extract_text_only(request.url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

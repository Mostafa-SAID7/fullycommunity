"""Web Scraping Service."""
import httpx
from bs4 import BeautifulSoup
from pydantic import BaseModel
from typing import Optional
from urllib.parse import urljoin, urlparse


class ScrapedContent(BaseModel):
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    text_content: str
    links: list[str]
    images: list[str]
    meta_tags: dict[str, str]


class ScrapingService:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        self.timeout = 30.0
    
    async def scrape_url(self, url: str, extract_links: bool = True, 
                         extract_images: bool = True) -> ScrapedContent:
        """Scrape content from a URL."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(url, headers=self.headers, follow_redirects=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "lxml")
            
            # Remove script and style elements
            for element in soup(["script", "style", "nav", "footer", "header"]):
                element.decompose()
            
            title = self._extract_title(soup)
            description = self._extract_description(soup)
            text_content = self._extract_text(soup)
            links = self._extract_links(soup, url) if extract_links else []
            images = self._extract_images(soup, url) if extract_images else []
            meta_tags = self._extract_meta_tags(soup)
            
            return ScrapedContent(
                url=url,
                title=title,
                description=description,
                text_content=text_content,
                links=links[:50],  # Limit links
                images=images[:20],  # Limit images
                meta_tags=meta_tags
            )
    
    def _extract_title(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract page title."""
        if soup.title:
            return soup.title.string.strip() if soup.title.string else None
        h1 = soup.find("h1")
        return h1.get_text(strip=True) if h1 else None
    
    def _extract_description(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract meta description."""
        meta = soup.find("meta", attrs={"name": "description"})
        if meta and meta.get("content"):
            return meta["content"]
        og_desc = soup.find("meta", attrs={"property": "og:description"})
        if og_desc and og_desc.get("content"):
            return og_desc["content"]
        return None
    
    def _extract_text(self, soup: BeautifulSoup) -> str:
        """Extract main text content."""
        # Try to find main content area
        main = soup.find("main") or soup.find("article") or soup.find("body")
        if main:
            text = main.get_text(separator=" ", strip=True)
            # Clean up whitespace
            text = " ".join(text.split())
            return text[:5000]  # Limit text length
        return ""
    
    def _extract_links(self, soup: BeautifulSoup, base_url: str) -> list[str]:
        """Extract all links from page."""
        links = []
        for a in soup.find_all("a", href=True):
            href = a["href"]
            full_url = urljoin(base_url, href)
            if full_url.startswith(("http://", "https://")):
                links.append(full_url)
        return list(set(links))
    
    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> list[str]:
        """Extract all image URLs."""
        images = []
        for img in soup.find_all("img", src=True):
            src = img["src"]
            full_url = urljoin(base_url, src)
            if full_url.startswith(("http://", "https://")):
                images.append(full_url)
        return list(set(images))
    
    def _extract_meta_tags(self, soup: BeautifulSoup) -> dict[str, str]:
        """Extract meta tags."""
        meta_tags = {}
        for meta in soup.find_all("meta"):
            name = meta.get("name") or meta.get("property")
            content = meta.get("content")
            if name and content:
                meta_tags[name] = content
        return meta_tags
    
    async def extract_text_only(self, url: str) -> str:
        """Extract only text content from URL."""
        result = await self.scrape_url(url, extract_links=False, extract_images=False)
        return result.text_content


scraping_service = ScrapingService()

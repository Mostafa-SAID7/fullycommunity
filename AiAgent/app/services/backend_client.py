"""Backend API Client - Connect to CommunityCar .NET API."""
import httpx
from typing import Optional, Any, TypeVar, Generic
from pydantic import BaseModel
from app.core.config import settings

T = TypeVar("T")


class BackendResponse(BaseModel, Generic[T]):
    """Standard backend response wrapper."""
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None
    errors: Optional[list[str]] = None


class BackendClient:
    """HTTP client for CommunityCar backend API."""
    
    def __init__(self):
        self.base_url = settings.backend_api_url
        self.timeout = 30.0
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=self.timeout,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            )
        return self._client
    
    async def close(self):
        """Close the HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()
    
    def _with_auth(self, headers: dict, token: Optional[str] = None) -> dict:
        """Add authorization header if token provided."""
        if token:
            headers["Authorization"] = f"Bearer {token}"
        return headers
    
    # ═══════════════════════════════════════════════════════════════════════════
    # GENERIC METHODS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def get(
        self, 
        endpoint: str, 
        params: Optional[dict] = None,
        token: Optional[str] = None
    ) -> dict:
        """GET request to backend."""
        client = await self._get_client()
        headers = self._with_auth({}, token)
        response = await client.get(endpoint, params=params, headers=headers)
        response.raise_for_status()
        return response.json()
    
    async def post(
        self, 
        endpoint: str, 
        data: Optional[dict] = None,
        token: Optional[str] = None
    ) -> dict:
        """POST request to backend."""
        client = await self._get_client()
        headers = self._with_auth({}, token)
        response = await client.post(endpoint, json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    
    async def put(
        self, 
        endpoint: str, 
        data: Optional[dict] = None,
        token: Optional[str] = None
    ) -> dict:
        """PUT request to backend."""
        client = await self._get_client()
        headers = self._with_auth({}, token)
        response = await client.put(endpoint, json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    
    async def delete(
        self, 
        endpoint: str,
        token: Optional[str] = None
    ) -> dict:
        """DELETE request to backend."""
        client = await self._get_client()
        headers = self._with_auth({}, token)
        response = await client.delete(endpoint, headers=headers)
        response.raise_for_status()
        return response.json()
    
    # ═══════════════════════════════════════════════════════════════════════════
    # COMMUNITY ENDPOINTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def get_posts(
        self, 
        page: int = 1, 
        page_size: int = 10,
        category_id: Optional[str] = None,
        token: Optional[str] = None
    ) -> dict:
        """Get community posts."""
        params = {"page": page, "pageSize": page_size}
        if category_id:
            params["categoryId"] = category_id
        return await self.get("/api/posts", params, token)
    
    async def get_post(self, post_id: str, token: Optional[str] = None) -> dict:
        """Get single post by ID."""
        return await self.get(f"/api/posts/{post_id}", token=token)
    
    async def get_events(
        self, 
        page: int = 1, 
        page_size: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Get community events."""
        params = {"page": page, "pageSize": page_size}
        return await self.get("/api/events", params, token)
    
    async def get_groups(
        self, 
        page: int = 1, 
        page_size: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Get community groups."""
        params = {"page": page, "pageSize": page_size}
        return await self.get("/api/groups", params, token)
    
    async def get_guides(
        self, 
        page: int = 1, 
        page_size: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Get how-to guides."""
        params = {"page": page, "pageSize": page_size}
        return await self.get("/api/guides", params, token)
    
    async def get_questions(
        self, 
        page: int = 1, 
        page_size: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Get Q&A questions."""
        params = {"page": page, "pageSize": page_size}
        return await self.get("/api/questions", params, token)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MARKETPLACE ENDPOINTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def get_products(
        self, 
        page: int = 1, 
        page_size: int = 10,
        category: Optional[str] = None,
        token: Optional[str] = None
    ) -> dict:
        """Get marketplace products."""
        params = {"page": page, "pageSize": page_size}
        if category:
            params["category"] = category
        return await self.get("/api/products", params, token)
    
    async def get_product(self, product_id: str, token: Optional[str] = None) -> dict:
        """Get single product by ID."""
        return await self.get(f"/api/products/{product_id}", token=token)
    
    async def get_auctions(
        self, 
        page: int = 1, 
        page_size: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Get active auctions."""
        params = {"page": page, "pageSize": page_size}
        return await self.get("/api/auctions", params, token)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SERVICES ENDPOINTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def get_service_providers(
        self, 
        service_type: str,
        page: int = 1, 
        page_size: int = 10,
        location: Optional[str] = None,
        token: Optional[str] = None
    ) -> dict:
        """Get service providers by type."""
        params = {"page": page, "pageSize": page_size}
        if location:
            params["location"] = location
        return await self.get(f"/api/services/{service_type}", params, token)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # USER ENDPOINTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def get_user_profile(self, user_id: str, token: Optional[str] = None) -> dict:
        """Get user profile."""
        return await self.get(f"/api/users/{user_id}/profile", token=token)
    
    async def get_user_activity(
        self, 
        user_id: str, 
        page: int = 1,
        page_size: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Get user activity feed."""
        params = {"page": page, "pageSize": page_size}
        return await self.get(f"/api/users/{user_id}/activity", params, token)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SEARCH ENDPOINTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def search(
        self, 
        query: str,
        categories: Optional[list[str]] = None,
        page: int = 1,
        page_size: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Global search."""
        params = {"q": query, "page": page, "pageSize": page_size}
        if categories:
            params["categories"] = ",".join(categories)
        return await self.get("/api/search", params, token)
    
    async def get_trending(
        self, 
        category: Optional[str] = None,
        limit: int = 10,
        token: Optional[str] = None
    ) -> dict:
        """Get trending content."""
        params = {"limit": limit}
        if category:
            params["category"] = category
        return await self.get("/api/trending", params, token)


# Singleton instance
backend_client = BackendClient()

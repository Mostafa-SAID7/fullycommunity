"""Content Generator Service - AI-powered content creation for the community."""
from pydantic import BaseModel
from typing import Optional
import random


class GeneratedContent(BaseModel):
    content_type: str
    title: str
    content: str
    tags: list[str]
    seo_description: Optional[str] = None
    estimated_read_time: Optional[int] = None


class ContentGeneratorService:
    """AI-powered content generation for community platform."""
    
    # Car-related topics
    TOPICS = {
        "maintenance": [
            "oil change", "tire rotation", "brake inspection", "fluid checks",
            "filter replacement", "battery maintenance", "belt inspection"
        ],
        "tips": [
            "fuel efficiency", "winter driving", "summer car care", "road trip prep",
            "parking tips", "car washing", "interior cleaning"
        ],
        "buying": [
            "new vs used", "financing options", "inspection checklist", "negotiation",
            "test drive tips", "warranty options", "insurance selection"
        ],
        "technology": [
            "electric vehicles", "hybrid cars", "autonomous driving", "car apps",
            "dash cams", "GPS systems", "bluetooth connectivity"
        ],
        "safety": [
            "defensive driving", "child safety seats", "emergency kit", "tire safety",
            "night driving", "weather conditions", "road hazards"
        ]
    }
    
    def __init__(self):
        pass
    
    async def generate_post(
        self, 
        topic: str, 
        style: str = "informative",
        length: str = "medium"
    ) -> GeneratedContent:
        """Generate a community post."""
        title = self._generate_title(topic, "post")
        content = self._generate_post_content(topic, style, length)
        tags = self._generate_tags(topic)
        
        word_count = len(content.split())
        read_time = max(1, word_count // 200)
        
        return GeneratedContent(
            content_type="post",
            title=title,
            content=content,
            tags=tags,
            seo_description=content[:160],
            estimated_read_time=read_time
        )
    
    async def generate_guide(
        self, 
        topic: str, 
        difficulty: str = "beginner"
    ) -> GeneratedContent:
        """Generate a how-to guide."""
        title = f"Complete Guide: {topic.title()}"
        content = self._generate_guide_content(topic, difficulty)
        tags = self._generate_tags(topic) + ["guide", "how-to", difficulty]
        
        word_count = len(content.split())
        read_time = max(1, word_count // 200)
        
        return GeneratedContent(
            content_type="guide",
            title=title,
            content=content,
            tags=tags,
            seo_description=f"Learn {topic} with this {difficulty}-friendly guide.",
            estimated_read_time=read_time
        )
    
    async def generate_product_description(
        self, 
        product_name: str, 
        category: str,
        features: list[str]
    ) -> GeneratedContent:
        """Generate a product description for marketplace."""
        title = product_name
        content = self._generate_product_content(product_name, category, features)
        tags = [category.lower()] + [f.lower().split()[0] for f in features[:3]]
        
        return GeneratedContent(
            content_type="product",
            title=title,
            content=content,
            tags=tags,
            seo_description=content[:160]
        )
    
    async def generate_event_description(
        self, 
        event_name: str, 
        event_type: str,
        details: Optional[str] = None
    ) -> GeneratedContent:
        """Generate an event description."""
        title = event_name
        content = self._generate_event_content(event_name, event_type, details)
        tags = [event_type.lower(), "event", "community"]
        
        return GeneratedContent(
            content_type="event",
            title=title,
            content=content,
            tags=tags,
            seo_description=f"Join us for {event_name}!"
        )
    
    async def generate_seo_metadata(
        self, 
        content: str, 
        content_type: str
    ) -> dict:
        """Generate SEO metadata for content."""
        # Extract key phrases
        words = content.lower().split()
        word_freq = {}
        for word in words:
            if len(word) > 4:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        top_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
        keywords = [w for w, _ in top_keywords]
        
        return {
            "meta_title": content[:60] if len(content) > 60 else content,
            "meta_description": content[:160],
            "keywords": keywords,
            "og_type": "article" if content_type in ["post", "guide"] else content_type
        }
    
    async def suggest_titles(self, topic: str, count: int = 5) -> list[str]:
        """Suggest titles for a given topic."""
        templates = [
            f"The Ultimate Guide to {topic.title()}",
            f"Everything You Need to Know About {topic.title()}",
            f"{topic.title()}: Tips and Tricks for Car Owners",
            f"How to Master {topic.title()} Like a Pro",
            f"Top 10 {topic.title()} Mistakes to Avoid",
            f"Why {topic.title()} Matters for Your Car",
            f"A Beginner's Guide to {topic.title()}",
            f"Expert Tips for {topic.title()}",
            f"The Complete {topic.title()} Checklist",
            f"Save Money with These {topic.title()} Tips"
        ]
        
        return random.sample(templates, min(count, len(templates)))
    
    async def improve_content(self, content: str, goal: str = "clarity") -> str:
        """Suggest improvements for existing content."""
        improvements = {
            "clarity": "Consider breaking long sentences into shorter ones. Use bullet points for lists.",
            "engagement": "Add questions to engage readers. Include a call-to-action at the end.",
            "seo": "Include relevant keywords naturally. Add headers to structure the content.",
            "readability": "Use simpler words where possible. Add paragraph breaks for easier reading."
        }
        
        suggestion = improvements.get(goal, improvements["clarity"])
        return f"Improvement suggestions for {goal}:\n\n{suggestion}\n\nOriginal content length: {len(content)} characters"
    
    def _generate_title(self, topic: str, content_type: str) -> str:
        """Generate a title for content."""
        templates = {
            "post": [
                f"Understanding {topic.title()}",
                f"Your Guide to {topic.title()}",
                f"{topic.title()}: What Every Driver Should Know"
            ],
            "guide": [
                f"How to {topic.title()}: A Complete Guide",
                f"Step-by-Step: {topic.title()}",
                f"Master {topic.title()} Today"
            ]
        }
        
        options = templates.get(content_type, templates["post"])
        return random.choice(options)
    
    def _generate_post_content(self, topic: str, style: str, length: str) -> str:
        """Generate post content."""
        intro = f"When it comes to {topic}, many car owners have questions. "
        
        if style == "informative":
            body = f"Here's what you need to know about {topic}. Regular attention to this aspect of car ownership can save you money and keep your vehicle running smoothly. "
        elif style == "casual":
            body = f"Let's talk about {topic}! It's one of those things that can seem complicated, but it's actually pretty straightforward once you understand the basics. "
        else:
            body = f"Understanding {topic} is essential for every car owner. This knowledge will help you make informed decisions about your vehicle. "
        
        conclusion = "Have questions? Drop them in the comments below, and our community will help you out!"
        
        if length == "short":
            return intro + conclusion
        elif length == "long":
            return intro + body + body + conclusion
        return intro + body + conclusion
    
    def _generate_guide_content(self, topic: str, difficulty: str) -> str:
        """Generate guide content."""
        intro = f"# {topic.title()} Guide\n\nThis {difficulty}-level guide will walk you through everything you need to know about {topic}.\n\n"
        
        sections = [
            f"## What is {topic.title()}?\n\nUnderstanding the basics is the first step.\n\n",
            f"## Why It Matters\n\nRegular attention to {topic} can prevent costly repairs.\n\n",
            f"## Step-by-Step Instructions\n\n1. Gather your materials\n2. Prepare your workspace\n3. Follow the procedure\n4. Verify your work\n\n",
            f"## Common Mistakes to Avoid\n\n- Rushing the process\n- Skipping safety steps\n- Using wrong materials\n\n",
            f"## Conclusion\n\nWith this guide, you're ready to tackle {topic} with confidence!"
        ]
        
        return intro + "".join(sections)
    
    def _generate_product_content(self, name: str, category: str, features: list[str]) -> str:
        """Generate product description."""
        intro = f"Introducing the {name} - your solution for {category.lower()} needs.\n\n"
        
        feature_text = "Key Features:\n"
        for feature in features:
            feature_text += f"• {feature}\n"
        
        outro = f"\nPerfect for car enthusiasts who demand quality and reliability."
        
        return intro + feature_text + outro
    
    def _generate_event_content(self, name: str, event_type: str, details: Optional[str]) -> str:
        """Generate event description."""
        intro = f"Join us for {name}!\n\n"
        
        type_desc = {
            "meetup": "Connect with fellow car enthusiasts in your area.",
            "workshop": "Learn hands-on skills from experienced professionals.",
            "show": "See amazing vehicles and meet their owners.",
            "race": "Experience the thrill of motorsports.",
            "sale": "Find great deals on parts and accessories."
        }
        
        body = type_desc.get(event_type.lower(), "A great opportunity for car lovers.")
        
        if details:
            body += f"\n\n{details}"
        
        outro = "\n\nDon't miss out - RSVP today!"
        
        return intro + body + outro
    
    def _generate_tags(self, topic: str) -> list[str]:
        """Generate relevant tags for content."""
        base_tags = ["cars", "automotive", "community"]
        
        # Find matching category
        for category, topics in self.TOPICS.items():
            if any(t in topic.lower() for t in topics):
                base_tags.append(category)
                break
        
        # Add topic-specific tags
        topic_words = topic.lower().split()
        base_tags.extend([w for w in topic_words if len(w) > 3][:3])
        
        return list(set(base_tags))


content_generator_service = ContentGeneratorService()

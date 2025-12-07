# Q&A System - Complete Documentation

## Overview
A comprehensive Stack Overflow-style Q&A system for the CommunityCar platform with questions, answers, comments, voting, bookmarking, and trending features.

## Architecture

### Controllers (API Layer)
Located in `src/CommunityCar.API/Controllers/Community/QA/`

#### 1. **QuestionsController**
**Route:** `/api/community/qa/questions`
**Purpose:** CRUD operations for questions

**Endpoints:**
- `GET /` - List questions with filters (pagination, search, category, tags, status)
- `GET /{id}` - Get question by ID
- `GET /slug/{slug}` - Get question by slug
- `POST /` - Create question (auth required)
- `PUT /{id}` - Update question (auth required, owner only)
- `DELETE /{id}` - Delete question (auth required, owner only)

#### 2. **QuestionInteractionsController**
**Route:** `/api/community/qa/questions`
**Purpose:** Question interactions and related operations

**Endpoints:**
- `GET /user/{userId}` - Get user's questions
- `GET /{id}/related` - Get related questions
- `POST /{id}/close` - Close question (auth required, owner only)
- `POST /{id}/vote` - Vote on question (auth required)
- `POST /{id}/bookmark` - Bookmark question (auth required)
- `DELETE /{id}/bookmark` - Remove bookmark (auth required)
- `GET /bookmarks` - Get user's bookmarks (auth required)
- `GET /categories` - Get all categories

#### 3. **AnswersController**
**Route:** `/api/community/qa`
**Purpose:** Answer operations

**Endpoints:**
- `GET /questions/{questionId}/answers` - Get answers for question
- `POST /questions/{questionId}/answers` - Create answer (auth required)
- `PUT /answers/{id}` - Update answer (auth required, owner only)
- `DELETE /answers/{id}` - Delete answer (auth required, owner only)
- `POST /answers/{id}/accept` - Accept answer (auth required, question owner only)
- `POST /answers/{id}/vote` - Vote on answer (auth required)

#### 4. **AnswerCommentsController**
**Route:** `/api/community/qa/answers`
**Purpose:** Comment operations on answers

**Endpoints:**
- `GET /{answerId}/comments` - Get comments for answer
- `POST /{answerId}/comments` - Add comment (auth required)
- `PUT /comments/{commentId}` - Update comment (auth required, owner only)
- `DELETE /comments/{commentId}` - Delete comment (auth required, owner only)

#### 5. **TrendingQuestionsController**
**Route:** `/api/community/trending-questions`
**Purpose:** Get trending questions

**Endpoints:**
- `GET /` - Get trending questions (count parameter, default 5, max 20)

### Service Layer
Located in `src/CommunityCar.Infrastructure/Services/Community/QA/`

#### 1. **QAService** (Facade)
Main service coordinating all QA operations. Delegates to specialized services.

#### 2. **QuestionQueryService**
Handles all question read operations:
- Get by ID/slug with user-specific data
- Paginated listing with filters
- User questions
- Related questions (by category/tags)
- Trending questions (score-based algorithm)

**Trending Algorithm:**
```
Score = (VoteCount × 2) + (ViewCount ÷ 10)
Only questions from last 30 days
Sorted by score DESC, then CreatedAt DESC
```

#### 3. **QuestionCommandService**
Handles question write operations:
- Create question
- Update question
- Delete question
- Close question

#### 4. **QuestionVotingService**
Handles voting and bookmarking:
- Vote on questions (upvote/downvote)
- Bookmark/unbookmark questions
- Increment view count
- Get user bookmarks

#### 5. **AnswerService**
Handles all answer operations:
- Get answers for question
- Create/update/delete answers
- Accept answer
- Vote on answers
- Comment operations (CRUD)

#### 6. **QACategoryService**
Handles category operations:
- Get all categories

### Domain Entities
Located in `src/CommunityCar.Domain/Entities/Community/QA/`

#### Question
```csharp
- Id, Title, Content, Slug
- AuthorId, CategoryId
- Status (Open, Answered, Closed)
- VoteCount, AnswerCount, ViewCount, BookmarkCount
- AcceptedAnswerId
- BountyPoints, BountyExpiresAt
- IsClosed, CloseReason, ClosedAt, ClosedById
- Tags (collection)
- Votes, Bookmarks, Answers (navigation)
```

#### Answer
```csharp
- Id, QuestionId, AuthorId, Content
- VoteCount
- IsAccepted, AcceptedAt
- IsEdited, EditedAt
- Votes, Comments (navigation)
```

#### AnswerComment
```csharp
- Id, AnswerId, AuthorId, Content
- CreatedAt
```

#### QuestionTag
```csharp
- QuestionId, Tag
```

#### QuestionVote / AnswerVote
```csharp
- Id, QuestionId/AnswerId, UserId
- Type (Upvote = 1, Downvote = -1)
```

#### QuestionBookmark
```csharp
- Id, QuestionId, UserId
- CreatedAt
```

#### QuestionCategory
```csharp
- Id, Name, Slug, Description
- QuestionCount
```

### DTOs

#### Request DTOs
Located in `src/CommunityCar.Application/DTOs/Requests/Community/QA/`

- **CreateQuestionRequest** - Title, Content, CategoryId, Tags
- **UpdateQuestionRequest** - Title, Content, CategoryId, Tags
- **CreateAnswerRequest** - Content
- **UpdateAnswerRequest** - Content
- **CreateCommentRequest** - Content (max 500 chars)
- **UpdateCommentRequest** - Content (max 500 chars)
- **QuestionFilter** - Status, CategoryId, SearchTerm, Tag, HasAcceptedAnswer, HasBounty, SortBy
- **VoteRequest** - Type (string: "up" or "down")

#### Response DTOs
Located in `src/CommunityCar.Application/DTOs/Response/Community/QA/`

- **QuestionDto** - Full question details with user-specific data
- **QuestionListDto** - Summary for lists
- **TrendingQuestionDto** - Trending question with excerpt
- **AnswerDto** - Full answer with comments
- **AnswerCommentDto** - Comment details
- **QuestionCategoryDto** - Category info
- **QuestionAuthorDto** - Author info

### Mappers
Located in `src/CommunityCar.Application/Common/Mappers/Community/QAMapper.cs`

Static mapper methods:
- `ToDto()` - Question to QuestionDto
- `ToListDto()` - Question to QuestionListDto
- `ToTrendingDto()` - Question to TrendingQuestionDto
- `ToAnswerDto()` - Answer to AnswerDto
- `ToAnswerCommentDto()` - AnswerComment to AnswerCommentDto
- `ToCategoryDto()` - QuestionCategory to QuestionCategoryDto

## Features

### 1. Questions
- ✅ Create, read, update, delete
- ✅ Search by title/content
- ✅ Filter by category, tags, status
- ✅ Sort by newest, votes, unanswered, active, views
- ✅ Slug-based URLs
- ✅ View count tracking
- ✅ Close with reason
- ✅ Bounty system (points & expiration)

### 2. Answers
- ✅ Create, read, update, delete
- ✅ Accept answer (question owner only)
- ✅ Edit tracking (IsEdited, EditedAt)
- ✅ Sorted by: accepted first, then votes, then date

### 3. Comments
- ✅ Add comments to answers
- ✅ Update/delete own comments
- ✅ Max 500 characters
- ✅ Displayed in chronological order

### 4. Voting
- ✅ Upvote/downvote questions
- ✅ Upvote/downvote answers
- ✅ Toggle vote (click again to remove)
- ✅ Change vote (upvote → downvote or vice versa)
- ✅ Vote count updates in real-time

### 5. Bookmarking
- ✅ Bookmark questions
- ✅ Remove bookmarks
- ✅ View user's bookmarks (paginated)
- ✅ Bookmark count tracking

### 6. Trending
- ✅ Smart trending algorithm
- ✅ Based on votes, views, and recency
- ✅ Only recent questions (last 30 days)
- ✅ Configurable count (1-20)

### 7. Related Questions
- ✅ Based on category and tags
- ✅ Excludes current question
- ✅ Only open questions
- ✅ Sorted by votes and views

### 8. Categories
- ✅ Predefined categories
- ✅ Question count per category
- ✅ Filter questions by category

### 9. Tags
- ✅ Multiple tags per question
- ✅ Filter questions by tag
- ✅ Tag-based related questions

## Security & Authorization

### Authentication Required
- Create/update/delete questions
- Create/update/delete answers
- Add/update/delete comments
- Vote on questions/answers
- Bookmark questions
- Close questions
- Accept answers

### Authorization Rules
- **Update/Delete Question:** Owner only
- **Update/Delete Answer:** Owner only
- **Update/Delete Comment:** Owner only
- **Close Question:** Owner only
- **Accept Answer:** Question owner only

### Validation
- All inputs validated with Data Annotations
- ModelState checked in controllers
- Business rules enforced in services
- Proper error messages (English + Arabic)

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message in English",
  "messageAr": "رسالة النجاح بالعربية"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message in English",
  "messageAr": "رسالة الخطأ بالعربية",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Localization Keys

All messages use the localization service with keys like:
- `QA.Success.QuestionCreated`
- `QA.Success.AnswerAccepted`
- `QA.Success.VoteRecorded`
- `QA.Errors.QuestionNotFound`
- `QA.Errors.Unauthorized`
- `QA.Errors.NotQuestionOwner`

## Database Schema

### Tables
- `Questions` - Main questions table
- `Answers` - Answers to questions
- `AnswerComments` - Comments on answers
- `QuestionTags` - Question-tag relationships
- `QuestionVotes` - User votes on questions
- `AnswerVotes` - User votes on answers
- `QuestionBookmarks` - User bookmarks
- `QuestionCategories` - Predefined categories

### Indexes
- Questions: AuthorId, CategoryId, Status, CreatedAt, Slug
- Answers: QuestionId, AuthorId, IsAccepted
- Votes: QuestionId/AnswerId + UserId (unique)
- Bookmarks: QuestionId + UserId (unique)

## Performance Optimizations

### Query Optimizations
1. **Eager Loading:** Include related entities in single query
2. **Projection:** Select only needed fields for lists
3. **Pagination:** All lists are paginated
4. **Indexes:** Proper database indexes on foreign keys
5. **Caching:** Ready for Redis caching layer

### Trending Algorithm
- Only queries last 30 days
- Uses calculated score for sorting
- Limited result set (max 20)

### Related Questions
- Efficient category + tag matching
- Limited result set (default 5)
- Sorted by engagement metrics

## Testing Recommendations

### Unit Tests
- Service layer methods
- Mapper functions
- Business logic validation

### Integration Tests
- Controller endpoints
- Database operations
- Authorization rules

### Test Scenarios
1. Create question → Add answer → Accept answer
2. Vote on question/answer → Change vote → Remove vote
3. Bookmark question → View bookmarks → Remove bookmark
4. Search questions with various filters
5. Get trending questions
6. Add comments to answer
7. Close question with reason
8. Update question/answer (owner only)
9. Unauthorized access attempts

## API Examples

### Create Question
```http
POST /api/community/qa/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "How to change engine oil?",
  "content": "I need help changing the oil in my 2020 Toyota Camry...",
  "categoryId": "guid-here",
  "tags": ["maintenance", "oil-change", "toyota"]
}
```

### Vote on Question
```http
POST /api/community/qa/questions/{id}/vote
Authorization: Bearer {token}
Content-Type: application/json

1  // VoteType.Upvote
```

### Get Trending Questions
```http
GET /api/community/trending-questions?count=10
```

### Add Comment to Answer
```http
POST /api/community/qa/answers/{answerId}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great answer! This helped me a lot."
}
```

## Future Enhancements

### Potential Features
1. **Question Comments** - Comments directly on questions
2. **Answer Comments Voting** - Upvote helpful comments
3. **Question Following** - Get notifications for updates
4. **Reputation System** - User reputation based on votes
5. **Badges & Achievements** - Gamification
6. **Question Reporting** - Flag inappropriate content
7. **Duplicate Detection** - Suggest similar questions
8. **Rich Text Editor** - Markdown support
9. **Image Uploads** - Attach images to questions/answers
10. **Question History** - Track edits and revisions
11. **Answer Ordering** - Custom sort options
12. **Question Templates** - Pre-filled question formats
13. **Expert Answers** - Verified expert badge
14. **Question Bounty** - Reward system for answers
15. **Email Notifications** - Notify on answers/comments

## Maintenance

### Regular Tasks
- Monitor trending algorithm performance
- Review and update categories
- Clean up old closed questions
- Archive inactive questions
- Update localization strings
- Review and moderate content

### Monitoring
- Track question creation rate
- Monitor answer acceptance rate
- Analyze voting patterns
- Review trending accuracy
- Check search performance

## Conclusion

The Q&A system is fully functional with:
- ✅ 5 specialized controllers
- ✅ 6 service classes
- ✅ 8 domain entities
- ✅ Complete CRUD operations
- ✅ Voting & bookmarking
- ✅ Comments system
- ✅ Trending algorithm
- ✅ Related questions
- ✅ Full authorization
- ✅ Bilingual support
- ✅ Optimized queries
- ✅ Clean architecture

The system is production-ready and follows best practices for scalability, maintainability, and security.

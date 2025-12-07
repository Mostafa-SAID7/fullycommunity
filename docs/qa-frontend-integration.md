# Q&A Frontend Integration Guide

## Overview
This document describes the Angular frontend integration with the refactored Q&A backend API system.

## Service Architecture

### Main Service: `qa.service.ts`
Location: `ClientApp/projects/main/src/app/core/services/community/qa.service.ts`

The service is organized into 5 sections matching the backend controllers:

#### 1. Questions Controller - CRUD Operations
- `getQuestions()` - Paginated list with filters
- `getQuestion()` - Get by ID
- `getQuestionBySlug()` - Get by slug
- `createQuestion()` - Create new question
- `updateQuestion()` - Update existing question
- `deleteQuestion()` - Delete question

#### 2. Question Interactions Controller
- `getUserQuestions()` - Get user's questions
- `getRelatedQuestions()` - Get related questions
- `closeQuestion()` - Close question with reason
- `voteQuestion()` - Vote on question (1 or -1)
- `bookmarkQuestion()` - Bookmark question
- `unbookmarkQuestion()` - Remove bookmark
- `getBookmarks()` - Get user's bookmarks
- `getCategories()` - Get all categories

#### 3. Answers Controller
- `getAnswers()` - Get answers for question
- `createAnswer()` - Create new answer
- `updateAnswer()` - Update answer
- `deleteAnswer()` - Delete answer
- `acceptAnswer()` - Accept answer (question owner only)
- `voteAnswer()` - Vote on answer (1 or -1)

#### 4. Answer Comments Controller
- `getAnswerComments()` - Get comments for answer
- `createAnswerComment()` - Add comment to answer
- `updateAnswerComment()` - Update comment
- `deleteAnswerComment()` - Delete comment

#### 5. Trending Questions Controller
- `getTrendingQuestions()` - Get trending questions (count: 1-20)

## TypeScript Interfaces

### Response DTOs
```typescript
QuestionDto - Full question details
QuestionListDto - Summary for lists
TrendingQuestionDto - Trending question with excerpt
AnswerDto - Full answer with comments
AnswerCommentDto - Comment details
QuestionAuthor - Author information
QuestionCategory - Category information
```

### Request DTOs
```typescript
CreateQuestionRequest - { title, content, categoryId?, tags? }
UpdateQuestionRequest - { title?, content?, categoryId?, tags? }
CreateAnswerRequest - { content }
UpdateAnswerRequest - { content }
CreateCommentRequest - { content } // Max 500 chars
UpdateCommentRequest - { content } // Max 500 chars
QuestionFilter - { status?, categoryId?, searchTerm?, tag?, hasAcceptedAnswer?, hasBounty?, sortBy? }
```

## Key Changes from Old Service

### 1. Separate Question and Answers
**Old:** `getQuestionById()` returned question with embedded answers
**New:** 
- `getQuestion(id)` returns question only
- `getAnswers(questionId)` returns answers separately

### 2. Vote Type Changed
**Old:** `voteQuestion(id, type: 'Up' | 'Down')`
**New:** `voteQuestion(id, voteType: 1 | -1)` // 1 = upvote, -1 = downvote

### 3. Author Structure
**Old:** `{ id, firstName, lastName, name, avatar, reputation, isVerified }`
**New:** `{ id, firstName, lastName, avatarUrl, userType }`

### 4. Category Structure
**Old:** `{ id, name, slug, description?, iconUrl?, questionCount }`
**New:** `{ id, name, slug, description?, questionCount }` // No iconUrl

### 5. New Features
- Answer comments (full CRUD)
- Close question with reason
- Trending questions with smart algorithm
- Related questions by category and tags
- User-specific data (isVotedUp, isVotedDown, isBookmarked)

## Component Updates

### qa.component.ts
- Updated to use `QuestionListDto` instead of `QuestionListItem`
- Enhanced filter handling for category and bounty
- Proper type casting for filter parameters

### question-detail.component.ts
- Separated question and answers loading
- Updated to use `QuestionDto` and `AnswerDto`
- Added `getAuthorName()` helper method
- Display answer edit status and comments count

### question-list.component.ts
- Updated to use `QuestionListDto`
- Fixed author display to use `firstName` and `lastName`
- Fixed avatar to use `avatarUrl`

### trending-questions.service.ts
- Added count parameter (1-20, default 5)
- Changed `content` to `excerpt` in interface

## API Endpoints Reference

### Questions
```
GET    /api/community/qa/questions
GET    /api/community/qa/questions/{id}
GET    /api/community/qa/questions/slug/{slug}
POST   /api/community/qa/questions
PUT    /api/community/qa/questions/{id}
DELETE /api/community/qa/questions/{id}
```

### Question Interactions
```
GET    /api/community/qa/questions/user/{userId}
GET    /api/community/qa/questions/{id}/related
POST   /api/community/qa/questions/{id}/close
POST   /api/community/qa/questions/{id}/vote
POST   /api/community/qa/questions/{id}/bookmark
DELETE /api/community/qa/questions/{id}/bookmark
GET    /api/community/qa/questions/bookmarks
GET    /api/community/qa/questions/categories
```

### Answers
```
GET    /api/community/qa/questions/{questionId}/answers
POST   /api/community/qa/questions/{questionId}/answers
PUT    /api/community/qa/answers/{id}
DELETE /api/community/qa/answers/{id}
POST   /api/community/qa/answers/{id}/accept
POST   /api/community/qa/answers/{id}/vote
```

### Answer Comments
```
GET    /api/community/qa/answers/{answerId}/comments
POST   /api/community/qa/answers/{answerId}/comments
PUT    /api/community/qa/answers/comments/{commentId}
DELETE /api/community/qa/answers/comments/{commentId}
```

### Trending
```
GET    /api/community/trending-questions?count={1-20}
```

## Usage Examples

### Create Question
```typescript
this.qaService.createQuestion({
  title: 'How to change engine oil?',
  content: 'I need help changing the oil in my 2020 Toyota Camry...',
  categoryId: 'guid-here',
  tags: ['maintenance', 'oil-change', 'toyota']
}).subscribe({
  next: (question) => console.log('Created:', question),
  error: (err) => console.error('Error:', err)
});
```

### Vote on Question
```typescript
// Upvote
this.qaService.voteQuestion(questionId, 1).subscribe({
  next: (result) => console.log('New vote count:', result.voteCount)
});

// Downvote
this.qaService.voteQuestion(questionId, -1).subscribe({
  next: (result) => console.log('New vote count:', result.voteCount)
});
```

### Add Comment to Answer
```typescript
this.qaService.createAnswerComment(answerId, {
  content: 'Great answer! This helped me a lot.'
}).subscribe({
  next: (comment) => console.log('Comment added:', comment)
});
```

### Get Trending Questions
```typescript
this.qaService.getTrendingQuestions(10).subscribe({
  next: (questions) => console.log('Trending:', questions)
});
```

### Filter Questions
```typescript
this.qaService.getQuestions({
  status: 'Open',
  categoryId: 'guid-here',
  searchTerm: 'oil change',
  tag: 'maintenance',
  sortBy: 'votes',
  hasAcceptedAnswer: false
}, 1, 20).subscribe({
  next: (result) => {
    console.log('Questions:', result.items);
    console.log('Total:', result.totalCount);
  }
});
```

## Helper Methods

The service includes helper methods for common operations:

```typescript
// Get full author name
getAuthorName(author: QuestionAuthor): string

// Check if question has bounty
hasBounty(question: QuestionDto | QuestionListDto): boolean

// Check if bounty is expired
isBountyExpired(question: QuestionDto): boolean

// Get status badge color
getStatusColor(status: QuestionStatus): string
```

## Migration Checklist

- [x] Refactor qa.service.ts with new API structure
- [x] Update qa.component.ts to use new DTOs
- [x] Update question-detail.component.ts for separate answers
- [x] Update question-list.component.ts for new author structure
- [x] Update trending-questions.service.ts with count parameter
- [ ] Add answer comments UI components
- [ ] Add vote buttons with proper state management
- [ ] Add bookmark functionality UI
- [ ] Add close question dialog
- [ ] Add related questions sidebar
- [ ] Add category filter dropdown
- [ ] Test all CRUD operations
- [ ] Test voting functionality
- [ ] Test comment system
- [ ] Add error handling and loading states
- [ ] Add success/error notifications

## Testing Recommendations

1. **Question CRUD**
   - Create question with tags and category
   - Update question title and content
   - Delete question (owner only)

2. **Answer Operations**
   - Add answer to question
   - Edit answer (owner only)
   - Accept answer (question owner only)
   - Vote on answers

3. **Comments**
   - Add comment to answer
   - Edit comment (owner only)
   - Delete comment (owner only)
   - Display comments chronologically

4. **Voting**
   - Upvote question/answer
   - Downvote question/answer
   - Toggle vote (remove)
   - Change vote (up to down or vice versa)

5. **Bookmarks**
   - Bookmark question
   - View bookmarks list
   - Remove bookmark

6. **Filters & Search**
   - Search by keyword
   - Filter by category
   - Filter by tag
   - Filter by status
   - Sort by different criteria

7. **Trending**
   - Display trending questions
   - Verify trending algorithm (recent + popular)

## Notes

- All authenticated endpoints require Bearer token in Authorization header
- Vote type is now numeric: 1 for upvote, -1 for downvote
- Comments have 500 character limit
- Trending questions limited to 1-20 count
- Author structure simplified (no reputation or isVerified in Q&A context)
- Question and answers are loaded separately for better performance
- All responses follow standard format with success/error messages in English and Arabic

## Future Enhancements

- Real-time updates with SignalR
- Rich text editor for questions/answers
- Image upload support
- Question templates
- Advanced search with Elasticsearch
- Reputation system
- Badges and achievements
- Email notifications
- Question following
- Duplicate detection

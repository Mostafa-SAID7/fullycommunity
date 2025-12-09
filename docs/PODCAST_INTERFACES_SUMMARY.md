# Podcast Interfaces Summary

## Overview
Complete TypeScript interfaces and services for the Podcasts platform feature, 100% aligned with backend C# DTOs.

## Structure
```
podcasts/
├── podcast-show.interface.ts          # Main podcast show entity
├── podcast-episode.interface.ts       # Episode entity with chapters, guests, transcripts
├── index.ts                           # Barrel export
├── enums/
│   ├── podcast-enums.ts              # All 14 enums
│   └── index.ts
├── components/
│   ├── podcast-list.interface.ts     # List items for shows & episodes
│   ├── podcast-filter.interface.ts   # Search/filter requests
│   ├── podcast-category.interface.ts # Categories
│   ├── podcast-subscription.interface.ts # Subscription settings
│   ├── podcast-rating.interface.ts   # Ratings & reviews
│   ├── podcast-comment.interface.ts  # Comments with replies
│   ├── podcast-reaction.interface.ts # Reaction summary
│   ├── podcast-playlist.interface.ts # User playlists
│   ├── listening-history.interface.ts # History & queue
│   ├── live-recording.interface.ts   # Live recordings & chat
│   ├── podcast-analytics.interface.ts # Analytics data
│   ├── podcast-share.interface.ts    # Share tracking
│   └── index.ts
└── requests/
    ├── create-podcast-request.interface.ts
    ├── update-podcast-request.interface.ts
    ├── create-episode-request.interface.ts
    ├── update-episode-request.interface.ts
    ├── create-host-request.interface.ts
    ├── update-host-request.interface.ts
    ├── episode-upload-request.interface.ts
    ├── podcast-rating-request.interface.ts
    ├── podcast-comment-request.interface.ts
    ├── podcast-playlist-request.interface.ts
    ├── live-recording-request.interface.ts
    ├── episode-playback-request.interface.ts
    ├── episode-share-request.interface.ts
    └── index.ts
```

## Services
```
services/podcasts/
├── podcast-shows.service.ts          # Show CRUD, search, trending, categories
├── podcast-episodes.service.ts       # Episode CRUD, upload, playback tracking
├── podcast-engagement.service.ts     # Comments, ratings, reactions, shares
├── podcast-library.service.ts        # Subscriptions, history, queue, playlists
├── podcast-analytics.service.ts      # Analytics & demographics
├── live-recording.service.ts         # Live recordings, chat, tips
└── index.ts
```

## Main Entities

### PodcastShow (80+ properties)
- **Basic Info**: title, description, summary, slug
- **Media**: coverImageUrl, bannerImageUrl, trailerUrl
- **Type & Status**: type, status, visibility, explicitContent
- **Categorization**: category, tags, language
- **Publishing**: publishedAt, rssFeedUrl, websiteUrl
- **Stats**: episodeCount, subscriberCount, totalPlays, totalDownloads, averageRating
- **Settings**: allowComments, allowDownloads, showPlayCount
- **Monetization**: monetizationStatus, hasAds, isSponsoredContent, totalEarnings
- **Social Links**: applePodcastsUrl, spotifyUrl, googlePodcastsUrl, youtubeUrl
- **SEO**: metaTitle, metaDescription
- **Copyright**: copyright, author, ownerEmail
- **Hosts**: Array of PodcastHost
- **User Actions**: UserActionFlags

### PodcastEpisode (60+ properties)
- **Basic Info**: title, description, summary, showNotes, slug
- **Episode Number**: seasonNumber, episodeNumber
- **Media**: audioUrl, videoUrl, thumbnailUrl, duration, fileSizeBytes
- **Type & Status**: type, status, explicitContent
- **Publishing**: scheduledPublishAt, publishedAt
- **Stats**: playCount, uniqueListeners, downloadCount, likeCount, commentCount, shareCount
- **Settings**: allowComments, allowDownloads
- **Chapters**: Array of EpisodeChapter with timestamps
- **Transcript**: EpisodeTranscript with segments
- **Processing**: isProcessed, processingError, processedAt
- **Guests**: Array of EpisodeGuest
- **Links**: Array of EpisodeLink

## Enums (14 total)

### Core Enums
1. **PodcastType**: Audio, Video, AudioVideo
2. **PodcastStatus**: Draft, Processing, Published, Scheduled, Unlisted, Private, Removed
3. **PodcastVisibility**: Public, Unlisted, Private, SubscribersOnly
4. **EpisodeType**: Full, Trailer, Bonus, Interview, QA, Recap, Highlight, BehindTheScenes
5. **EpisodeStatus**: Draft, Processing, Published, Scheduled, Removed

### Category & Content
6. **PodcastCategory**: Automotive, Technology, News, Comedy, Education, Sports, Business, Lifestyle, Entertainment, CarReviews, Maintenance, Racing, Electric, Classic, Tuning, Other
7. **ExplicitContent**: Clean, Explicit

### Engagement
8. **PodcastReactionType**: Like, Love, Insightful, Helpful, Fire

### Monetization
9. **PodcastMonetizationStatus**: NotEligible, Pending, Enabled, Disabled, Suspended
10. **PodcastAdType**: PreRoll, MidRoll, PostRoll, Sponsored

### Live Recording
11. **LiveRecordingStatus**: Scheduled, Starting, Live, Paused, Ended, Cancelled, Processing

### Sharing & Other
12. **SharePlatform**: InApp, CopyLink, Twitter, Facebook, Instagram, WhatsApp, Telegram, Email, SMS, Other
13. **MentionType**: Guest, Host, Reference, Shoutout, Sponsor
14. **SponsorshipType**: PerEpisode, Monthly, Quarterly, Annual, OneTime

## Component Interfaces

### Lists & Filters
- **PodcastShowListItem**: Lightweight show for lists/grids
- **EpisodeListItem**: Lightweight episode for lists
- **PodcastSearchRequest**: Search/filter for shows
- **EpisodeSearchRequest**: Search/filter for episodes

### Engagement
- **EpisodeComment**: Comments with replies, timestamps, likes
- **PodcastRating**: Ratings with reviews and helpful votes
- **PodcastRatingSummary**: Star distribution and averages
- **EpisodeReactionSummary**: Reaction counts by type

### Library Management
- **ListeningHistory**: Progress tracking per episode
- **QueueItem**: Playback queue with positions
- **PodcastPlaylist**: User-created playlists
- **PlaylistItem**: Episodes in playlists

### Live Features
- **LiveRecording**: Live recording sessions
- **LiveRecordingListItem**: Lightweight live recording
- **StreamCredentials**: RTMP streaming credentials
- **LiveChatMessage**: Real-time chat messages
- **LiveTip**: Virtual tips during live sessions

### Analytics
- **PodcastAnalyticsSummary**: Overall podcast metrics
- **PodcastDailyAnalytics**: Daily breakdown
- **PodcastDemographics**: Age, gender, country, device data
- **TopEpisode**: Best performing episodes
- **TrafficSources**: Where listeners come from
- **EpisodeAnalyticsSummary**: Per-episode metrics
- **EpisodeDailyAnalytics**: Episode daily breakdown
- **RetentionData**: Listen-through rates and drop-off points
- **RevenueAnalytics**: Monetization breakdown

## Service Methods

### PodcastShowsService (15 methods)
- `getById()`, `getBySlug()` - Get show details
- `search()` - Search/filter shows
- `getTrending()`, `getFeatured()` - Discovery
- `getByCategory()` - Category browsing
- `getMyPodcasts()` - User's shows
- `create()`, `update()`, `delete()` - CRUD operations
- `getCategories()` - All categories
- `addHost()`, `updateHost()`, `removeHost()` - Host management
- `getRelated()` - Related shows

### PodcastEpisodesService (18 methods)
- `getById()`, `getBySlug()` - Get episode details
- `getByPodcast()` - Episodes for a show
- `getLatest()`, `getTrending()` - Discovery
- `create()`, `update()`, `delete()` - CRUD operations
- `getUploadUrl()`, `completeUpload()` - Upload flow
- `schedule()`, `publish()` - Publishing
- `recordPlay()`, `trackProgress()` - Playback tracking
- `addChapter()`, `updateChapter()`, `deleteChapter()` - Chapter management
- `getRelated()` - Related episodes

### PodcastEngagementService (20 methods)
- **Comments**: `getComments()`, `createComment()`, `updateComment()`, `deleteComment()`, `likeComment()`, `unlikeComment()`, `pinComment()`, `unpinComment()`
- **Reactions**: `getReactionSummary()`, `addReaction()`, `removeReaction()`
- **Ratings**: `getRatingSummary()`, `getRatings()`, `createRating()`, `updateRating()`, `deleteRating()`, `markRatingHelpful()`, `unmarkRatingHelpful()`
- **Shares**: `shareEpisode()`, `getShareHistory()`

### PodcastLibraryService (22 methods)
- **Subscriptions**: `getSubscriptions()`, `subscribe()`, `unsubscribe()`, `updateSubscription()`
- **History**: `getHistory()`, `clearHistory()`, `removeFromHistory()`
- **Queue**: `getQueue()`, `addToQueue()`, `removeFromQueue()`, `reorderQueue()`, `clearQueue()`
- **Playlists**: `getPlaylists()`, `getPlaylistById()`, `createPlaylist()`, `updatePlaylist()`, `deletePlaylist()`, `addToPlaylist()`, `removeFromPlaylist()`, `reorderPlaylist()`
- **Favorites**: `getFavorites()`, `addToFavorites()`, `removeFromFavorites()`

### PodcastAnalyticsService (10 methods)
- **Podcast Analytics**: `getPodcastSummary()`, `getPodcastDaily()`, `getPodcastDemographics()`, `getTopEpisodes()`, `getTrafficSources()`
- **Episode Analytics**: `getEpisodeSummary()`, `getEpisodeDaily()`, `getEpisodeDemographics()`, `getRetentionData()`
- **Revenue**: `getRevenueAnalytics()`

### LiveRecordingService (17 methods)
- **Recording Management**: `getById()`, `getByPodcast()`, `getCurrentlyLive()`, `getUpcoming()`, `schedule()`, `update()`, `cancel()`, `start()`, `end()`, `getStreamCredentials()`
- **Chat**: `getChatMessages()`, `sendChatMessage()`, `deleteChatMessage()`, `pinChatMessage()`
- **Tips**: `getTips()`, `sendTip()`

## Total Count
- **Interface Files**: 32
- **Service Files**: 6
- **Total Methods**: 102+
- **Enums**: 14
- **Zero Diagnostics Errors**: ✅

## Key Features

### 1. Podcast Shows
- Create and manage podcast series
- Multiple hosts support
- RSS feed integration
- Social platform links
- SEO optimization
- Monetization tracking

### 2. Episodes
- Audio and video support
- Chapters with timestamps
- Transcripts (auto-generated or manual)
- Guest information
- Resource links
- Scheduled publishing
- Upload flow with progress

### 3. Engagement
- Comments with timestamps
- 5 reaction types (Like, Love, Insightful, Helpful, Fire)
- Star ratings with reviews
- Helpful vote system
- Share tracking across platforms

### 4. Library Management
- Subscription management with notifications
- Listening history with progress
- Playback queue
- Custom playlists
- Favorites

### 5. Live Recordings
- Schedule live sessions
- RTMP streaming
- Real-time chat
- Virtual tips/donations
- Convert to episodes
- Subscriber-only streams

### 6. Analytics
- Subscriber growth tracking
- Play counts and unique listeners
- Completion rates
- Retention curves and drop-off points
- Demographics (age, gender, location, device)
- Traffic sources
- Revenue breakdown
- Top episodes

## Backend Alignment
All interfaces are 100% aligned with C# DTOs:
- `PodcastShowDtos.cs`
- `EpisodeDtos.cs`
- `EngagementDtos.cs`
- `LiveRecordingDtos.cs`
- `AnalyticsDtos.cs`

## TypeScript Conventions
- ✅ camelCase for all properties
- ✅ `| null` for nullable types (not optional `?`)
- ✅ Separate files for each interface/enum
- ✅ Barrel exports in each folder
- ✅ Enum values match backend exactly
- ✅ TimeSpan represented as `string`
- ✅ Guid represented as `string`
- ✅ DateTime represented as `string` (ISO 8601)

## Usage Example
```typescript
import { 
  PodcastShow, 
  PodcastEpisode,
  PodcastCategory,
  EpisodeType 
} from '@core/interfaces/podcasts';
import { 
  PodcastShowsService,
  PodcastEpisodesService 
} from '@core/services/podcasts';

// Search podcasts
const shows = await podcastShowsService.search({
  query: 'automotive',
  category: PodcastCategory.Automotive,
  sortBy: 'trending',
  page: 1,
  pageSize: 20
}).toPromise();

// Get episodes
const episodes = await podcastEpisodesService.getByPodcast(showId, {
  type: EpisodeType.Full,
  seasonNumber: 1,
  sortBy: 'newest',
  page: 1,
  pageSize: 20
}).toPromise();
```

## Status
✅ **COMPLETE** - All interfaces, requests, and services implemented with zero diagnostics errors.

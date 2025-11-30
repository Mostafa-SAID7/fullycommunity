namespace CommunityCar.Application.Common.Interfaces.Messaging;

/// <summary>
/// Chat service for direct messages and group chats
/// </summary>
public interface IChatService
{
    // Conversations
    Task<ConversationDto> GetOrCreateDirectConversationAsync(Guid userId, Guid otherUserId, CancellationToken ct = default);
    Task<ConversationDto> CreateGroupConversationAsync(Guid userId, string name, List<Guid> memberIds, CancellationToken ct = default);
    Task<List<ConversationDto>> GetUserConversationsAsync(Guid userId, int page = 1, int pageSize = 20, CancellationToken ct = default);
    Task<ConversationDto?> GetConversationAsync(Guid conversationId, Guid userId, CancellationToken ct = default);
    
    // Messages
    Task<MessageDto> SendMessageAsync(Guid conversationId, Guid senderId, string content, MessageType type = MessageType.Text, string? attachmentUrl = null, CancellationToken ct = default);
    Task<List<MessageDto>> GetMessagesAsync(Guid conversationId, Guid userId, int page = 1, int pageSize = 50, CancellationToken ct = default);
    Task<bool> DeleteMessageAsync(Guid messageId, Guid userId, CancellationToken ct = default);
    Task<bool> EditMessageAsync(Guid messageId, Guid userId, string newContent, CancellationToken ct = default);
    
    // Read receipts
    Task MarkAsReadAsync(Guid conversationId, Guid userId, CancellationToken ct = default);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default);
    
    // Typing indicators
    Task SetTypingAsync(Guid conversationId, Guid userId, bool isTyping, CancellationToken ct = default);
    
    // Group management
    Task<bool> AddMemberAsync(Guid conversationId, Guid adminId, Guid newMemberId, CancellationToken ct = default);
    Task<bool> RemoveMemberAsync(Guid conversationId, Guid adminId, Guid memberId, CancellationToken ct = default);
    Task<bool> LeaveConversationAsync(Guid conversationId, Guid userId, CancellationToken ct = default);
    Task<bool> UpdateConversationAsync(Guid conversationId, Guid userId, string? name, string? imageUrl, CancellationToken ct = default);
}

public class ConversationDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public ConversationType Type { get; set; }
    public List<ConversationMemberDto> Members { get; set; } = [];
    public MessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ConversationMemberDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsAdmin { get; set; }
    public bool IsOnline { get; set; }
    public DateTime? LastSeenAt { get; set; }
}

public class MessageDto
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string? SenderAvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public MessageType Type { get; set; }
    public string? AttachmentUrl { get; set; }
    public bool IsEdited { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EditedAt { get; set; }
    public List<Guid> ReadBy { get; set; } = [];
}

public enum ConversationType { Direct, Group }
public enum MessageType { Text, Image, Video, Audio, File, Location, Sticker }

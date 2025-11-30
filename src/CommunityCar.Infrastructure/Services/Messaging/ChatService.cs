using CommunityCar.Application.Common.Interfaces.Messaging;
using CommunityCar.Domain.Entities.Messaging;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using DomainMessageType = CommunityCar.Domain.Entities.Messaging.MessageType;
using DtoMessageType = CommunityCar.Application.Common.Interfaces.Messaging.MessageType;
using DomainConversationType = CommunityCar.Domain.Entities.Messaging.ConversationType;
using DtoConversationType = CommunityCar.Application.Common.Interfaces.Messaging.ConversationType;

namespace CommunityCar.Infrastructure.Services.Messaging;

public class ChatService : IChatService
{
    private readonly AppDbContext _context;

    public ChatService(AppDbContext context) => _context = context;

    public async Task<ConversationDto> GetOrCreateDirectConversationAsync(Guid userId, Guid otherUserId, CancellationToken ct = default)
    {
        // Find existing direct conversation
        var existing = await _context.Set<Conversation>()
            .Include(c => c.Members).ThenInclude(m => m.User)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
            .Where(c => c.Type == DomainConversationType.Direct)
            .Where(c => c.Members.Any(m => m.UserId == userId) && c.Members.Any(m => m.UserId == otherUserId))
            .FirstOrDefaultAsync(ct);

        if (existing != null)
            return MapToDto(existing, userId);

        // Create new conversation
        var conversation = new Conversation
        {
            Type = DomainConversationType.Direct,
            CreatedById = userId,
            Members = new List<ConversationMember>
            {
                new() { UserId = userId, IsAdmin = false },
                new() { UserId = otherUserId, IsAdmin = false }
            }
        };

        _context.Set<Conversation>().Add(conversation);
        await _context.SaveChangesAsync(ct);

        return await GetConversationAsync(conversation.Id, userId, ct) ?? throw new Exception("Failed to create conversation");
    }

    public async Task<ConversationDto> CreateGroupConversationAsync(Guid userId, string name, List<Guid> memberIds, CancellationToken ct = default)
    {
        var members = memberIds.Distinct().Select(id => new ConversationMember
        {
            UserId = id,
            IsAdmin = id == userId
        }).ToList();

        if (!members.Any(m => m.UserId == userId))
            members.Add(new ConversationMember { UserId = userId, IsAdmin = true });

        var conversation = new Conversation
        {
            Name = name,
            Type = DomainConversationType.Group,
            CreatedById = userId,
            Members = members
        };

        _context.Set<Conversation>().Add(conversation);
        await _context.SaveChangesAsync(ct);

        return await GetConversationAsync(conversation.Id, userId, ct) ?? throw new Exception("Failed to create conversation");
    }

    public async Task<List<ConversationDto>> GetUserConversationsAsync(Guid userId, int page = 1, int pageSize = 20, CancellationToken ct = default)
    {
        var conversations = await _context.Set<Conversation>()
            .Include(c => c.Members).ThenInclude(m => m.User)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1)).ThenInclude(m => m.Sender)
            .Where(c => c.Members.Any(m => m.UserId == userId && m.LeftAt == null))
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return conversations.Select(c => MapToDto(c, userId)).ToList();
    }

    public async Task<ConversationDto?> GetConversationAsync(Guid conversationId, Guid userId, CancellationToken ct = default)
    {
        var conversation = await _context.Set<Conversation>()
            .Include(c => c.Members).ThenInclude(m => m.User)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1)).ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.Members.Any(m => m.UserId == userId), ct);

        return conversation != null ? MapToDto(conversation, userId) : null;
    }

    public async Task<MessageDto> SendMessageAsync(Guid conversationId, Guid senderId, string content, DtoMessageType type = DtoMessageType.Text, string? attachmentUrl = null, CancellationToken ct = default)
    {
        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            Content = content,
            Type = (DomainMessageType)type,
            AttachmentUrl = attachmentUrl
        };

        _context.Set<Message>().Add(message);

        var conversation = await _context.Set<Conversation>().FindAsync([conversationId], ct);
        if (conversation != null)
            conversation.LastMessageAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        var sender = await _context.Users.FindAsync([senderId], ct);
        return new MessageDto
        {
            Id = message.Id,
            ConversationId = conversationId,
            SenderId = senderId,
            SenderName = sender?.UserName ?? "Unknown",
            SenderAvatarUrl = sender?.AvatarUrl,
            Content = content,
            Type = (DtoMessageType)message.Type,
            AttachmentUrl = attachmentUrl,
            CreatedAt = message.CreatedAt
        };
    }

    public async Task<List<MessageDto>> GetMessagesAsync(Guid conversationId, Guid userId, int page = 1, int pageSize = 50, CancellationToken ct = default)
    {
        var messages = await _context.Set<Message>()
            .Include(m => m.Sender)
            .Include(m => m.ReadReceipts)
            .Where(m => m.ConversationId == conversationId && !m.IsDeleted)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            ConversationId = m.ConversationId,
            SenderId = m.SenderId,
            SenderName = m.Sender.UserName ?? "Unknown",
            SenderAvatarUrl = m.Sender.AvatarUrl,
            Content = m.Content,
            Type = (DtoMessageType)m.Type,
            AttachmentUrl = m.AttachmentUrl,
            IsEdited = m.IsEdited,
            CreatedAt = m.CreatedAt,
            EditedAt = m.EditedAt,
            ReadBy = m.ReadReceipts.Select(r => r.UserId).ToList()
        }).ToList();
    }

    public async Task<bool> DeleteMessageAsync(Guid messageId, Guid userId, CancellationToken ct = default)
    {
        var message = await _context.Set<Message>().FirstOrDefaultAsync(m => m.Id == messageId && m.SenderId == userId, ct);
        if (message == null) return false;

        message.IsDeleted = true;
        message.Content = "[Message deleted]";
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> EditMessageAsync(Guid messageId, Guid userId, string newContent, CancellationToken ct = default)
    {
        var message = await _context.Set<Message>().FirstOrDefaultAsync(m => m.Id == messageId && m.SenderId == userId, ct);
        if (message == null) return false;

        message.Content = newContent;
        message.IsEdited = true;
        message.EditedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task MarkAsReadAsync(Guid conversationId, Guid userId, CancellationToken ct = default)
    {
        var member = await _context.Set<ConversationMember>()
            .FirstOrDefaultAsync(m => m.ConversationId == conversationId && m.UserId == userId, ct);
        if (member != null)
        {
            member.LastReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default)
    {
        var memberships = await _context.Set<ConversationMember>()
            .Where(m => m.UserId == userId && m.LeftAt == null)
            .ToListAsync(ct);

        var count = 0;
        foreach (var membership in memberships)
        {
            var unread = await _context.Set<Message>()
                .CountAsync(m => m.ConversationId == membership.ConversationId
                    && m.SenderId != userId
                    && m.CreatedAt > (membership.LastReadAt ?? DateTime.MinValue), ct);
            count += unread;
        }
        return count;
    }

    public Task SetTypingAsync(Guid conversationId, Guid userId, bool isTyping, CancellationToken ct = default)
    {
        // Typing status is handled in real-time via SignalR, no persistence needed
        return Task.CompletedTask;
    }

    public async Task<bool> AddMemberAsync(Guid conversationId, Guid adminId, Guid newMemberId, CancellationToken ct = default)
    {
        var isAdmin = await _context.Set<ConversationMember>()
            .AnyAsync(m => m.ConversationId == conversationId && m.UserId == adminId && m.IsAdmin, ct);
        if (!isAdmin) return false;

        _context.Set<ConversationMember>().Add(new ConversationMember
        {
            ConversationId = conversationId,
            UserId = newMemberId
        });
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> RemoveMemberAsync(Guid conversationId, Guid adminId, Guid memberId, CancellationToken ct = default)
    {
        var isAdmin = await _context.Set<ConversationMember>()
            .AnyAsync(m => m.ConversationId == conversationId && m.UserId == adminId && m.IsAdmin, ct);
        if (!isAdmin) return false;

        var member = await _context.Set<ConversationMember>()
            .FirstOrDefaultAsync(m => m.ConversationId == conversationId && m.UserId == memberId, ct);
        if (member == null) return false;

        member.LeftAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> LeaveConversationAsync(Guid conversationId, Guid userId, CancellationToken ct = default)
    {
        var member = await _context.Set<ConversationMember>()
            .FirstOrDefaultAsync(m => m.ConversationId == conversationId && m.UserId == userId, ct);
        if (member == null) return false;

        member.LeftAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> UpdateConversationAsync(Guid conversationId, Guid userId, string? name, string? imageUrl, CancellationToken ct = default)
    {
        var isAdmin = await _context.Set<ConversationMember>()
            .AnyAsync(m => m.ConversationId == conversationId && m.UserId == userId && m.IsAdmin, ct);
        if (!isAdmin) return false;

        var conversation = await _context.Set<Conversation>().FindAsync([conversationId], ct);
        if (conversation == null) return false;

        if (name != null) conversation.Name = name;
        if (imageUrl != null) conversation.ImageUrl = imageUrl;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private static ConversationDto MapToDto(Conversation c, Guid userId)
    {
        var member = c.Members.FirstOrDefault(m => m.UserId == userId);
        var lastMessage = c.Messages.FirstOrDefault();

        return new ConversationDto
        {
            Id = c.Id,
            Name = c.Type == DomainConversationType.Direct
                ? c.Members.FirstOrDefault(m => m.UserId != userId)?.User?.UserName
                : c.Name,
            ImageUrl = c.Type == DomainConversationType.Direct
                ? c.Members.FirstOrDefault(m => m.UserId != userId)?.User?.AvatarUrl
                : c.ImageUrl,
            Type = (DtoConversationType)c.Type,
            Members = c.Members.Where(m => m.LeftAt == null).Select(m => new ConversationMemberDto
            {
                UserId = m.UserId,
                UserName = m.User?.UserName ?? "Unknown",
                AvatarUrl = m.User?.AvatarUrl,
                IsAdmin = m.IsAdmin
            }).ToList(),
            LastMessage = lastMessage != null ? new MessageDto
            {
                Id = lastMessage.Id,
                ConversationId = lastMessage.ConversationId,
                SenderId = lastMessage.SenderId,
                SenderName = lastMessage.Sender?.UserName ?? "Unknown",
                Content = lastMessage.Content,
                Type = (DtoMessageType)lastMessage.Type,
                CreatedAt = lastMessage.CreatedAt
            } : null,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };
    }
}

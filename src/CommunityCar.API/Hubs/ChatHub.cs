using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using CommunityCar.Application.Common.Interfaces.Messaging;
using System.Security.Claims;

namespace CommunityCar.API.Hubs;

/// <summary>
/// SignalR hub for real-time chat functionality
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    private readonly IChatService _chatService;
    private static readonly Dictionary<string, HashSet<string>> _userConnections = new();

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId != null)
        {
            lock (_userConnections)
            {
                if (!_userConnections.ContainsKey(userId))
                    _userConnections[userId] = new HashSet<string>();
                _userConnections[userId].Add(Context.ConnectionId);
            }

            // Notify friends that user is online
            await Clients.Others.SendAsync("UserOnline", userId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId != null)
        {
            lock (_userConnections)
            {
                if (_userConnections.ContainsKey(userId))
                {
                    _userConnections[userId].Remove(Context.ConnectionId);
                    if (_userConnections[userId].Count == 0)
                        _userConnections.Remove(userId);
                }
            }

            // Notify friends that user is offline
            await Clients.Others.SendAsync("UserOffline", userId);
        }
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Join a conversation room
    /// </summary>
    public async Task JoinConversation(string conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
    }

    /// <summary>
    /// Leave a conversation room
    /// </summary>
    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
    }

    /// <summary>
    /// Send a message to a conversation
    /// </summary>
    public async Task SendMessage(string conversationId, string content, string messageType = "Text", string? attachmentUrl = null)
    {
        var userId = GetUserId();
        if (userId == null) return;

        var type = Enum.Parse<MessageType>(messageType);
        var message = await _chatService.SendMessageAsync(
            Guid.Parse(conversationId),
            Guid.Parse(userId),
            content,
            type,
            attachmentUrl
        );

        await Clients.Group($"conversation_{conversationId}").SendAsync("ReceiveMessage", message);
    }

    /// <summary>
    /// Notify typing status
    /// </summary>
    public async Task Typing(string conversationId, bool isTyping)
    {
        var userId = GetUserId();
        if (userId == null) return;

        await _chatService.SetTypingAsync(Guid.Parse(conversationId), Guid.Parse(userId), isTyping);
        await Clients.OthersInGroup($"conversation_{conversationId}").SendAsync("UserTyping", new
        {
            ConversationId = conversationId,
            UserId = userId,
            IsTyping = isTyping
        });
    }

    /// <summary>
    /// Mark messages as read
    /// </summary>
    public async Task MarkAsRead(string conversationId)
    {
        var userId = GetUserId();
        if (userId == null) return;

        await _chatService.MarkAsReadAsync(Guid.Parse(conversationId), Guid.Parse(userId));
        await Clients.OthersInGroup($"conversation_{conversationId}").SendAsync("MessagesRead", new
        {
            ConversationId = conversationId,
            UserId = userId,
            ReadAt = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Check if a user is online
    /// </summary>
    public static bool IsUserOnline(string userId)
    {
        lock (_userConnections)
        {
            return _userConnections.ContainsKey(userId) && _userConnections[userId].Count > 0;
        }
    }

    private string? GetUserId()
    {
        return Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.FindFirst("sub")?.Value;
    }
}

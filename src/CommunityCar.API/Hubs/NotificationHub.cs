using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace CommunityCar.API.Hubs;

/// <summary>
/// SignalR hub for real-time notifications
/// </summary>
[Authorize]
public class NotificationHub : Hub
{
    private static readonly Dictionary<string, HashSet<string>> _userConnections = new();

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId != null)
        {
            // Add to user's personal group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            lock (_userConnections)
            {
                if (!_userConnections.ContainsKey(userId))
                    _userConnections[userId] = new HashSet<string>();
                _userConnections[userId].Add(Context.ConnectionId);
            }
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId != null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");

            lock (_userConnections)
            {
                if (_userConnections.ContainsKey(userId))
                {
                    _userConnections[userId].Remove(Context.ConnectionId);
                    if (_userConnections[userId].Count == 0)
                        _userConnections.Remove(userId);
                }
            }
        }
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Subscribe to a topic (e.g., group, event, podcast)
    /// </summary>
    public async Task Subscribe(string topic)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, topic);
    }

    /// <summary>
    /// /// Unsubscribe from a topic
    /// </summary>
    public async Task Unsubscribe(string topic)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, topic);
    }

    /// <summary>
    /// Mark notification as read
    /// </summary>
    public async Task MarkAsRead(string notificationId)
    {
        var userId = GetUserId();
        if (userId == null) return;

        // Would call notification service to mark as read
        await Clients.Caller.SendAsync("NotificationRead", notificationId);
    }

    /// <summary>
    /// Mark all notifications as read
    /// </summary>
    public async Task MarkAllAsRead()
    {
        var userId = GetUserId();
        if (userId == null) return;

        // Would call notification service to mark all as read
        await Clients.Caller.SendAsync("AllNotificationsRead");
    }

    /// <summary>
    /// /// Get connection IDs for a user
    /// </summary>
    public static IEnumerable<string> GetUserConnections(string userId)
    {
        lock (_userConnections)
        {
            return _userConnections.TryGetValue(userId, out var connections)
                ? connections.ToList()
                : Enumerable.Empty<string>();
        }
    }

    /// <summary>
    /// Check if user is connected
    /// /// </summary>
    public static bool IsUserConnected(string userId)
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

/// <summary>
/// Service for sending notifications via SignalR
/// </summary>
public interface INotificationHubService
{
    Task SendToUserAsync(string userId, string method, object data);
    Task SendToUsersAsync(IEnumerable<string> userIds, string method, object data);
    Task SendToGroupAsync(string group, string method, object data);
    Task SendToAllAsync(string method, object data);
}

public class NotificationHubService : INotificationHubService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationHubService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendToUserAsync(string userId, string method, object data)
    {
        await _hubContext.Clients.Group($"user_{userId}").SendAsync(method, data);
    }

    public async Task SendToUsersAsync(IEnumerable<string> userIds, string method, object data)
    {
        var tasks = userIds.Select(userId => SendToUserAsync(userId, method, data));
        await Task.WhenAll(tasks);
    }

    public async Task SendToGroupAsync(string group, string method, object data)
    {
        await _hubContext.Clients.Group(group).SendAsync(method, data);
    }

    public async Task SendToAllAsync(string method, object data)
    {
        await _hubContext.Clients.All.SendAsync(method, data);
    }
}

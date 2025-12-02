namespace CommunityCar.Application.Features.Admin.Dashboard.Analytics;

public record AnalyticsOverviewDto
{
    public decimal UserGrowthPercent { get; set; }
    public decimal ContentEngagementPercent { get; set; }
    public decimal ActiveUsersPercent { get; set; }
    public decimal RevenueGrowthPercent { get; set; }
}

public record UserGrowthDataDto
{
    public string Date { get; set; } = string.Empty;
    public int NewUsers { get; set; }
    public int TotalUsers { get; set; }
}

public record ContentEngagementDataDto
{
    public string Date { get; set; } = string.Empty;
    public int Views { get; set; }
    public int Likes { get; set; }
    public int Comments { get; set; }
    public int Shares { get; set; }
}

public record TopContentDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Views { get; set; }
    public decimal Engagement { get; set; }
}

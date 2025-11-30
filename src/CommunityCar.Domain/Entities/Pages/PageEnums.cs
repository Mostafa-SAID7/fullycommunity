namespace CommunityCar.Domain.Entities.Pages;

public enum PageType
{
    Standard,
    Landing,
    Legal,
    Support,
    About,
    Contact,
    FAQ,
    Blog,
    News,
    Careers,
    Custom
}

public enum PageStatus
{
    Draft,
    PendingReview,
    Published,
    Scheduled,
    Archived,
    Removed
}

public enum PageVisibility
{
    Public,
    Private,
    AuthenticatedOnly,
    AdminOnly
}

public enum SectionType
{
    Hero,
    Text,
    Image,
    Gallery,
    Video,
    Features,
    Testimonials,
    Team,
    Pricing,
    FAQ,
    Contact,
    CTA,
    Stats,
    Timeline,
    Accordion,
    Tabs,
    Cards,
    Custom,
    Html
}

public enum FAQCategory
{
    General,
    Account,
    Billing,
    Technical,
    Privacy,
    Security,
    Features,
    Mobile,
    Other
}

public enum ContactType
{
    General,
    Support,
    Sales,
    Partnership,
    Press,
    Careers,
    Feedback,
    Other
}

public enum ContactStatus
{
    New,
    InProgress,
    Resolved,
    Closed,
    Spam
}

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA.Models;

public class CloseQuestionRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class UpdateQuestionAdminRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class UpdateAnswerAdminRequest
{
    public string Content { get; set; } = string.Empty;
}

public class MergeTagsRequest
{
    public List<string> SourceTags { get; set; } = [];
    public string TargetTag { get; set; } = string.Empty;
}

public class BulkActionRequest
{
    public List<Guid> QuestionIds { get; set; } = [];
    public string Reason { get; set; } = string.Empty;
}

public class BulkDeleteRequest
{
    public List<Guid> QuestionIds { get; set; } = [];
}

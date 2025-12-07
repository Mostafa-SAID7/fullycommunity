using System.ComponentModel.DataAnnotations;

namespace CommunityCar.Application.DTOs.Requests.Community.QA;

public record CreateCommentRequest
{
    [Required(ErrorMessage = "Comment content is required")]
    [StringLength(500, MinimumLength = 1, ErrorMessage = "Comment must be between 1 and 500 characters")]
    public string Content { get; init; } = string.Empty;
}

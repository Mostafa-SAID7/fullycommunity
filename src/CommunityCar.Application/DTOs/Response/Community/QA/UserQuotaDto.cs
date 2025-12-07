namespace CommunityCar.Application.DTOs.Response.Community.QA;

/// <summary>
/// User's Q&A quota information
/// </summary>
public class UserQuotaDto
{
    public int QuestionsUsed { get; set; }
    public int QuestionsLimit { get; set; }
    public bool HasUnlimitedQuestions { get; set; }
    public int QuestionsRemaining => HasUnlimitedQuestions ? -1 : Math.Max(0, QuestionsLimit - QuestionsUsed);
    
    public int AnswersUsed { get; set; }
    public int AnswersLimit { get; set; }
    public bool HasUnlimitedAnswers { get; set; }
    public int AnswersRemaining => HasUnlimitedAnswers ? -1 : Math.Max(0, AnswersLimit - AnswersUsed);
    
    public string UserRole { get; set; } = string.Empty;
}

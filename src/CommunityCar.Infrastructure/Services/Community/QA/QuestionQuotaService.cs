using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.QA;

/// <summary>
/// Service for checking user Q&A quota limits
/// </summary>
public class QuestionQuotaService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<Answer> _answerRepository;

    public QuestionQuotaService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _questionRepository = unitOfWork.Repository<Question>();
        _answerRepository = unitOfWork.Repository<Answer>();
    }

    public async Task<UserQuotaDto> GetUserQuotaAsync(Guid userId)
    {
        var userRepository = _unitOfWork.Repository<Domain.Entities.Identity.ApplicationUser>();
        var user = await userRepository.FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new InvalidOperationException("User not found");

        // Get user's question and answer counts
        var questionCount = await _questionRepository.AsQueryable()
            .Where(q => q.AuthorId == userId && !q.IsDeleted)
            .CountAsync();

        var answerCount = await _answerRepository.AsQueryable()
            .Where(a => a.AuthorId == userId && !a.IsDeleted)
            .CountAsync();

        // Get limits based on user type
        var (hasQuestionLimit, questionLimit, roleName) = GetQuestionLimit(user.UserType);
        var (hasAnswerLimit, answerLimit, _) = GetAnswerLimit(user.UserType);

        return new UserQuotaDto
        {
            QuestionsUsed = questionCount,
            QuestionsLimit = questionLimit,
            HasUnlimitedQuestions = !hasQuestionLimit,
            AnswersUsed = answerCount,
            AnswersLimit = answerLimit,
            HasUnlimitedAnswers = !hasAnswerLimit,
            UserRole = roleName
        };
    }

    private (bool hasLimit, int limit, string limitName) GetQuestionLimit(Domain.Enums.UserType userType)
    {
        return userType switch
        {
            Domain.Enums.UserType.Student => (true, 3, "Student"),
            Domain.Enums.UserType.User => (true, 3, "User"),
            // Unlimited for these roles
            Domain.Enums.UserType.Expert => (false, 0, "Expert"),
            Domain.Enums.UserType.Reviewer => (false, 0, "Reviewer"),
            Domain.Enums.UserType.Author => (false, 0, "Author"),
            Domain.Enums.UserType.Moderator => (false, 0, "Moderator"),
            Domain.Enums.UserType.Admin => (false, 0, "Admin"),
            Domain.Enums.UserType.SuperAdmin => (false, 0, "SuperAdmin"),
            Domain.Enums.UserType.Instructor => (false, 0, "Instructor"),
            _ => (true, 3, "User")
        };
    }

    private (bool hasLimit, int limit, string limitName) GetAnswerLimit(Domain.Enums.UserType userType)
    {
        return userType switch
        {
            Domain.Enums.UserType.Student => (true, 5, "Student"),
            Domain.Enums.UserType.User => (true, 5, "User"),
            // Unlimited for these roles
            Domain.Enums.UserType.Expert => (false, 0, "Expert"),
            Domain.Enums.UserType.Reviewer => (false, 0, "Reviewer"),
            Domain.Enums.UserType.Author => (false, 0, "Author"),
            Domain.Enums.UserType.Moderator => (false, 0, "Moderator"),
            Domain.Enums.UserType.Admin => (false, 0, "Admin"),
            Domain.Enums.UserType.SuperAdmin => (false, 0, "SuperAdmin"),
            Domain.Enums.UserType.Instructor => (false, 0, "Instructor"),
            _ => (true, 5, "User")
        };
    }
}

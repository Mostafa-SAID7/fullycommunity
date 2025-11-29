<div align="center">

# 🤝 Contributing to Fully Community

First off, thank you for considering contributing! 🎉

Every contribution helps make this project better for everyone.

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Testing Guidelines](#-testing-guidelines)
- [Documentation](#-documentation)

---

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to:

- 🤝 Be respectful and inclusive
- 💬 Use welcoming and inclusive language
- 🎯 Focus on what is best for the community
- 🙏 Show empathy towards other community members

---

## 🚀 Getting Started

### 1️⃣ Fork the Repository

```bash
# Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR_USERNAME/fullycommunity.git
cd fullycommunity
```

### 2️⃣ Set Up Upstream Remote

```bash
git remote add upstream https://github.com/Mostafa-SAID7/fullycommunity.git
git fetch upstream
```

### 3️⃣ Install Dependencies

```bash
# Backend
cd src && dotnet restore

# Frontend
cd ClientApp && npm install

# AI Agent
cd AiAgent && pip install -r requirements.txt

# Mobile
cd Mobile && flutter pub get
```

### 4️⃣ Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## 🔄 Development Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Create    │────▶│    Make     │────▶│    Test     │
│   Branch    │     │   Changes   │     │   Locally   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
┌─────────────┐     ┌─────────────┐     ┌──────▼──────┐
│   Merged!   │◀────│   Review    │◀────│   Create    │
│   🎉        │     │   Process   │     │     PR      │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Keep Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add password reset` |
| `fix` | Bug fix | `fix(api): resolve null reference` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting | `style: fix indentation` |
| `refactor` | Code refactoring | `refactor(service): simplify logic` |
| `test` | Adding tests | `test(auth): add login tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance | `perf(query): optimize database call` |
| `ci` | CI/CD changes | `ci: add code coverage` |

### Scopes

| Scope | Description |
|-------|-------------|
| `api` | Backend API |
| `web` | Angular frontend |
| `mobile` | Flutter app |
| `ai` | AI Agent |
| `auth` | Authentication |
| `db` | Database |
| `ci` | CI/CD pipelines |
| `docs` | Documentation |

### Examples

```bash
# ✅ Good commits
feat(auth): implement JWT refresh token
fix(web): resolve routing issue on profile page
docs(api): add authentication endpoints
test(auth): add unit tests for AuthService
chore(deps): update Angular to v19

# ❌ Bad commits
fixed stuff
WIP
update
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] 🧪 All tests pass locally
- [ ] 📝 Code follows style guidelines
- [ ] 📖 Documentation updated (if needed)
- [ ] 🔍 Self-review completed
- [ ] 🏷️ Appropriate labels added

### PR Title Format

```
<type>(<scope>): <description>
```

### PR Template

When you create a PR, please fill out the template:

```markdown
## 📋 Description
Brief description of changes.

## 🔗 Related Issues
Fixes #(issue number)

## 🧪 Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## 📸 Screenshots (if applicable)
Add screenshots for UI changes.

## ✅ Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Process

1. 🤖 **Automated checks** run (CI, linting, tests)
2. 👀 **Code review** by maintainers
3. 💬 **Address feedback** if any
4. ✅ **Approval** from at least 1 maintainer
5. 🚀 **Merge** to main branch

---

## 💻 Coding Standards

### 🔷 C# (.NET)

```csharp
// ✅ Use meaningful names
public async Task<User> GetUserByIdAsync(Guid userId)

// ✅ Use async/await properly
public async Task<IActionResult> CreateUser(CreateUserDto dto)
{
    var user = await _userService.CreateAsync(dto);
    return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
}

// ✅ Use records for DTOs
public record UserDto(Guid Id, string Email, string FirstName);
```

### 🌐 TypeScript (Angular)

```typescript
// ✅ Use standalone components
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...`
})
export class ProfileComponent {}

// ✅ Use signals for state
currentUser = signal<User | null>(null);

// ✅ Use inject() function
private authService = inject(AuthService);
```

### 🐍 Python

```python
# ✅ Use type hints
async def get_user(user_id: str) -> dict:
    ...

# ✅ Use Pydantic models
class UserRequest(BaseModel):
    email: str
    name: str

# ✅ Use async/await
async def process_request(request: UserRequest) -> dict:
    result = await service.process(request)
    return result
```

### 📱 Dart (Flutter)

```dart
// ✅ Use const constructors
const MyWidget({super.key});

// ✅ Use Provider for state
context.read<AuthProvider>().login(email, password);

// ✅ Use named parameters
Future<bool> login({
  required String email,
  required String password,
}) async { ... }
```

---

## 🧪 Testing Guidelines

### Backend (.NET)

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test
dotnet test --filter "FullyQualifiedName~AuthServiceTests"
```

### Frontend (Angular)

```bash
# Run tests
ng test

# Run with coverage
ng test --code-coverage

# Run headless
ng test --watch=false --browsers=ChromeHeadless
```

### AI Agent (Python)

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test
pytest tests/test_assistant.py -v
```

### Mobile (Flutter)

```bash
# Run tests
flutter test

# Run with coverage
flutter test --coverage
```

---

## 📚 Documentation

### When to Update Docs

- ✅ Adding new features
- ✅ Changing API endpoints
- ✅ Modifying configuration
- ✅ Updating dependencies

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `CONTRIBUTING.md` | Contribution guide |
| `SECURITY.md` | Security policy |
| `docs/api.md` | API reference |
| `docs/setup.md` | Setup guide |
| `docs/architecture.md` | System design |

---

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature request |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `priority: high` | High priority |
| `priority: low` | Low priority |

---

## 💬 Getting Help

- 💡 **Questions?** Open a [Discussion](https://github.com/Mostafa-SAID7/fullycommunity/discussions)
- 🐛 **Found a bug?** Open an [Issue](https://github.com/Mostafa-SAID7/fullycommunity/issues)
- 🔒 **Security issue?** See [SECURITY.md](SECURITY.md)

---

<div align="center">

**Thank you for contributing! 🙏**

Your efforts help make Fully Community better for everyone.

</div>

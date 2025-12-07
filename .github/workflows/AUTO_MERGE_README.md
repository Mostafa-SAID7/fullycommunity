# Auto Merge Workflows

This directory contains GitHub Actions workflows for automatically merging pull requests.

## Available Workflows

### 1. Auto Merge Pull Request (`auto-merge-pr.yml`)

**Triggers:**
- When a PR is opened, synchronized, reopened, or marked ready for review
- When a PR review is submitted
- When check suites complete
- On status updates

**Conditions for Auto-Merge:**
- PR is not a draft
- PR is from repository owner OR has `auto-merge` label
- All status checks pass
- All CI/CD checks pass
- PR has at least one approval (unless from repository owner)

**Features:**
- Automatically merges using squash method
- Adds a comment when merged
- Deletes the branch after merge (except protected branches)

**Usage:**
1. Create a PR from a feature branch
2. Wait for all checks to pass
3. Get approval (if not repository owner)
4. PR will auto-merge automatically

### 2. Auto Merge with Label (`auto-merge-label.yml`)

**Triggers:**
- When labels are added/removed
- When PR is synchronized, opened, reopened, or ready for review
- When PR review is submitted

**Conditions for Auto-Merge:**
- PR has `auto-merge` label
- PR does NOT have `work-in-progress` or `do-not-merge` labels
- PR is not a draft

**Features:**
- Uses `pascalgn/automerge-action`
- Squash merge method
- Retries up to 6 times with 10-second intervals
- Rebases before merging

**Usage:**
1. Create a PR
2. Add the `auto-merge` label
3. Wait for checks to pass
4. PR will merge automatically

### 3. Auto Merge Dependabot (`auto-merge-dependabot.yml`)

**Triggers:**
- When Dependabot opens, synchronizes, or reopens a PR

**Conditions for Auto-Merge:**
- PR is from `dependabot[bot]`
- Update type is patch or minor version

**Features:**
- Automatically approves Dependabot PRs
- Enables auto-merge for safe updates
- Uses squash merge method

**Usage:**
- Automatic - no action needed
- Dependabot PRs for patch/minor updates will auto-merge

## Configuration

### Merge Methods

All workflows use **squash merge** by default. To change:

```yaml
merge_method: 'squash'  # Options: 'merge', 'squash', 'rebase'
```

### Protected Branches

The following branches are protected from auto-deletion:
- `main`
- `master`
- `develop`
- `staging`
- `production`

### Labels

Create these labels in your repository:
- `auto-merge` - Enable auto-merge for a PR
- `work-in-progress` - Prevent auto-merge
- `do-not-merge` - Prevent auto-merge

## Repository Settings

### Enable Auto-Merge Feature

1. Go to repository **Settings** → **General**
2. Scroll to **Pull Requests**
3. Check **Allow auto-merge**
4. Check **Automatically delete head branches**

### Branch Protection Rules

For `main` branch:
1. Go to **Settings** → **Branches**
2. Add rule for `main`
3. Enable:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

## Permissions

Workflows require these permissions:
```yaml
permissions:
  contents: write
  pull-requests: write
```

## Troubleshooting

### PR Not Auto-Merging

Check:
1. ✅ All status checks passed
2. ✅ PR has required approvals
3. ✅ PR has `auto-merge` label (for label workflow)
4. ✅ PR is not a draft
5. ✅ No `do-not-merge` or `work-in-progress` labels
6. ✅ Branch is up to date with base branch

### Workflow Not Running

Check:
1. ✅ Workflow file is in `.github/workflows/`
2. ✅ YAML syntax is valid
3. ✅ Repository has Actions enabled
4. ✅ Workflow has required permissions

## Examples

### Example 1: Manual PR with Auto-Merge

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
gh pr create --title "feat: add new feature" --body "Description" --label "auto-merge"

# PR will auto-merge when checks pass and approved
```

### Example 2: Repository Owner Quick Merge

```bash
# Repository owner's PRs auto-merge without approval
git checkout -b fix/quick-fix
git add .
git commit -m "fix: quick bug fix"
git push origin fix/quick-fix
gh pr create --title "fix: quick bug fix" --body "Description"

# Auto-merges when checks pass (no approval needed)
```

## Security Considerations

- Only repository owners and PRs with `auto-merge` label can auto-merge
- Dependabot PRs only auto-merge for patch/minor updates
- Major version updates require manual review
- All checks must pass before merge
- Branch protection rules still apply

## Customization

### Change Merge Method

Edit the workflow file:
```yaml
merge_method: 'rebase'  # or 'merge'
```

### Require More Approvals

Edit the workflow condition:
```yaml
const hasApproval = approvedReviews.length >= 2;  # Require 2 approvals
```

### Add Custom Checks

Add to the workflow:
```yaml
- name: Custom check
  run: |
    # Your custom validation
    npm run custom-check
```

## Support

For issues or questions:
1. Check workflow run logs in Actions tab
2. Review this documentation
3. Check GitHub Actions documentation
4. Open an issue in the repository

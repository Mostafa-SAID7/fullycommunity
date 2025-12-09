# 🚀 Quick Release Guide

Fast reference for creating releases in the Fully Community Platform.

## 📋 Quick Commands

### Check Current Version
```bash
# Windows
type VERSION

# Linux/Mac
cat VERSION

# From package.json
cd ClientApp && npm run version:check
```

### Bump Version (Local)

**Windows (PowerShell):**
```powershell
# Patch (1.0.0 → 1.0.1)
.\scripts\version-bump.ps1

# Minor (1.0.0 → 1.1.0)
.\scripts\version-bump.ps1 -BumpType minor

# Major (1.0.0 → 2.0.0)
.\scripts\version-bump.ps1 -BumpType major

# Custom
.\scripts\version-bump.ps1 -CustomVersion "2.5.3"
```

**Linux/Mac (Bash):**
```bash
# Patch
./scripts/version-bump.sh patch

# Minor
./scripts/version-bump.sh minor

# Major
./scripts/version-bump.sh major

# Custom
./scripts/version-bump.sh 2.5.3
```

### Create Release (GitHub Actions)

**Automatic (Recommended):**
```bash
# Just push to main with conventional commits
git add .
git commit -m "feat: add new feature"
git push origin main

# Workflow automatically:
# 1. Analyzes commits
# 2. Bumps version
# 3. Creates release
# 4. Triggers deployments
```

**Manual:**
```bash
# Go to GitHub Actions
Actions → Manual Version Bump → Run workflow
  ├─ Version type: major/minor/patch
  ├─ Components: all
  └─ Create release: ✓
```

---

## 🎯 Commit Message Cheat Sheet

| Want to... | Use this commit | Result |
|------------|----------------|--------|
| Add feature | `feat: description` | Minor bump (1.0.0 → 1.1.0) |
| Fix bug | `fix: description` | Patch bump (1.0.0 → 1.0.1) |
| Breaking change | `feat!: description` | Major bump (1.0.0 → 2.0.0) |
| Update docs | `docs: description` | Patch bump |
| Refactor code | `refactor: description` | Patch bump |
| Add tests | `test: description` | Patch bump |
| Update deps | `chore(deps): description` | Patch bump |

---

## 🔄 Complete Release Flow

### 1. Development
```bash
# Work on feature
git checkout -b feature/new-feature

# Commit with conventional format
git commit -m "feat(auth): add OAuth2 support"

# Push and create PR
git push origin feature/new-feature
```

### 2. Merge to Main
```bash
# After PR approval
# Merge to main (via GitHub UI or CLI)
```

### 3. Automatic Release
```bash
# Workflow automatically:
# ✓ Analyzes commits since last release
# ✓ Determines version bump (feat = minor)
# ✓ Updates all component versions
# ✓ Generates changelog
# ✓ Creates git tag (v1.1.0)
# ✓ Creates GitHub release
# ✓ Triggers deployments
```

### 4. Verify
```bash
# Check GitHub Releases
https://github.com/YOUR_ORG/YOUR_REPO/releases

# Check deployments
Actions → View workflow runs
```

---

## 🆘 Emergency Hotfix

For critical bugs in production:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. Fix the bug
# ... make changes ...

# 3. Commit with fix prefix
git commit -m "fix: resolve critical security issue"

# 4. Push and create PR
git push origin hotfix/critical-bug

# 5. Merge to main (fast-track approval)
# Automatic release will create patch version

# 6. Verify deployment
# Check Actions tab for deployment status
```

---

## 📊 Version Strategy

| Release Type | When to Use | Example |
|--------------|-------------|---------|
| **Patch** (x.x.1) | Bug fixes, small updates | 1.0.0 → 1.0.1 |
| **Minor** (x.1.x) | New features, backwards compatible | 1.0.0 → 1.1.0 |
| **Major** (1.x.x) | Breaking changes, major updates | 1.0.0 → 2.0.0 |
| **Pre-release** | Beta/alpha testing | 1.0.0-beta.1 |

---

## 🎨 Commit Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation | Patch |
| `style` | Code style (formatting) | Patch |
| `refactor` | Code refactoring | Patch |
| `perf` | Performance improvement | Patch |
| `test` | Add/update tests | Patch |
| `chore` | Maintenance tasks | Patch |
| `ci` | CI/CD changes | Patch |
| `feat!` | Breaking change | Major |

---

## 🔍 Troubleshooting

### "No version bump detected"
**Problem:** Commits don't follow conventional format

**Solution:**
```bash
# Use proper commit format
git commit -m "feat: add new feature"  # ✓ Good
git commit -m "added feature"          # ✗ Bad
```

### "Version conflict"
**Problem:** Multiple components have different versions

**Solution:**
```powershell
# Sync all versions
.\scripts\version-bump.ps1 -CustomVersion "1.2.3"
```

### "Release failed"
**Problem:** Workflow error

**Solution:**
1. Check Actions tab for error details
2. Verify all tests pass
3. Manually trigger workflow again

---

## 📞 Quick Links

- **View Releases**: [GitHub Releases](https://github.com/YOUR_ORG/YOUR_REPO/releases)
- **View Changelog**: [CHANGELOG.md](../CHANGELOG.md)
- **Full Documentation**: [versioning-and-releases.md](./versioning-and-releases.md)
- **Report Issue**: [New Issue](https://github.com/YOUR_ORG/YOUR_REPO/issues/new)

---

## 💡 Pro Tips

1. **Always use conventional commits** - Enables automatic versioning
2. **Let automation handle releases** - More reliable than manual
3. **Review changelog before release** - Ensure accuracy
4. **Tag pre-releases properly** - Use `-beta`, `-alpha`, `-rc` suffixes
5. **Keep VERSION file in sync** - Single source of truth

---

<div align="center">

**Need help?** Check the [full documentation](./versioning-and-releases.md) or [open an issue](https://github.com/YOUR_ORG/YOUR_REPO/issues)

</div>

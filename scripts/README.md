# 🛠️ Scripts Directory

Utility scripts for managing the Fully Community Platform.

## 📋 Available Scripts

### Version Management

#### `version-bump.ps1` (Windows/PowerShell)
Automatically bump version across all components.

**Usage:**
```powershell
# Patch version (1.0.0 → 1.0.1)
.\version-bump.ps1

# Minor version (1.0.0 → 1.1.0)
.\version-bump.ps1 -BumpType minor

# Major version (1.0.0 → 2.0.0)
.\version-bump.ps1 -BumpType major

# Custom version
.\version-bump.ps1 -CustomVersion "2.5.3"

# Without commit
.\version-bump.ps1 -NoCommit

# Without tag
.\version-bump.ps1 -NoTag
```

#### `version-bump.sh` (Linux/Mac/Bash)
Same functionality as PowerShell version for Unix systems.

**Usage:**
```bash
# Make executable first
chmod +x version-bump.sh

# Patch version
./version-bump.sh patch

# Minor version
./version-bump.sh minor

# Major version
./version-bump.sh major

# Custom version
./version-bump.sh 2.5.3
```

## 🎯 What These Scripts Do

Both scripts perform the same operations:

1. **Calculate new version** based on bump type
2. **Update Frontend** - `ClientApp/package.json`
3. **Update Backend** - All `.csproj` files
4. **Update AI Agent** - `AiAgent/__version__.py`
5. **Update Mobile** - Android and iOS version files
6. **Update Root Files** - `VERSION` and docker-compose
7. **Generate Changelog** entry
8. **Commit and Tag** (optional)

## 📚 Documentation

For complete documentation on versioning and releases:
- [Full Documentation](../docs/versioning-and-releases.md)
- [Quick Guide](../docs/RELEASE_QUICK_GUIDE.md)

## 🔧 Requirements

### PowerShell Script
- PowerShell 5.1 or higher
- Node.js (for npm commands)
- Git

### Bash Script
- Bash 4.0 or higher
- Node.js (for npm commands)
- Git
- sed (for file replacements)

## 💡 Tips

1. **Always run from project root** - Scripts expect to be in `scripts/` directory
2. **Review changes before pushing** - Scripts show what will be changed
3. **Use automation when possible** - GitHub Actions handle most cases
4. **Keep versions in sync** - Scripts update all components together

## 🆘 Troubleshooting

### "Permission denied" (Bash)
```bash
chmod +x version-bump.sh
```

### "Execution policy" (PowerShell)
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### "Not in project root"
```bash
cd /path/to/project/root
./scripts/version-bump.sh
```

## 🔗 Related

- [GitHub Actions Workflows](../.github/workflows/automation/)
- [Release Documentation](../docs/versioning-and-releases.md)
- [Contributing Guide](../CONTRIBUTING.md)

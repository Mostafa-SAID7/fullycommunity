# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                                                                              ║
# ║   🔢 VERSION BUMP SCRIPT (PowerShell) - Fully Community Platform            ║
# ║                                                                              ║
# ║   Automatically bump version across all components                           ║
# ║                                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

param(
    [Parameter(Position=0)]
    [ValidateSet('major', 'minor', 'patch')]
    [string]$BumpType = 'patch',
    
    [Parameter()]
    [string]$CustomVersion,
    
    [Parameter()]
    [switch]$NoCommit,
    
    [Parameter()]
    [switch]$NoTag
)

# Colors
function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Error { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Warning { Write-Host "⚠️  $args" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ️  $args" -ForegroundColor Cyan }
function Write-Header { 
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║  $args" -ForegroundColor Blue
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
}

# Get current version
function Get-CurrentVersion {
    if (Test-Path "ClientApp\package.json") {
        $package = Get-Content "ClientApp\package.json" | ConvertFrom-Json
        return $package.version
    }
    return "0.0.0"
}

# Calculate new version
function Get-NewVersion {
    param(
        [string]$Current,
        [string]$BumpType
    )
    
    $parts = $Current.Split('.')
    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]
    
    switch ($BumpType) {
        'major' {
            $major++
            $minor = 0
            $patch = 0
        }
        'minor' {
            $minor++
            $patch = 0
        }
        'patch' {
            $patch++
        }
    }
    
    return "$major.$minor.$patch"
}

# Update frontend
function Update-Frontend {
    param([string]$Version)
    
    Write-Info "Updating frontend version to $Version..."
    
    Push-Location ClientApp
    npm version $Version --no-git-tag-version | Out-Null
    Pop-Location
    
    Write-Success "Frontend version updated"
}

# Update backend
function Update-Backend {
    param([string]$Version)
    
    Write-Info "Updating backend version to $Version..."
    
    # Update all .csproj files
    Get-ChildItem -Path "src" -Filter "*.csproj" -Recurse | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $content = $content -replace '<Version>.*</Version>', "<Version>$Version</Version>"
        Set-Content $_.FullName -Value $content -NoNewline
    }
    
    # Update appsettings.json
    $appsettings = "src\API\appsettings.json"
    if (Test-Path $appsettings) {
        $content = Get-Content $appsettings -Raw
        $content = $content -replace '"Version": ".*"', "`"Version`": `"$Version`""
        Set-Content $appsettings -Value $content -NoNewline
    }
    
    Write-Success "Backend version updated"
}

# Update AI agent
function Update-AIAgent {
    param([string]$Version)
    
    Write-Info "Updating AI agent version to $Version..."
    
    Set-Content "AiAgent\__version__.py" -Value "__version__ = '$Version'"
    
    $setup = "AiAgent\setup.py"
    if (Test-Path $setup) {
        $content = Get-Content $setup -Raw
        $content = $content -replace "version='.*'", "version='$Version'"
        Set-Content $setup -Value $content -NoNewline
    }
    
    Write-Success "AI agent version updated"
}

# Update mobile
function Update-Mobile {
    param([string]$Version)
    
    Write-Info "Updating mobile version to $Version..."
    
    # Android
    $gradle = "Mobile\Android\app\build.gradle"
    if (Test-Path $gradle) {
        $parts = $Version.Split('.')
        $versionCode = [int]$parts[0] * 10000 + [int]$parts[1] * 100 + [int]$parts[2]
        
        $content = Get-Content $gradle -Raw
        $content = $content -replace 'versionCode \d+', "versionCode $versionCode"
        $content = $content -replace 'versionName ".*"', "versionName `"$Version`""
        Set-Content $gradle -Value $content -NoNewline
    }
    
    Write-Success "Mobile version updated"
}

# Update root files
function Update-RootFiles {
    param([string]$Version)
    
    Write-Info "Updating root files..."
    
    # VERSION file
    Set-Content "VERSION" -Value $Version
    
    # Docker compose
    $dockerCompose = ".devops\docker-compose.yml"
    if (Test-Path $dockerCompose) {
        $content = Get-Content $dockerCompose -Raw
        $content = $content -replace ':v\d+\.\d+\.\d+', ":v$Version"
        Set-Content $dockerCompose -Value $content -NoNewline
    }
    
    Write-Success "Root files updated"
}

# Generate changelog
function Update-Changelog {
    param([string]$Version)
    
    Write-Info "Generating changelog entry..."
    
    $date = Get-Date -Format "yyyy-MM-dd"
    $entry = @"
## [$Version] - $date

### Changed
- Version bump to $Version

"@
    
    if (Test-Path "CHANGELOG.md") {
        $existing = Get-Content "CHANGELOG.md" -Raw
        Set-Content "CHANGELOG.md" -Value ($entry + $existing)
    } else {
        Set-Content "CHANGELOG.md" -Value "# Changelog`n`n$entry"
    }
    
    Write-Success "Changelog updated"
}

# Main script
try {
    Write-Header "VERSION BUMP SCRIPT"
    
    # Check if we're in root directory
    if (-not (Test-Path "ClientApp\package.json")) {
        Write-Error "Please run this script from the project root directory"
        exit 1
    }
    
    # Determine version
    $currentVersion = Get-CurrentVersion
    
    if ($CustomVersion) {
        $newVersion = $CustomVersion
    } else {
        $newVersion = Get-NewVersion -Current $currentVersion -BumpType $BumpType
    }
    
    Write-Info "Current version: $currentVersion"
    Write-Info "New version: $newVersion"
    Write-Host ""
    
    # Confirm
    $confirm = Read-Host "Continue with version bump? [y/N]"
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Warning "Version bump cancelled"
        exit 0
    }
    
    # Update all components
    Update-Frontend -Version $newVersion
    Update-Backend -Version $newVersion
    Update-AIAgent -Version $newVersion
    Update-Mobile -Version $newVersion
    Update-RootFiles -Version $newVersion
    Update-Changelog -Version $newVersion
    
    Write-Success "All components updated to version $newVersion"
    
    # Git operations
    if (-not $NoCommit) {
        $commitConfirm = Read-Host "Commit changes? [y/N]"
        if ($commitConfirm -eq 'y' -or $commitConfirm -eq 'Y') {
            git add .
            git commit -m "chore(release): bump version to $newVersion"
            Write-Success "Changes committed"
            
            if (-not $NoTag) {
                $tagConfirm = Read-Host "Create tag? [y/N]"
                if ($tagConfirm -eq 'y' -or $tagConfirm -eq 'Y') {
                    git tag -a "v$newVersion" -m "Release v$newVersion"
                    Write-Success "Tag created"
                    Write-Info "Push with: git push && git push --tags"
                }
            }
        }
    }
    
    Write-Header "VERSION BUMP COMPLETE! 🎉"
    
} catch {
    Write-Error "An error occurred: $_"
    exit 1
}

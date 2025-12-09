#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                                                                              ║
# ║   🔢 VERSION BUMP SCRIPT - Fully Community Platform                         ║
# ║                                                                              ║
# ║   Automatically bump version across all components                           ║
# ║                                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Get current version from package.json
get_current_version() {
    if [ -f "ClientApp/package.json" ]; then
        node -p "require('./ClientApp/package.json').version"
    else
        echo "0.0.0"
    fi
}

# Calculate new version
calculate_version() {
    local current=$1
    local bump_type=$2
    
    IFS='.' read -r -a parts <<< "$current"
    local major="${parts[0]}"
    local minor="${parts[1]}"
    local patch="${parts[2]}"
    
    case $bump_type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo "$bump_type"
            return
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Update frontend version
update_frontend() {
    local version=$1
    print_info "Updating frontend version to $version..."
    
    cd ClientApp
    npm version "$version" --no-git-tag-version
    cd ..
    
    print_success "Frontend version updated"
}

# Update backend version
update_backend() {
    local version=$1
    print_info "Updating backend version to $version..."
    
    # Update all .csproj files
    find src -name "*.csproj" -type f -exec sed -i "s/<Version>.*<\/Version>/<Version>$version<\/Version>/g" {} \;
    
    # Update appsettings.json if exists
    if [ -f "src/API/appsettings.json" ]; then
        sed -i "s/\"Version\": \".*\"/\"Version\": \"$version\"/g" src/API/appsettings.json
    fi
    
    print_success "Backend version updated"
}

# Update AI agent version
update_ai_agent() {
    local version=$1
    print_info "Updating AI agent version to $version..."
    
    cd AiAgent
    echo "__version__ = '$version'" > __version__.py
    
    if [ -f "setup.py" ]; then
        sed -i "s/version='.*'/version='$version'/g" setup.py
    fi
    cd ..
    
    print_success "AI agent version updated"
}

# Update mobile version
update_mobile() {
    local version=$1
    print_info "Updating mobile version to $version..."
    
    # Android
    if [ -f "Mobile/Android/app/build.gradle" ]; then
        IFS='.' read -r -a parts <<< "$version"
        local version_code=$((${parts[0]} * 10000 + ${parts[1]} * 100 + ${parts[2]}))
        
        sed -i "s/versionCode .*/versionCode $version_code/g" Mobile/Android/app/build.gradle
        sed -i "s/versionName \".*\"/versionName \"$version\"/g" Mobile/Android/app/build.gradle
    fi
    
    # iOS
    if [ -f "Mobile/iOS/Info.plist" ]; then
        /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $version" Mobile/iOS/Info.plist 2>/dev/null || true
    fi
    
    print_success "Mobile version updated"
}

# Update root files
update_root_files() {
    local version=$1
    print_info "Updating root files..."
    
    # VERSION file
    echo "$version" > VERSION
    
    # Docker compose
    if [ -f ".devops/docker-compose.yml" ]; then
        sed -i "s/:v[0-9]*\.[0-9]*\.[0-9]*/:v$version/g" .devops/docker-compose.yml
    fi
    
    print_success "Root files updated"
}

# Generate changelog entry
generate_changelog() {
    local version=$1
    local date=$(date +%Y-%m-%d)
    
    print_info "Generating changelog entry..."
    
    cat > CHANGELOG_ENTRY.md << EOF
## [$version] - $date

### Changed
- Version bump to $version

EOF
    
    if [ -f "CHANGELOG.md" ]; then
        cat CHANGELOG.md >> CHANGELOG_ENTRY.md
        mv CHANGELOG_ENTRY.md CHANGELOG.md
    else
        echo "# Changelog" > CHANGELOG.md
        echo "" >> CHANGELOG.md
        cat CHANGELOG_ENTRY.md >> CHANGELOG.md
    fi
    
    rm -f CHANGELOG_ENTRY.md
    print_success "Changelog updated"
}

# Main script
main() {
    print_header "VERSION BUMP SCRIPT"
    
    # Check if we're in the root directory
    if [ ! -f "ClientApp/package.json" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Get bump type
    BUMP_TYPE=${1:-patch}
    
    if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch|[0-9]+\.[0-9]+\.[0-9]+)$ ]]; then
        print_error "Invalid bump type. Use: major, minor, patch, or x.y.z"
        exit 1
    fi
    
    # Get current and new version
    CURRENT_VERSION=$(get_current_version)
    NEW_VERSION=$(calculate_version "$CURRENT_VERSION" "$BUMP_TYPE")
    
    print_info "Current version: $CURRENT_VERSION"
    print_info "New version: $NEW_VERSION"
    
    # Confirm
    read -p "$(echo -e ${YELLOW}Continue with version bump? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Version bump cancelled"
        exit 0
    fi
    
    # Update all components
    update_frontend "$NEW_VERSION"
    update_backend "$NEW_VERSION"
    update_ai_agent "$NEW_VERSION"
    update_mobile "$NEW_VERSION"
    update_root_files "$NEW_VERSION"
    generate_changelog "$NEW_VERSION"
    
    print_success "All components updated to version $NEW_VERSION"
    
    # Git operations
    read -p "$(echo -e ${YELLOW}Commit and tag changes? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "chore(release): bump version to $NEW_VERSION"
        git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
        
        print_success "Changes committed and tagged"
        print_info "Push with: git push && git push --tags"
    fi
    
    print_header "VERSION BUMP COMPLETE! 🎉"
}

# Run main function
main "$@"

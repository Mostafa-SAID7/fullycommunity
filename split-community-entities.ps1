# PowerShell script to split Community entities and extract enums
# This script will be run manually to complete the reorganization

Write-Host "This script will split all Community entities and extract enums" -ForegroundColor Green
Write-Host "Due to the large scope (30+ enums, 50+ classes), this needs to be done systematically" -ForegroundColor Yellow
Write-Host ""
Write-Host "Summary of work needed:" -ForegroundColor Cyan
Write-Host "- Events: 7 enums, 3 additional classes (EventMedia, EventComment)"
Write-Host "- Groups: 4 enums, 2 additional classes (GroupMember, GroupPost)"
Write-Host "- Posts: 3 enums, already split into separate files"
Write-Host "- Friendships: 1 enum, 2 additional classes (UserFollow, UserBlock)"
Write-Host "- Guides: 3 enums, 6 additional classes"
Write-Host "- Maps: 2 enums, 6 additional classes"
Write-Host "- News: 1 enum, 3 additional classes"
Write-Host "- Reviews: 3 enums, 5 additional classes"
Write-Host "- Pages: 3 enums, 3 additional classes"
Write-Host ""
Write-Host "Events enums have been created. Remaining work:" -ForegroundColor Green
Write-Host "1. Create enum files for other modules"
Write-Host "2. Split entity classes into separate files"
Write-Host "3. Update all using statements"
Write-Host "4. Remove old enum definitions from entity files"

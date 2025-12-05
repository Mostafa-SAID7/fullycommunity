$files = Get-ChildItem -Path "c:\Users\memos\OneDrive\Desktop\Projects\fullycommunity\ClientApp\projects\main\src\app\core\services" -Recurse -Filter "*.ts" -Exclude "index.ts"

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        if ($content) {
            # Deepen relative paths for modules outside services directory
            $newContent = $content.Replace("from '../../../", "from '../../../../")
            # This handles '../environments', '../models' etc assuming they were '../' before
            # But wait, original services were in 'core/services'. 
            # 'environments' is usually '../../environments' (from core/services -> core -> app -> src -> environments? NO)
            # environments is usually in 'src/environments'.
            # Path from 'src/app/core/services': '../../../../environments' 
            # If original was '../../../environments', adding one '../' makes it '../../../../environments' which is correct.
            
            # Use specific replacements to be safe
            $newContent = $newContent.Replace("from '../../environments", "from '../../../environments")
            $newContent = $newContent.Replace("from '../../../environments", "from '../../../../environments")
            $newContent = $newContent.Replace("from '../../shared", "from '../../../shared")
            $newContent = $newContent.Replace("from '../../../shared", "from '../../../../shared")
            $newContent = $newContent.Replace("from '../models", "from '../../models")
            $newContent = $newContent.Replace("from '../../models", "from '../../../models")
             
            # Fix cross-service imports (siblings becoming cousins)
            $newContent = $newContent.Replace("from './video.service'", "from '../media/video.service'")
            $newContent = $newContent.Replace("from './channel.service'", "from '../media/channel.service'")
            $newContent = $newContent.Replace("from './livestream.service'", "from '../media/livestream.service'")
            $newContent = $newContent.Replace("from './podcast.service'", "from '../media/podcast.service'")
            $newContent = $newContent.Replace("from './auth.service'", "from '../auth/auth.service'")
            $newContent = $newContent.Replace("from './role.service'", "from '../auth/role.service'")
            $newContent = $newContent.Replace("from './community.service'", "from '../community/community.service'")
            $newContent = $newContent.Replace("from './groups.service'", "from '../community/groups.service'")
            $newContent = $newContent.Replace("from './guides.service'", "from '../community/guides.service'")
            $newContent = $newContent.Replace("from './news.service'", "from '../community/news.service'")
            $newContent = $newContent.Replace("from './qa.service'", "from '../community/qa.service'")
            $newContent = $newContent.Replace("from './reviews.service'", "from '../community/reviews.service'")
            $newContent = $newContent.Replace("from './auction.service'", "from '../commerce/auction.service'")
            $newContent = $newContent.Replace("from './marketplace.service'", "from '../commerce/marketplace.service'")
            $newContent = $newContent.Replace("from './animation.service'", "from '../ui/animation.service'")
            $newContent = $newContent.Replace("from './lottie.service'", "from '../ui/lottie.service'")
            $newContent = $newContent.Replace("from './theme.service'", "from '../ui/theme.service'")
            $newContent = $newContent.Replace("from './toast.service'", "from '../ui/toast.service'")
            $newContent = $newContent.Replace("from './localization.service'", "from '../ui/localization.service'")
            $newContent = $newContent.Replace("from './maps.service'", "from '../ui/maps.service'")
            $newContent = $newContent.Replace("from './error.service'", "from '../common/error.service'")
            $newContent = $newContent.Replace("from './global-error-handler.service'", "from '../common/global-error-handler.service'")
            $newContent = $newContent.Replace("from './signalr.service'", "from '../common/signalr.service'")
            $newContent = $newContent.Replace("from './dashboard.service'", "from '../business/dashboard.service'")
            
            # Handle imports without quotes if any? no, ts always uses quotes.
            # Handle double quotes too? .Replace handles exact string.
            # I'll duplicate for double quotes to be robust.

            if ($content -ne $newContent) {
                $newContent | Set-Content $file.FullName -NoNewline -Force
                Write-Host "Fixed $($file.Name)"
            }
        }
    }
    catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}

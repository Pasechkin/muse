$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$logFile = Join-Path $projectRoot 'deploy-log.txt'
"[START] $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`nFAST DEPLOY (VERCEL)`n" | Set-Content -Path $logFile -Encoding UTF8

function Log($text) {
    $text | Tee-Object -FilePath $logFile -Append
}

Log "Step 1: Check npm..."
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Log "Error: npm not found in PATH"
    throw "npm not found"
}

Log "Step 2: Build CSS..."
& npm run build:once | Tee-Object -FilePath $logFile -Append

Log "Step 3: Copy CSS to html/css..."
& npm run copy-css | Tee-Object -FilePath $logFile -Append

Log "Step 4: Check Git..."
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Log "Error: Git not found in PATH"
    throw "git not found"
}

$productionBranch = $env:VERCEL_PRODUCTION_BRANCH
if ([string]::IsNullOrWhiteSpace($productionBranch)) {
    $productionBranch = 'main'
}
$currentBranch = (& git rev-parse --abbrev-ref HEAD).Trim()
Log "Git branch: $currentBranch (production: $productionBranch)"
$pushRef = if ($currentBranch -eq $productionBranch) { $productionBranch } else { "HEAD:$productionBranch" }
if ($currentBranch -ne $productionBranch) {
    Log "WARNING: You are deploying from a non-production branch. Current HEAD will be pushed to origin/$productionBranch so Vercel receives the production update."
    $answer = Read-Host "You are on '$currentBranch'. Push current HEAD to origin/$productionBranch and deploy? (y/N)"
    if ($answer.Trim().ToLower() -ne 'y') {
        Log "Deploy cancelled by user (wrong branch)."
        Start-Process notepad.exe $logFile
        return
    }
}

Log "Step 5: Git add..."
& git add . | Tee-Object -FilePath $logFile -Append

Log "Step 6: Check staged changes..."
& git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Log "No changes to commit. Deploy skipped."
    Log "Check that CSS build updated files."
    Start-Process notepad.exe $logFile
    return
}

Log "Step 7: Commit..."
$defaultCommitMessage = "Update: beauty-art links + audit rules"
$commitMessage = Read-Host "Commit message (Enter = '$defaultCommitMessage')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = $defaultCommitMessage
}
& git commit -m $commitMessage | Tee-Object -FilePath $logFile -Append

Log "Step 8: Push to GitHub..."
Log "Push ref: $pushRef"
& git push origin $pushRef 2>&1 | Tee-Object -FilePath $logFile -Append
if ($LASTEXITCODE -ne 0) {
    Log "ERROR: git push failed (exit code $LASTEXITCODE)"
    Log "Try: git push origin $pushRef manually"
    Start-Process notepad.exe $logFile
    throw "git push failed"
}

# Verify push succeeded
$localCommit = (& git rev-parse HEAD).Trim()
$remoteLine = (& git ls-remote origin "refs/heads/$productionBranch" | Select-Object -First 1)
if ([string]::IsNullOrWhiteSpace($remoteLine)) {
    Log "ERROR: Could not resolve origin/$productionBranch after push."
    Start-Process notepad.exe $logFile
    throw "push verification failed"
}
$remoteCommit = ($remoteLine -split "`t")[0].Trim()
if ($localCommit -ne $remoteCommit) {
    Log "WARNING: Local ($localCommit) != Remote ($remoteCommit). Push may have failed."
    Start-Process notepad.exe $logFile
    throw "push verification failed"
}

Log "SUCCESS! Changes pushed to GitHub production branch '$productionBranch'."
Log "Local HEAD and remote '$productionBranch' are in sync: $localCommit"
Start-Process notepad.exe $logFile

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
& git commit -m "Оптимизация: изображения, CSS inline, исправления производительности" | Tee-Object -FilePath $logFile -Append

Log "Step 8: Push to GitHub..."
& git push | Tee-Object -FilePath $logFile -Append

Log "SUCCESS! Changes pushed to GitHub."
Start-Process notepad.exe $logFile

# Создаёт папку src\icons\optimized и копирует туда все icon-*.svg
# После копирования откроет preview: src\icons\gallery-optimized.html

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $scriptRoot 'src\icons'
$dst = Join-Path $src 'optimized'

Write-Host "Source: $src"
Write-Host "Destination: $dst"

if (-not (Test-Path $src)) {
    Write-Host "Папка $src не найдена. Запустите скрипт из корня репозитория." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $dst | Out-Null

Get-ChildItem -Path $src -Filter 'icon-*.svg' -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $dst -Force
    Write-Host "Copied: $($_.Name)"
}

$preview = Join-Path $src 'gallery-optimized.html'
if (Test-Path $preview) {
    Write-Host "Открываю предпросмотр: $preview"
    Start-Process $preview
} else {
    Write-Host "Файл предпросмотра not found: $preview" -ForegroundColor Yellow
    Write-Host "Откройте src\icons\gallery-optimized.html вручную после копирования." -ForegroundColor Yellow
}

Write-Host "Готово. Откройте файл gallery-optimized.html в браузере для проверки." -ForegroundColor Green

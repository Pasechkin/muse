$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$logFile = Join-Path $projectRoot 'deploy-log.txt'
"[START] $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`nБЫСТРЫЙ ДЕПЛОЙ НА VERCEL`n" | Set-Content -Path $logFile -Encoding UTF8

function Log($text) {
    $text | Tee-Object -FilePath $logFile -Append
}

Log "Шаг 1: Проверка npm..."
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Log "Ошибка: npm не найден в PATH!"
    throw "npm not found"
}

Log "Шаг 2: Сборка CSS..."
& npm run build:once | Tee-Object -FilePath $logFile -Append

Log "Шаг 3: Копирование CSS в html/css..."
& npm run copy-css | Tee-Object -FilePath $logFile -Append

Log "Шаг 4: Проверка Git..."
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Log "Ошибка: Git не найден в PATH!"
    throw "git not found"
}

Log "Шаг 5: Добавление всех изменений в Git..."
& git add . | Tee-Object -FilePath $logFile -Append

Log "Шаг 6: Проверка наличия изменений..."
& git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Log "Нет изменений для коммита. Деплой пропущен."
    Log "Проверьте, что сборка обновила файлы CSS."
    Start-Process notepad.exe $logFile
    return
}

Log "Шаг 7: Создание коммита..."
& git commit -m "Оптимизация: изображения, CSS inline, исправления производительности" | Tee-Object -FilePath $logFile -Append

Log "Шаг 8: Отправка на GitHub..."
& git push | Tee-Object -FilePath $logFile -Append

Log "УСПЕШНО! Изменения отправлены на GitHub."
Start-Process notepad.exe $logFile

@echo off
echo Создаю копию проекта БЕЗ node_modules...
echo.

set SOURCE=%~dp0
set DEST=%SOURCE%tailwind-project-clean

if exist "%DEST%" (
    echo Удаляю старую копию...
    rmdir /s /q "%DEST%"
)

echo Создаю новую папку...
mkdir "%DEST%"

echo Копирую файлы...
xcopy "%SOURCE%src" "%DEST%\src\" /E /I /H /Y /EXCLUDE:exclude.txt >nul 2>&1
copy "%SOURCE%package.json" "%DEST%\" >nul 2>&1
copy "%SOURCE%tailwind.config.js" "%DEST%\" >nul 2>&1
copy "%SOURCE%postcss.config.js" "%DEST%\" >nul 2>&1
copy "%SOURCE%vercel.json" "%DEST%\" >nul 2>&1
copy "%SOURCE%netlify.toml" "%DEST%\" >nul 2>&1
copy "%SOURCE%.gitignore" "%DEST%\" >nul 2>&1
copy "%SOURCE%README.md" "%DEST%\" >nul 2>&1
copy "%SOURCE%*.md" "%DEST%\" >nul 2>&1

echo.
echo Готово! Папка создана: tailwind-project-clean
echo Эта папка БЕЗ node_modules - можно загружать в GitHub!
echo.
pause





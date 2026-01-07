@echo off
chcp 65001 > nul

set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"

echo ========================================
echo  ВОССТАНОВЛЕНИЕ index.html
echo ========================================
echo.

echo Замена инлайнового CSS на внешний файл...

powershell -Command "$content = Get-Content 'src\html\index_tailwind.html' -Raw -Encoding UTF8; $content = $content -replace '(?s)<!-- Инлайновый CSS для оптимизации критического пути -->\s*<style>.*?</style>', '<link rel=\"stylesheet\" href=\"css/output.css\">'; Set-Content -Path 'src\html\index.html' -Value $content -Encoding UTF8"

if %errorlevel% equ 0 (
    echo.
    echo ✅ УСПЕШНО! index.html восстановлен с внешним CSS
    echo.
    echo Теперь index.html использует внешний файл css/output.css
    echo как и другие страницы (portret-na-zakaz/index.html и т.д.)
    echo.
    echo Вы можете открыть src\html\index.html в браузере и проверить.
) else (
    echo.
    echo ❌ Ошибка при восстановлении файла!
)

echo.
pause





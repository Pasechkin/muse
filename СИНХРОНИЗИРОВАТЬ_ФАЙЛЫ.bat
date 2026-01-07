@echo off
chcp 65001 > nul

echo ========================================
echo  СИНХРОНИЗАЦИЯ index.html с index_tailwind.html
echo ========================================
echo.

set "SOURCE=src\html\index_tailwind.html"
set "DEST=src\html\index.html"

if not exist "%SOURCE%" (
    echo Ошибка: Файл %SOURCE% не найден!
    pause
    exit /b 1
)

echo Копирование %SOURCE% в %DEST%...
copy /Y "%SOURCE%" "%DEST%" > nul

if %errorlevel% equ 0 (
    echo.
    echo ✅ УСПЕШНО! index.html обновлен.
    echo.
    echo Теперь index.html содержит актуальную версию с инлайновым CSS.
    echo.
    echo Следующий шаг: запустите БЫСТРЫЙ_ДЕПЛОЙ.bat для отправки на GitHub
) else (
    echo.
    echo ❌ Ошибка при копировании файла!
)

echo.
pause





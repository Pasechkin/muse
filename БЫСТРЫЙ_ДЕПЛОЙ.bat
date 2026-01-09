@echo off
chcp 65001 > nul

set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"

echo ========================================
echo  БЫСТРЫЙ ДЕПЛОЙ НА VERCEL
echo ========================================
echo.

echo Шаг 1: Сборка CSS...
call npm run build:once
if %errorlevel% neq 0 (
    echo Ошибка при сборке CSS!
    pause
    exit /b 1
)

echo.
echo Шаг 2: Копирование CSS в html/css...
call npm run copy-css
if %errorlevel% neq 0 (
    echo Ошибка при копировании CSS!
    pause
    exit /b 1
)

echo.
echo Шаг 3: Поиск Git...
set "GIT_PATH="
for %%i in (
    "C:\Program Files\Git\cmd\git.exe"
    "C:\Program Files (x86)\Git\cmd\git.exe"
    "C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd\git.exe"
) do (
    if exist "%%~i" (
        set "GIT_PATH=%%~i"
        goto :found_git
    )
)

echo Ошибка: Git не найден!
pause
exit /b 1

:found_git
echo Git найден: %GIT_PATH%
echo.

echo Шаг 4: Добавление всех изменений в Git...
"%GIT_PATH%" add .
if %errorlevel% neq 0 (
    echo Ошибка при добавлении файлов в Git!
    pause
    exit /b 1
)

echo.
echo Шаг 5: Создание коммита...
"%GIT_PATH%" commit -m "Оптимизация: изображения, CSS inline, исправления производительности"
if %errorlevel% neq 0 (
    echo Внимание: Возможно, нет изменений для коммита или коммит уже создан.
)

echo.
echo Шаг 6: Отправка на GitHub...
"%GIT_PATH%" push
if %errorlevel% neq 0 (
    echo Ошибка при отправке на GitHub!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  УСПЕШНО!
echo ========================================
echo.
echo Изменения отправлены на GitHub.
echo Vercel автоматически запустит деплой (обычно 1-3 минуты).
echo.
echo Проверьте статус деплоя:
echo https://vercel.com/dashboard
echo.
echo После завершения деплоя изменения появятся на:
echo https://muse-liard-one.vercel.app/
echo.
pause






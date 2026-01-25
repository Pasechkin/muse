@echo off
chcp 65001 > nul

rem Увеличим размер окна (не меняет шрифт, но упрощает чтение)
mode con: cols=120 lines=40
title БЫСТРЫЙ ДЕПЛОЙ НА VERCEL

set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"

set "LOG_FILE=%CURRENT_DIR%deploy-log.txt"
echo [START] %date% %time%> "%LOG_FILE%"
echo БЫСТРЫЙ ДЕПЛОЙ НА VERCEL>> "%LOG_FILE%"
echo.>> "%LOG_FILE%"

call :main >> "%LOG_FILE%" 2>&1
set "MAIN_EXIT=%errorlevel%"

echo.>> "%LOG_FILE%"
echo Лог операции: %LOG_FILE%>> "%LOG_FILE%"

echo ========================================
echo ЛОГ ОПЕРАЦИИ:
echo ========================================
type "%LOG_FILE%"
echo ========================================

if exist "%LOG_FILE%" (
    start "" notepad.exe "%LOG_FILE%"
)

pause
exit /b %MAIN_EXIT%

:main
echo ========================================
echo  БЫСТРЫЙ ДЕПЛОЙ НА VERCEL
echo ========================================
echo.

echo ========================================
echo  БЫСТРЫЙ ДЕПЛОЙ НА VERCEL
echo ========================================
echo.

echo Шаг 1: Проверка npm...
where npm > nul 2> nul
if %errorlevel% neq 0 (
    echo Ошибка: npm не найден в PATH!
    pause
    exit /b 1
)

echo.
echo Шаг 2: Сборка CSS...
call npm run build:once
if %errorlevel% neq 0 (
    echo Ошибка при сборке CSS!
    pause
    exit /b 1
)

echo.
echo Шаг 3: Копирование CSS в html/css...
call npm run copy-css
if %errorlevel% neq 0 (
    echo Ошибка при копировании CSS!
    pause
    exit /b 1
)

echo.
echo Шаг 4: Поиск Git...
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

echo Шаг 5: Добавление всех изменений в Git...
"%GIT_PATH%" add .
if %errorlevel% neq 0 (
    echo Ошибка при добавлении файлов в Git!
    pause
    exit /b 1
)

echo.
echo Шаг 6: Проверка наличия изменений...
"%GIT_PATH%" diff --cached --quiet
if %errorlevel%==0 (
    echo Нет изменений для коммита. Деплой пропущен.
    echo Проверьте, что сборка обновила файлы CSS.
    echo ========================================
    echo  ЗАВЕРШЕНО БЕЗ ДЕПЛОЯ
    echo ========================================
    pause
    exit /b 0
)

echo.
echo Шаг 7: Создание коммита...
"%GIT_PATH%" commit -m "Оптимизация: изображения, CSS inline, исправления производительности"
if %errorlevel% neq 0 (
    echo Внимание: коммит не создан. Проверьте состояние репозитория.
    pause
    exit /b 1
)

echo.
echo Шаг 8: Отправка на GitHub...
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
exit /b 0













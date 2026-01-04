@echo off
chcp 65001 >nul
echo ========================================
echo   Загрузка проекта на GitHub
echo ========================================
echo.

REM Проверка наличия git
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Git не установлен!
    echo.
    echo Установите Git:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git найден
echo.

REM Инициализация git (если еще не сделано)
if not exist .git (
    echo Инициализация git репозитория...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] Не удалось инициализировать git
        pause
        exit /b 1
    )
    echo [OK] Git репозиторий инициализирован
) else (
    echo [OK] Git репозиторий уже существует
)
echo.

REM Добавление файлов
echo Добавление файлов...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Не удалось добавить файлы
    pause
    exit /b 1
)
echo [OK] Файлы добавлены
echo.

REM Проверка наличия коммитов
git log --oneline -1 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Создание первого коммита...
    git commit -m "Initial commit: Muse site with Tailwind CSS"
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] Не удалось создать коммит
        pause
        exit /b 1
    )
    echo [OK] Коммит создан
) else (
    echo У вас уже есть коммиты
    echo.
    set /p COMMIT_MSG="Введите сообщение для коммита (или нажмите Enter для 'Update'): "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update
    git commit -m "!COMMIT_MSG!"
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] Не удалось создать коммит
        pause
        exit /b 1
    )
    echo [OK] Коммит создан
)
echo.

REM Переименование ветки в main
git branch -M main 2>nul
echo.

REM Проверка подключения к remote
git remote -v | findstr origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ========================================
    echo   Нужно подключить GitHub репозиторий
    echo ========================================
    echo.
    echo 1. Создайте репозиторий на GitHub.com
    echo 2. Скопируйте URL вашего репозитория
    echo    (например: https://github.com/username/muse-site.git)
    echo.
    set /p GITHUB_URL="Введите URL вашего GitHub репозитория: "
    if "!GITHUB_URL!"=="" (
        echo [ОШИБКА] URL не введен
        pause
        exit /b 1
    )
    git remote add origin "!GITHUB_URL!"
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] Не удалось добавить remote
        pause
        exit /b 1
    )
    echo [OK] GitHub репозиторий подключен
    echo.
)

REM Загрузка на GitHub
echo ========================================
echo   Загрузка на GitHub...
echo ========================================
echo.
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ПРЕДУПРЕЖДЕНИЕ] Возможно, нужно выполнить:
    echo   git push -u origin main --force
    echo.
    echo Или проверьте, что репозиторий создан на GitHub
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ Готово! Проект загружен на GitHub
echo ========================================
echo.
pause


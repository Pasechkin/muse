@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════╗
echo ║  Загрузка проекта на GitHub            ║
echo ╚════════════════════════════════════════╝
echo.

REM Проверка наличия git
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git не установлен!
    echo.
    echo 📥 Установите Git для Windows:
    echo    https://git-scm.com/download/win
    echo.
    echo 💡 Или используйте GitHub Desktop:
    echo    https://desktop.github.com/
    echo.
    echo После установки запустите этот файл снова.
    echo.
    pause
    exit /b 1
)

echo ✅ Git найден!
echo.

REM Переход в директорию проекта
cd /d "%~dp0"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Не удалось перейти в папку проекта
    pause
    exit /b 1
)

echo 📁 Текущая папка: %CD%
echo.

REM Инициализация git (если еще не сделано)
if not exist .git (
    echo 🔧 Инициализация git репозитория...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при инициализации git
        pause
        exit /b 1
    )
    echo ✅ Git репозиторий инициализирован
) else (
    echo ✅ Git репозиторий уже существует
)
echo.

REM Добавление файлов
echo 📦 Добавление файлов...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка при добавлении файлов
    pause
    exit /b 1
)
echo ✅ Файлы добавлены
echo.

REM Проверка наличия коммитов
git log --oneline -1 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 📝 Создание первого коммита...
    git commit -m "Initial commit: Muse site with Tailwind CSS"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при создании коммита
        echo.
        echo 💡 Возможно, нужно настроить имя и email:
        echo    git config --global user.name "Ваше Имя"
        echo    git config --global user.email "your.email@example.com"
        pause
        exit /b 1
    )
    echo ✅ Первый коммит создан
) else (
    echo 📝 У вас уже есть коммиты
    echo.
    set /p COMMIT_MSG="Введите сообщение для коммита (или Enter для 'Update'): "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update
    git commit -am "!COMMIT_MSG!"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при создании коммита
        pause
        exit /b 1
    )
    echo ✅ Коммит создан: !COMMIT_MSG!
)
echo.

REM Переименование ветки в main
git branch -M main 2>nul
echo.

REM Проверка подключения к remote
git remote -v | findstr origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ╔════════════════════════════════════════╗
    echo ║  Подключение к GitHub репозиторию      ║
    echo ╚════════════════════════════════════════╝
    echo.
    echo 1️⃣  Создайте репозиторий на GitHub.com
    echo 2️⃣  Скопируйте URL вашего репозитория
    echo     (например: https://github.com/username/muse-site.git)
    echo.
    set /p GITHUB_URL="📎 Введите URL вашего GitHub репозитория: "
    if "!GITHUB_URL!"=="" (
        echo ❌ URL не введен
        pause
        exit /b 1
    )
    git remote add origin "!GITHUB_URL!"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при подключении репозитория
        pause
        exit /b 1
    )
    echo ✅ GitHub репозиторий подключен
    echo.
) else (
    echo ✅ GitHub репозиторий уже подключен
    git remote -v
    echo.
)

REM Загрузка на GitHub
echo ╔════════════════════════════════════════╗
echo ║  Загрузка на GitHub...                 ║
echo ╚════════════════════════════════════════╝
echo.
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Возможные причины ошибки:
    echo.
    echo 1. Репозиторий не создан на GitHub
    echo 2. Неправильный URL репозитория
    echo 3. Нет доступа к репозиторию
    echo.
    echo 💡 Попробуйте:
    echo    git push -u origin main --force
    echo.
    echo 💡 Или проверьте доступ к репозиторию на GitHub
    echo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════╗
echo ║  ✅ ГОТОВО! Проект загружен на GitHub  ║
echo ╚════════════════════════════════════════╝
echo.
echo 🎉 Следующие шаги:
echo    1. Зайдите на GitHub.com и проверьте репозиторий
echo    2. Подключите к Vercel для деплоя (vercel.com)
echo.
pause


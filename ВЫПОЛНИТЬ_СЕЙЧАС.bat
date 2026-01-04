@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════╗
echo ║  ЗАГРУЗКА НА GITHUB                   ║
echo ╚════════════════════════════════════════╝
echo.
echo 📋 Ваш репозиторий:
echo    https://github.com/Pasechkin/muse
echo.
echo ⚠️  ВАЖНО: 
echo    1. Убедитесь, что Git установлен
echo    2. Перезапустите PowerShell после установки Git
echo    3. Репозиторий должен быть создан на GitHub
echo.
pause

REM Поиск Git
set "GIT_CMD="
where git >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "GIT_CMD=git"
    goto :found_git
)

REM Стандартные пути
if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    set "PATH=%PATH%;C:\Program Files\Git\cmd"
) else if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
    set "GIT_CMD=C:\Program Files (x86)\Git\cmd\git.exe"
    set "PATH=%PATH%;C:\Program Files (x86)\Git\cmd"
) else if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
    set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Git\cmd"
) else (
    echo ❌ Git не найден!
    echo.
    echo 📥 Установите Git:
    echo    https://git-scm.com/download/win
    echo.
    echo 🔄 После установки:
    echo    1. Закройте это окно
    echo    2. Перезапустите PowerShell
    echo    3. Запустите этот файл снова
    echo.
    pause
    exit /b 1
)

:found_git
echo ✅ Git найден: %GIT_CMD%
echo.

REM Переход в папку скрипта
cd /d "%~dp0"

echo 📁 Папка: %CD%
echo.

REM Инициализация git
if not exist .git (
    echo 🔧 Инициализация git...
    %GIT_CMD% init
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка инициализации
        pause
        exit /b 1
    )
)

REM Добавление файлов
echo 📦 Добавление файлов...
%GIT_CMD% add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка добавления файлов
    pause
    exit /b 1
)

REM Коммит
echo 📝 Создание коммита...
%GIT_CMD% commit -m "Initial commit: Muse site with Tailwind CSS" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Проверка конфигурации Git...
    %GIT_CMD% config user.name >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo 💡 Нужно настроить Git:
        echo.
        set /p GIT_NAME="Введите ваше имя: "
        %GIT_CMD% config --global user.name "!GIT_NAME!"
        set /p GIT_EMAIL="Введите ваш email: "
        %GIT_CMD% config --global user.email "!GIT_EMAIL!"
        %GIT_CMD% commit -m "Initial commit: Muse site with Tailwind CSS"
    )
)

REM Переименование ветки
%GIT_CMD% branch -M main 2>nul

REM Подключение к GitHub
echo 🔗 Подключение к GitHub...
%GIT_CMD% remote remove origin 2>nul
%GIT_CMD% remote add origin https://github.com/Pasechkin/muse.git
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка подключения
    pause
    exit /b 1
)

REM Загрузка
echo ⬆️  Загрузка на GitHub...
echo.
%GIT_CMD% push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Ошибка загрузки
    echo.
    echo 💡 Возможные причины:
    echo    1. Репозиторий не создан на GitHub
    echo    2. Нужна авторизация (GitHub попросит логин/пароль)
    echo.
    echo 💡 Решение:
    echo    1. Создайте репозиторий: https://github.com/new
    echo    2. Назовите: muse-site
    echo    3. НЕ ставьте галочки на README, .gitignore
    echo    4. Нажмите Create repository
    echo    5. Запустите этот скрипт снова
    echo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════╗
echo ║  ✅ ГОТОВО! Проект загружен!          ║
echo ╚════════════════════════════════════════╝
echo.
echo 🔗 Репозиторий:
echo    https://github.com/Pasechkin/muse
echo.
echo 🎉 Следующий шаг: Подключить к Vercel
echo    https://vercel.com → Import Project
echo.
pause


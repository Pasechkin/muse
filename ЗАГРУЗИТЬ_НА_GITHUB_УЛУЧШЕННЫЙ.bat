@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════╗
echo ║  Загрузка проекта на GitHub            ║
echo ╚════════════════════════════════════════╝
echo.

REM Поиск Git в стандартных местах
set "GIT_EXE="
where git >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "GIT_EXE=git"
    goto :found_git
)

REM Попробуем найти в Program Files
if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"
    set "PATH=%PATH%;C:\Program Files\Git\cmd"
    goto :found_git
)

if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
    set "GIT_EXE=C:\Program Files (x86)\Git\cmd\git.exe"
    set "PATH=%PATH%;C:\Program Files (x86)\Git\cmd"
    goto :found_git
)

REM Попробуем найти в пользовательских программах
if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
    set "GIT_EXE=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Git\cmd"
    goto :found_git
)

echo ❌ Git не найден!
echo.
echo 📥 Убедитесь, что Git установлен:
echo    https://git-scm.com/download/win
echo.
echo 🔄 После установки:
echo    1. Закройте это окно
echo    2. Перезапустите PowerShell/Terminal
echo    3. Запустите этот файл снова
echo.
pause
exit /b 1

:found_git
echo ✅ Git найден: %GIT_EXE%
echo.

REM Переход в директорию скрипта
cd /d "%~dp0"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Не удалось перейти в папку проекта
    pause
    exit /b 1
)

echo 📁 Текущая папка: %CD%
echo.

REM Инициализация git
if not exist .git (
    echo 🔧 Инициализация git репозитория...
    %GIT_EXE% init
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
%GIT_EXE% add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка при добавлении файлов
    pause
    exit /b 1
)
echo ✅ Файлы добавлены
echo.

REM Проверка наличия коммитов
%GIT_EXE% log --oneline -1 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 📝 Создание первого коммита...
    %GIT_EXE% commit -m "Initial commit: Muse site with Tailwind CSS"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при создании коммита
        echo.
        echo 💡 Возможно, нужно настроить имя и email:
        echo    %GIT_EXE% config --global user.name "Ваше Имя"
        echo    %GIT_EXE% config --global user.email "your.email@example.com"
        echo.
        pause
        exit /b 1
    )
    echo ✅ Первый коммит создан
) else (
    echo 📝 У вас уже есть коммиты
    set /p COMMIT_MSG="Введите сообщение для коммита (или Enter для 'Update'): "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update
    %GIT_EXE% commit -am "!COMMIT_MSG!"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при создании коммита
        pause
        exit /b 1
    )
    echo ✅ Коммит создан: !COMMIT_MSG!
)
echo.

REM Переименование ветки в main
%GIT_EXE% branch -M main 2>nul
echo.

REM Проверка подключения к remote
%GIT_EXE% remote -v | findstr origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ╔════════════════════════════════════════╗
    echo ║  Подключение к GitHub репозиторию      ║
    echo ╚════════════════════════════════════════╝
    echo.
    echo 🔗 Подключение к: https://github.com/Pasechkin/muse-site.git
    %GIT_EXE% remote add origin https://github.com/Pasechkin/muse-site.git
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при подключении репозитория
        echo 💡 Возможно, репозиторий уже подключен
        pause
        exit /b 1
    )
    echo ✅ GitHub репозиторий подключен
    echo.
) else (
    echo ✅ GitHub репозиторий уже подключен
    %GIT_EXE% remote -v
    echo.
)

REM Загрузка на GitHub
echo ╔════════════════════════════════════════╗
echo ║  Загрузка на GitHub...                 ║
echo ╚════════════════════════════════════════╝
echo.
echo ⏳ Это может занять несколько секунд...
echo.
%GIT_EXE% push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Возможные причины ошибки:
    echo.
    echo 1. Репозиторий не создан на GitHub
    echo 2. Нет прав доступа к репозиторию
    echo 3. Нужна авторизация (GitHub попросит логин/пароль или токен)
    echo.
    echo 💡 Если репозиторий пустой на GitHub, попробуйте:
    echo    %GIT_EXE% push -u origin main --force
    echo.
    echo 💡 Или проверьте, что репозиторий создан:
    echo    https://github.com/Pasechkin/muse-site
    echo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════╗
echo ║  ✅ ГОТОВО! Проект загружен на GitHub  ║
echo ╚════════════════════════════════════════╝
echo.
echo 🔗 Ваш репозиторий:
echo    https://github.com/Pasechkin/muse-site
echo.
echo 🎉 Следующие шаги:
echo    1. Откройте репозиторий на GitHub и проверьте файлы
echo    2. Подключите к Vercel для деплоя:
echo       https://vercel.com → Import Project
echo.
pause


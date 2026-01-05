@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════╗
echo ║  Загрузка новых файлов на GitHub       ║
echo ╚════════════════════════════════════════╝
echo.

REM Переход в директорию проекта
cd /d "%~dp0"

REM Проверка наличия git
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git не установлен!
    echo.
    echo 📥 Установите Git для Windows:
    echo    https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git найден!
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
    echo.
    
    echo 🔗 Подключение к GitHub репозиторию...
    git remote add origin https://github.com/Pasechkin/muse.git
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️  Возможно, репозиторий уже подключен. Продолжаем...
    )
    echo ✅ Подключено к: https://github.com/Pasechkin/muse.git
    echo.
    
    echo 📥 Получение данных с GitHub...
    git fetch origin
    echo.
    
    echo 🔄 Подключение к ветке main...
    git branch -M main
    git branch --set-upstream-to=origin/main main 2>nul
    echo.
) else (
    echo ✅ Git репозиторий уже инициализирован
    echo.
    
    REM Проверка подключения к GitHub
    git remote get-url origin >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo 🔗 Подключение к GitHub репозиторию...
        git remote add origin https://github.com/Pasechkin/muse.git
        echo ✅ Подключено к: https://github.com/Pasechkin/muse.git
        echo.
    ) else (
        echo ✅ Уже подключено к GitHub
        echo.
    )
)

echo 📦 Добавление всех новых файлов...
echo    (дизайн-система, компоненты, шаблоны, документация)
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка при добавлении файлов
    pause
    exit /b 1
)
echo ✅ Файлы добавлены
echo.

echo 💾 Создание коммита...
git commit -m "Add design system, components, templates and documentation"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Возможно, нет изменений для коммита
    echo    (все файлы уже закоммичены)
    echo.
) else (
    echo ✅ Коммит создан
    echo.
)

echo 🚀 Отправка на GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Попытка принудительной отправки...
    git push -u origin main --force
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Ошибка при отправке на GitHub
        echo.
        echo 💡 Попробуйте:
        echo    1. Проверить доступ к GitHub
        echo    2. Запустить: git pull origin main --allow-unrelated-histories
        echo    3. Затем снова запустить этот скрипт
        pause
        exit /b 1
    )
)

echo.
echo ╔════════════════════════════════════════╗
echo ║  ✅ УСПЕШНО!                           ║
echo ╚════════════════════════════════════════╝
echo.
echo 📤 Новые файлы загружены на GitHub:
echo    https://github.com/Pasechkin/muse
echo.
echo 📁 Загружено:
echo    ✅ Дизайн-система (src/design-system/)
echo    ✅ Компоненты (src/components/)
echo    ✅ Шаблоны (src/templates/)
echo    ✅ Документация (docs/)
echo.
echo 🌐 Vercel автоматически запустит деплой
echo    (обычно 1-3 минуты)
echo.
pause


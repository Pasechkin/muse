@echo off
chcp 65001 > nul

set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"

echo ========================================
echo  ИСПРАВЛЕНИЕ ДЕПЛОЯ
echo ========================================
echo.

echo Шаг 1: Синхронизация файлов...
copy /Y "src\html\index_tailwind.html" "src\html\index.html" > nul
if %errorlevel% neq 0 (
    echo Ошибка при копировании файла!
    pause
    exit /b 1
)
echo ✅ Файлы синхронизированы
echo.

echo Шаг 2: Поиск Git...
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

echo Шаг 3: Добавление изменений...
"%GIT_PATH%" add src/html/index.html
if %errorlevel% neq 0 (
    echo Ошибка при добавлении файла!
    pause
    exit /b 1
)

echo.
echo Шаг 4: Создание коммита...
"%GIT_PATH%" commit -m "Fix: Синхронизация index.html с index_tailwind.html"
if %errorlevel% neq 0 (
    echo Внимание: Возможно, нет изменений для коммита.
)

echo.
echo Шаг 5: Отправка на GitHub...
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
echo Vercel автоматически запустит новый деплой.
echo.
echo Подождите 1-3 минуты и обновите страницу
echo в режиме инкогнито (Ctrl+Shift+N).
echo.
pause


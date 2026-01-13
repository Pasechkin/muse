@echo off
chcp 65001 >nul
echo ========================================
echo   Запуск сервера для мобильного теста
echo ========================================
echo.

echo Сборка CSS...
call npm run build:once
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Не удалось собрать CSS
    pause
    exit /b 1
)

call npm run copy-css
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Не удалось скопировать CSS
    pause
    exit /b 1
)

echo.
echo ========================================
echo   IP адреса вашего компьютера:
echo ========================================
ipconfig | findstr /i "IPv4"
echo.
echo ========================================
echo   Сервер запущен!
echo ========================================
echo.
echo Откройте на телефоне (в той же Wi-Fi сети):
echo   http://ВАШ_IP_АДРЕС:3000
echo.
echo Нажмите Ctrl+C для остановки
echo.
echo ========================================
echo.

npx http-server src/html -p 3000 -a 0.0.0.0 --cors













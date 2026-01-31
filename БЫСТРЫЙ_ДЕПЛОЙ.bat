@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 > nul

rem Console size (optional)
mode con: cols=120 lines=40
title FAST DEPLOY (VERCEL)

set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"

set "LOG_FILE=%CURRENT_DIR%deploy-log.txt"
echo [START] %date% %time%> "%LOG_FILE%"
echo FAST DEPLOY (VERCEL)>> "%LOG_FILE%"
echo WORKDIR: %CURRENT_DIR%>> "%LOG_FILE%"
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
echo  FAST DEPLOY (VERCEL)
echo ========================================
echo.

echo Step 1: Check npm...
echo [1] Check npm>> "%LOG_FILE%"
set "NPM_PATH="
where npm > nul 2> nul
if %errorlevel%==0 (
    set "NPM_PATH=npm"
)
if "%NPM_PATH%"=="" (
    for %%i in (
        "C:\Program Files\nodejs\npm.cmd"
        "C:\Program Files (x86)\nodejs\npm.cmd"
        "%USERPROFILE%\AppData\Local\Programs\nodejs\npm.cmd"
        "%USERPROFILE%\AppData\Roaming\npm\npm.cmd"
    ) do (
        if exist "%%~i" (
            set "NPM_PATH=%%~i"
            goto :found_npm
        )
    )
)
:found_npm
if "%NPM_PATH%"=="" (
    echo Error: npm not found!
    echo [ERR] npm not found>> "%LOG_FILE%"
    echo Install Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] npm: %NPM_PATH%>> "%LOG_FILE%"

echo.
echo Step 2: Build CSS...
echo [2] Build CSS (npm run build:once)>> "%LOG_FILE%"
call "%NPM_PATH%" run build:once
if %errorlevel% neq 0 (
    echo Error: CSS build failed!
    echo [ERR] CSS build failed>> "%LOG_FILE%"
    pause
    exit /b 1
)
echo [OK] CSS built>> "%LOG_FILE%"

echo.
echo Step 3: Copy CSS to html/css...
echo [3] Copy CSS (npm run copy-css)>> "%LOG_FILE%"
call "%NPM_PATH%" run copy-css
if %errorlevel% neq 0 (
    echo Error: CSS copy failed!
    echo [ERR] CSS copy failed>> "%LOG_FILE%"
    pause
    exit /b 1
)
echo [OK] CSS copied>> "%LOG_FILE%"

echo.
echo Step 4: Check Git...
echo [4] Check git>> "%LOG_FILE%"
set "GIT_PATH="
where git > nul 2> nul
if %errorlevel%==0 (
    set "GIT_PATH=git"
)
if "%GIT_PATH%"=="" (
    for %%i in (
        "C:\Program Files\Git\cmd\git.exe"
        "C:\Program Files (x86)\Git\cmd\git.exe"
        "%USERPROFILE%\AppData\Local\Programs\Git\cmd\git.exe"
    ) do (
        if exist "%%~i" (
            set "GIT_PATH=%%~i"
            goto :found_git
        )
    )
)
:found_git
if "%GIT_PATH%"=="" (
    echo Error: Git not found!
    echo [ERR] Git not found>> "%LOG_FILE%"
    echo Install Git: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git: %GIT_PATH%>> "%LOG_FILE%"
echo Git found
echo.

set "PRODUCTION_BRANCH=%VERCEL_PRODUCTION_BRANCH%"
if "%PRODUCTION_BRANCH%"=="" set "PRODUCTION_BRANCH=main"
for /f "delims=" %%b in ('"%GIT_PATH%" rev-parse --abbrev-ref HEAD') do set "CURRENT_BRANCH=%%b"
echo [INFO] Git branch: %CURRENT_BRANCH% (production: %PRODUCTION_BRANCH%)>> "%LOG_FILE%"
if /i not "%CURRENT_BRANCH%"=="%PRODUCTION_BRANCH%" (
    echo.
    echo WARNING: Current branch is "%CURRENT_BRANCH%".
    echo Vercel production URL updates only from the configured Production Branch.
    echo.
    choice /c YN /n /m "Push anyway? (Y/N): "
    if errorlevel 2 (
        echo [INFO] Deploy cancelled by user (wrong branch)>> "%LOG_FILE%"
        exit /b 2
    )
)

echo Step 5: Stage changes...
echo [5] git add .>> "%LOG_FILE%"
"%GIT_PATH%" add .
if %errorlevel% neq 0 (
    echo Error: git add failed!
    echo [ERR] git add failed>> "%LOG_FILE%"
    pause
    exit /b 1
)
echo [OK] Files staged>> "%LOG_FILE%"

echo.
echo Step 6: Check staged changes...
echo [6] git diff --cached --quiet>> "%LOG_FILE%"
"%GIT_PATH%" diff --cached --quiet
if %errorlevel%==0 (
    echo No changes to commit. Deploy skipped.
    echo Check that CSS build updated files.
    echo [INFO] No changes to commit>> "%LOG_FILE%"
    echo ========================================
    echo  DONE (NO DEPLOY)
    echo ========================================
    pause
    exit /b 0
)
echo [OK] Changes ready for commit>> "%LOG_FILE%"

echo.
echo Step 7: Commit...
echo [7] git commit>> "%LOG_FILE%"
set "DEFAULT_COMMIT_MSG=Update: beauty-art links + audit rules"
set "COMMIT_MSG="
set /p "COMMIT_MSG=Commit message (Enter = %DEFAULT_COMMIT_MSG%): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=%DEFAULT_COMMIT_MSG%"
"%GIT_PATH%" commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo Warning: commit not created. Check repo state.
    echo [ERR] git commit failed>> "%LOG_FILE%"
    pause
    exit /b 1
)
echo [OK] Commit created>> "%LOG_FILE%"

echo.
echo Step 8: Push to GitHub...
echo [8] git push>> "%LOG_FILE%"
"%GIT_PATH%" push
if %errorlevel% neq 0 (
    echo Error: git push failed!
    echo [ERR] git push failed>> "%LOG_FILE%"
    pause
    exit /b 1
)
echo [OK] Pushed>> "%LOG_FILE%"

echo.
echo ========================================
echo  SUCCESS
echo ========================================
echo [DONE] %date% %time%>> "%LOG_FILE%"
echo.
echo Changes pushed to GitHub.
echo Vercel will deploy automatically (1-3 min).
echo.
echo Check deploy status:
echo https://vercel.com/dashboard
echo.
echo Site will update at:
echo https://muse-liard-one.vercel.app/
echo.
pause
exit /b 0













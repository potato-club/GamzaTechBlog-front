@echo off
setlocal EnableDelayedExpansion

:: Get script directory
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%.."

:: Check for admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Requesting administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/k cd /d \"%PROJECT_DIR%\" && \"%~f0\"' -Verb RunAs"
    exit /b
)

set HOSTS_FILE=C:\Windows\System32\drivers\etc\hosts
set DOMAIN=dev.gamzatech.site
set IP=127.0.0.1
set ENTRY=%IP%    %DOMAIN%

echo.
echo [INFO] Current directory: %CD%
echo [INFO] Project directory: %PROJECT_DIR%
echo.

echo [INFO] Updating hosts file...

:: Remove any existing entry for the domain and add new one
powershell -Command "$hosts = @(Get-Content '%HOSTS_FILE%' | Where-Object { $_ -notmatch '%DOMAIN%' }); $hosts += '%ENTRY%'; $hosts | Out-File -FilePath '%HOSTS_FILE%' -Encoding ASCII"

if %errorlevel% neq 0 (
    echo [ERROR] Failed to update hosts file
    pause
    exit /b 1
)

echo [OK] Set: %ENTRY%

echo.
echo ========================================
echo   Starting Next.js dev server (HTTPS)
echo   URL: https://dev.gamzatech.site:3000
echo   Press Ctrl+C to stop
echo ========================================
echo.

:: Change to project directory and run dev server
cd /d "%PROJECT_DIR%"
echo [INFO] Running from: %CD%
echo.

call yarn next dev -H dev.gamzatech.site -p 3000 --experimental-https

:: Cleanup: Remove the hosts entry when server stops
echo.
echo [INFO] Cleaning up hosts file...
powershell -Command "$hosts = @(Get-Content '%HOSTS_FILE%' | Where-Object { $_ -notmatch '%DOMAIN%' }); $hosts | Out-File -FilePath '%HOSTS_FILE%' -Encoding ASCII"
echo [OK] Removed %DOMAIN% from hosts file.
echo.
echo Press any key to exit...
pause >nul

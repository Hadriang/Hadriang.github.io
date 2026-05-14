@echo off
setlocal

cd /d "%~dp0"
set "APP_URL=http://127.0.0.1:5173/"
set "APP_HOST=127.0.0.1"
set "APP_PORT=5173"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or not available in PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Dependencies are not installed.
  echo Run update-deps.bat first, then run this file again.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $response = Invoke-WebRequest -UseBasicParsing -Uri '%APP_URL%' -TimeoutSec 2; if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
if not errorlevel 1 (
  echo Esport Pro Stuff is already running.
  echo Opening %APP_URL% in your browser.
  start "" "%APP_URL%"
  exit /b 0
)

echo.
echo Starting Esport Pro Stuff...
echo Opening %APP_URL% in your browser.
echo Press Ctrl+C in this window to stop the server.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 2; Start-Process '%APP_URL%'" >nul 2>nul

call npx vite --host %APP_HOST% --port %APP_PORT% --strictPort

pause

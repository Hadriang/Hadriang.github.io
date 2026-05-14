@echo off
setlocal

cd /d "%~dp0"

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

echo.
echo Refreshing static ProSettings snapshot...
echo.

call npm run scrape
if errorlevel 1 (
  echo.
  echo Scrape failed. The snapshot was not refreshed successfully.
  pause
  exit /b 1
)

echo.
echo Scrape completed successfully.
echo If the site is already running, refresh the browser to see the new data.
pause

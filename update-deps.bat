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

echo.
echo Installing dependencies from package.json...
call npm install
if errorlevel 1 (
  echo.
  echo Dependency install failed.
  pause
  exit /b 1
)

echo.
echo Checking for dependency updates inside the allowed version ranges...
call npm outdated
if errorlevel 1 (
  echo.
  echo Updates are available. Running npm update...
  call npm update
  if errorlevel 1 (
    echo.
    echo Dependency update failed.
    pause
    exit /b 1
  )
) else (
  echo.
  echo Dependencies are already up to date.
)

echo.
echo Dependency setup completed successfully.
pause

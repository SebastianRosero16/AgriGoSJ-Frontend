@echo off
echo Installing dependencies for AgriGoSJ Frontend...
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    echo.
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed. Running npm install to verify...
    call npm install
)

echo.
echo Setup complete! You can now run:
echo   npm run dev     - Start development server
echo   npm run build   - Build for production
echo.
pause

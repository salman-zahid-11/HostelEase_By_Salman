@echo off
REM HostelEase Setup Script for Windows
REM This script sets up both Backend and Frontend for development

echo.
echo 🚀 Welcome to HostelEase Setup!
echo.

REM Backend Setup
echo 📦 Setting up Backend...
cd Backend
echo Installing dependencies...
call npm install

echo.
echo ⚙️  Configuring environment...
if not exist .env (
  copy .env.example .env
  echo ✓ Created .env file. Please update it with your MongoDB URI and other configurations.
) else (
  echo ✓ .env file already exists
)

echo.
echo 🌱 Seeding database...
call npm run seed

cd ..

REM Frontend Setup
echo.
echo 📦 Setting up Frontend...
cd Frontend
echo Installing dependencies...
call npm install

cd ..

echo.
echo ✅ Setup complete!
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd Backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd Frontend
echo   npm start
echo.
echo Then open http://localhost:4200 in your browser
echo.
echo Test Credentials:
echo   Student: akshit.verma@student.com / student123
echo   Warden: rajesh.warden@hostelenase.com / warden123
echo   Admin: admin@hostelenase.com / admin123
echo.
pause

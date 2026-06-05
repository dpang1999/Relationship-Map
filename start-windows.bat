@echo off
echo Starting Relationship Map App...
cd /d "%~dp0"

IF NOT EXIST "node_modules\" (
    echo First time setup - Installing dependencies...
    call npm install
    call npx prisma generate
    call npx prisma migrate dev --name init
)

echo Opening browser...
start http://localhost:3000

echo Starting server...
call npm run dev

pause

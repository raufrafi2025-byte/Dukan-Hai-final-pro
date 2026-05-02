echo Starting Dukan MERN Stack...
echo ---------------------------------------
echo 1. Starting Backend (Port 5000)...
start cmd /k "set PATH=%PATH%;C:\Program Files\nodejs\ && cd backend && node server.js"
echo 2. Starting Frontend (Port 5173)...
start cmd /k "set PATH=%PATH%;C:\Program Files\nodejs\ && cd frontend && npm run dev"
echo ---------------------------------------
echo Project is launching!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000
pause

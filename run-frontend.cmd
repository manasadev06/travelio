@echo off
cd /d "%~dp0frontend"
set BROWSER=none
set PORT=3000
"C:\Program Files\nodejs\node.exe" node_modules\react-scripts\scripts\start.js > frontend.runtime.log 2>&1

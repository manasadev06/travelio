@echo off
cd /d "%~dp0backend"
"C:\Program Files\nodejs\node.exe" index.js > backend.runtime.log 2>&1

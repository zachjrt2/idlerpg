@echo off
title Aegis Endless Launcher
cd /d "%~dp0"
python serve.py
if errorlevel 1 (
    echo.
    echo Python was not found in PATH or failed to start.
    echo Trying with py launcher...
    py serve.py
)
pause

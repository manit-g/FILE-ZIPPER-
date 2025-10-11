@echo off
REM Simple File Zipper - Drag and drop a file onto this script to compress it

if "%~1"=="" (
    echo.
    echo ========================================
    echo       FILE ZIPPER - COMPRESS
    echo ========================================
    echo.
    echo Usage: Drag and drop a file onto this script
    echo    OR: compress.bat yourfile.txt
    echo.
    pause
    exit /b
)

echo.
echo Compressing: %~nx1
echo.

python "%~dp0useHuffman.py" compress "%~1"

echo.
pause


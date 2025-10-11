@echo off
REM Simple File Zipper - Drag and drop a .bin file onto this script to decompress it

if "%~1"=="" (
    echo.
    echo ========================================
    echo       FILE ZIPPER - DECOMPRESS
    echo ========================================
    echo.
    echo Usage: Drag and drop a .bin file onto this script
    echo    OR: decompress.bat yourfile.bin
    echo.
    pause
    exit /b
)

echo.
echo Decompressing: %~nx1
echo.

python "%~dp0useHuffman.py" decompress "%~1"

echo.
pause


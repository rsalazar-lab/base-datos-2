@echo off
setlocal

:: 1. Obtener la fecha y hora actual de forma segura (Formato: AAAA-MM-DD_HH-MM-SS)
FOR /F "delims=" %%I IN ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'"') DO SET FECHA_ACTUAL=%%I

:: 2. Definir la ruta relativa solicitada en la consigna
SET RUTA_RESPALDO=.\resguardos_tpi\%FECHA_ACTUAL%

:: 3. Crear la estructura de directorios
if not exist "%RUTA_RESPALDO%" mkdir "%RUTA_RESPALDO%"

:: 3.1 Verificar que existe el archivo que contiene variables de entorno
if not exist ".env" (
    echo ERROR: No se encontro el archivo .env
    pause
    exit /b 1
)

:: 3.2 Cargar MONGODB_URI desde .env
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if "%%A"=="MONGODB_URI" set "MONGODB_URI=%%B"
)

:: 3.3 Verificar que la variable exista
if not defined MONGODB_URI (
    echo ERROR: MONGODB_URI no esta definida.
    pause
    exit /b 1
)

echo MONGODB_URI cargada correctamente.
echo ==================================================
echo Iniciando respaldo fisico de la base de datos...
echo Destino local: %RUTA_RESPALDO%
echo ==================================================

:: 4. Ejecutar la herramienta nativa mongodump conectandose remotamente a Atlas
mongodump --uri="%MONGODB_URI%" --db="gventas" --out="%RUTA_RESPALDO%"

if errorlevel 1 (
    echo ==========================================
    echo ERROR: No se pudo completar el respaldo.
    echo ==========================================
    pause
    exit /b 1
)

echo ==========================================
echo Respaldo completado correctamente.
echo Archivos en: %RUTA_RESPALDO%\gventas
echo ==========================================
pause
endlocal
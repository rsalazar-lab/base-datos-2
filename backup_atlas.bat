@echo off
setlocal

:: 1. Obtener la fecha y hora actual de forma segura (Formato: AAAA-MM-DD_HH-MM-SS)
FOR /F "delims=" %%I IN ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'"') DO SET FECHA_ACTUAL=%%I

:: 2. Definir la ruta relativa solicitada en la consigna
SET RUTA_RESPALDO=.\resguardos_tpi\%FECHA_ACTUAL%

:: 3. Crear la estructura de directorios
mkdir "%RUTA_RESPALDO%"

echo ==================================================
echo Iniciando respaldo fisico de la base de datos...
echo Destino local: %RUTA_RESPALDO%
echo ==================================================

:: 4. Ejecutar la herramienta nativa mongodump conectandose remotamente a Atlas
mongodump --uri="mongodb+srv://ronar76_db_user:LFvqxTl5T3snOolq@cluster0.mhoiwtn.mongodb.net/gventas" --out="%RUTA_RESPALDO%"

echo ==================================================
echo ¡Respaldo completado exitosamente!
echo Los archivos BSON y JSON se encuentran en: %RUTA_RESPALDO%\gventas
echo ==================================================
pause
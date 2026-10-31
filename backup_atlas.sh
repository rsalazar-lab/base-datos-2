#!/bin/bash

# 1. Obtener la fecha y hora actual para el nombre de la subcarpeta (Formato: AAAA-MM-DD_HH-MM-SS)
FECHA_ACTUAL=$(date +"%Y-%m-%d_%H-%M-%S")

# 2. Definir la ruta relativa solicitada en la consigna
RUTA_RESPALDO="./resguardos_tpi/$FECHA_ACTUAL"

# 3. Crear la estructura de directorios (-p asegura que cree la carpeta padre si no existe)
mkdir -p "$RUTA_RESPALDO"

echo "=================================================="
echo "Iniciando respaldo físico de la base de datos..."
echo "Destino local: $RUTA_RESPALDO"
echo "=================================================="

# 4. Ejecutar la herramienta nativa mongodump conectándose remotamente a Atlas
# Se utiliza tu cadena de conexión exacta y se especifica la base de datos gventas
mongodump --uri="mongodb+srv://ronar76_db_user:LFvqxTl5T3snOolq@cluster0.mhoiwtn.mongodb.net/gventas" --out="$RUTA_RESPALDO"

echo "=================================================="
echo "¡Respaldo completado exitosamente!"
echo "Los archivos BSON y JSON se encuentran en: $RUTA_RESPALDO/gventas"
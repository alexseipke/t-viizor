#!/bin/bash

echo "🚀 Actualizando t.viizor desde Lovable..."

# Configuración
REPO_URL="https://github.com/alexseipke/t-viizor.git"
DEV_DIR="/home/viizor-t/t-viizor-dev"
PROD_DIR="/home/viizor-t/htdocs/t.viizor.app"

# Si no existe el directorio de desarrollo, clonarlo
if [ ! -d "$DEV_DIR" ]; then
    echo "📥 Clonando repositorio por primera vez..."
    git clone $REPO_URL $DEV_DIR
    if [ $? -ne 0 ]; then
        echo "❌ Error al clonar el repositorio"
        exit 1
    fi
fi

# Ir al directorio y verificar estado
cd $DEV_DIR
echo "📍 Trabajando en: $(pwd)"

# Limpiar cualquier cambio local y obtener la última versión
echo "🧹 Limpiando cambios locales..."
git reset --hard HEAD
git clean -fd

echo "⬇️ Descargando últimos cambios..."
git fetch origin
git reset --hard origin/main

# Verificar si hay cambios recientes
LAST_COMMIT=$(git log -1 --pretty=format:"%h - %s (%cr)")
echo "📝 Último commit: $LAST_COMMIT"

# Verificar que el cambio específico esté presente
if grep -q "esto es t.viizor" src/pages/Index.tsx; then
    echo "✅ Cambio confirmado en el código fuente"
else
    echo "⚠️ El cambio no se encuentra en el código fuente"
    echo "🔍 Contenido actual del título:"
    grep -n -A3 -B1 "text-4xl.*font-bold" src/pages/Index.tsx || echo "No se encontró el título"
fi

# Limpiar cache de node_modules si existe
if [ -d "node_modules" ]; then
    echo "🧹 Limpiando cache de node_modules..."
    rm -rf node_modules package-lock.json
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# Limpiar dist anterior
echo "🧹 Limpiando compilación anterior..."
rm -rf dist

# Compilar proyecto
echo "🔨 Compilando proyecto..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error al compilar el proyecto"
    exit 1
fi

# Verificar que la compilación contiene el cambio
if grep -q "esto es t.viizor" dist/index.html; then
    echo "✅ Cambio confirmado en la compilación"
else
    echo "⚠️ El cambio no se encuentra en la compilación"
    echo "🔍 Buscando contenido relacionado en dist/index.html:"
    grep -i "viizor\|datos\|geoespaciales" dist/index.html || echo "No se encontró contenido relacionado"
fi

# Hacer backup de producción
echo "💾 Creando backup de producción..."
cp -r $PROD_DIR $PROD_DIR.backup.$(date +%Y%m%d_%H%M%S)

# Copiar archivos compilados a producción
echo "🚀 Desplegando a producción..."
cp -r dist/* $PROD_DIR/
if [ $? -ne 0 ]; then
    echo "❌ Error al copiar archivos a producción"
    exit 1
fi

# Verificar el despliegue
echo "🔍 Verificando despliegue..."
if grep -q "esto es t.viizor" $PROD_DIR/index.html; then
    echo "✅ ¡Despliegue exitoso! El cambio está en producción"
else
    echo "❌ El cambio no se encuentra en producción"
    echo "🔍 Contenido encontrado en producción:"
    grep -i "viizor\|datos\|geoespaciales" $PROD_DIR/index.html || echo "No se encontró contenido relacionado"
fi

echo "✅ ¡Actualización completada!"
echo "🌐 Tu app está disponible en: https://t.viizor.app"
echo "💡 Tip: Si no ves los cambios, prueba Ctrl+F5 para recargar sin cache"
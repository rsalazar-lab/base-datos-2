# base-datos-2

Proyecto Final Integrador de Bases de Datos 2

1. npm install //Instalar npm para correr en ambiente de desarrollo

2. node server.js //Inicializamos el servidor

# Si voy a utilizar pnpm, corro:

pnpm install
pnpm exec node server.js

# Es correcto que funcionen en puertos diferentes:

Backend/API: puerto 3001
Frontend/web estático: puerto 3000
En server.js está definido explícitamente:

app.listen(3001, () => {
console.log('Backend corriendo en http://localhost:3001');
});
Y en los archivos HTML las APIs apuntan a ese puerto:

const API_URL = 'http://localhost:3001/api/productos';
Por ejemplo, en tienda.html:

const API_URL_CLIENTES = 'http://localhost:3001/api/clientes';
const API_URL_PEDIDOS = 'http://localhost:3001/api/pedidos';

- El puerto 3000 es solamente para servir los archivos HTML. Puedes iniciarlo con:

  npx serve . -l 3000

Después accedes a:

http://localhost:3000/index.html
o:
http://localhost:3000/tienda.html

Y en otra terminal ejecutas:

node server.js

# Para crear y poblar completamente la base de datos, ejecuta:

node seed_relaciones.js

**Nota:** El script seed_relaciones.js solo debe ejecutarse para inicializar la base de datos.
Una vez cargados los datos, no es necesario volver a ejecutarlo, ya que la información permanece almacenada en MongoDB Atlas

# Para realizar el backup de la base de datos:

Si estas en Windows ejecutar en consola el siguiente comando:
./backup_atlas.bat

Si estas en Linux ejecutar en consola el siguiente comando:
./backup_atlas.sh

Lo que deberia suceder si la variable de entrono esta bien definida es que se crea una carpeta llamada "resguardos_tpi"
y dentro de ella se crea otra carpeta con la fecha y hora actual y dentro se almacenan los archivos correspondientes a la bdd.

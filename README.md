MovieStream en Mongo DB

## Que hace? 
- Lista peliculas con busqueda por título y filtro por género. Puede crear, editar o eliminar peliculas de la lista. Tambien tiene vista de detalle con historial de interacciones
- Busqueda de clientes por segmento. Igual que en las peliculas se pueden crear, editar, eliminar de la lista. La vista de detalle para los clientes es un historial de compras.
- El cambio de nombres de género, se hace un update completo a todas las peliculas que tienen conexión a este género. Maneja caso de eliminación de géneros con un mensaje de error. 

## Stack Tecnológico 
Node.js: ya había usado Render para deploy de backend usando Node y tuve una buena experiencia. También, como usé AI para generar el código, usar algo que ya conozco me da el espacio de poder proofread el código y hacer las correcciones necesarias.
EJS: no había trabajado con esto, pero después de investigar un poco también se me hizo una buena opcion, al ser un template sencillo que me iba a ahorrar la necesidad de API REST separada. 
Render y Netlify: como mencioné antes, ya había usado estos servicios anteriormente 


## Cómo correrlo desde cero

### 1. Requisitos
- Node.js 18+
- Una base de datos MongoDB

### 2. Clonar e instalar
#### git clone <moviestream>
#### cd moviestream
#### npm install


### 3. Configurar .env
Configurar el .env con MONGO_URI

### 4. Poblar la base de datos
Al correr seed.js con npm run seed se espera este output:
#### ✅ Connected to MongoDB
#### 🎭 Inserted 5 genres
#### 🎬 Inserted 20 movies
#### 👤 Inserted 15 customers
#### 📊 Inserted 22 interactions
#### 📑 Indexes created
#### 🎉 Seed complete!

### 5. Arrancar la app local
npm run dev

Se espera un output de 
# App en http://localhost:3000


La captura de pantalla de la app funcionando se encuentra en el root del proyecto con el nombre app-funcional :)


**URL pública**: `https://<tu-app>.onrender.com`

> Verificar desde una ventana de incógnito antes de entregar.

## Captura de pantalla

![MovieStream screenshot](./screenshot.png)


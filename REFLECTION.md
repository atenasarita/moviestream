### 1. Volviendo a empezar: ¿qué cambiaría?
Cambiaria principalmente la forma en que traté CUSTSALES. En el modelo de Oracle estaban como referencias puras por cust_id y movie_id, que no está mal para la cantidad de instancias que tiene pero cuando llego el momento de mostrar el historial de un cliente con el título de cada pelicula, tuve que hacer una segunda query para obtener los datos de la pelicula. Con la DB original en Oracle (SQL), eso es un JOIN de una sola lina

Me di cuenta que lo que me falto al inicio fue pensar más en como iba a funcionar esta parte del sistema y qué implicaría mostrar las interacciones con contexto de pelicula 

## 2. La conversación con el modelo: ¿qué se sintió forzado?
Si tuve problemas justo con la operacion que mencione en la respuesta anterior, mostrar el historial de compras de un cliente con el nombre de cada pelicula. 

En SQL solamente hubiera tenido que hacer un SELECT i.*, m.title FROM custsales i JOIN movie m ON i.movie_id = m.movie_id WHERE i.cust_id = X

¿Es ese dolor inherente a NoSQL o consecuencia de mi modelo? 
Creo que un poco de ambos. Es inherente porque MongoDB no tiene JOINs que funcionen como los de SQL lo haces, pero tambiénn es una consecuencia del modelo. Con esta experiencia me di cuenta que con Mongo DB debo cambiar un poco mi manera de pensar en diseño, hay que pensar en las queries antes de modelar, no al revés. 

## 3. ¿Fue NoSQL la mejor opción para MovieStream?
Creo que depende del uso. Comparando las partes donde NoSQL fue la mejor opción, por ejemplo, la tabla MOVIE de Oracle tiene atributos como Creo que depende del uso. Comparando las partes donde NoSQL no fue la mejor opción, por ejemplo, la tabla MOVIE de Oracle tiene atributos como CAST, CREW, AWARDS, NOMINATIONS como JSON o campos serializados. En MongoDB eso es un documento natural y no se tuvo que batallar con tablas de actores normalizadas.  

Pero en otras situaciones si creo que usar el modelo relacional hubiera sido lo mejor. En general, se maneja mejor la integridad referencial con ON DELETE CASCADE. 

Pero creo que al final usar MongoDB para este sistema es una buena opción. Para el manejo de catalogo de peliculas, que es una gran parte del sistema de MovieStream, NoSQL es un buena buena decisión

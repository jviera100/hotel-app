-- PostgreSQL commands
select * from reservas;
select * from usuarios;
select * from contactos;
select * from habitaciones;
select * from tiposhabitaciones;

DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS contactos;
DROP TABLE IF EXISTS habitaciones;
DROP TABLE IF EXISTS tiposhabitaciones;

-- Create the database
CREATE DATABASE reservas_hotel;

-- Create the table tiposhabitaciones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tiposhabitaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL
);

CREATE TABLE habitaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero INT NOT NULL,
    tipo_habitacion_id UUID REFERENCES tiposhabitaciones(id),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    disponibilidad BOOLEAN
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(50),
    foto VARCHAR(255)
);

CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha_reserva DATE,
    fecha_salida DATE,
    habitacion_id UUID REFERENCES habitaciones(id),
    cliente_id UUID REFERENCES usuarios(id)
);

CREATE TABLE contactos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100),
    email VARCHAR(100),
    mensaje TEXT
);

-- Insert data into the table tiposhabitaciones
INSERT INTO tiposhabitaciones (tipo) VALUES
('single'),
('double'),
('suite');

-- Insert 20 rows into the table habitaciones, ensuring they match the three existing types
INSERT INTO habitaciones (numero, tipo_habitacion_id, descripcion, precio, disponibilidad) VALUES
(101, 1, 'Single room with private bathroom.', 50.00, true),
(102, 1, 'Single room with garden view.', 55.00, true),
(103, 1, 'Single room with pool access.', 60.00, true),
(201, 2, 'Double room with two beds and garden view.', 80.00, true),
(202, 2, 'Double room with queen bed.', 85.00, true),
(203, 2, 'Double room with private balcony.', 90.00, true),
(204, 2, 'Double room with sea view.', 95.00, true),
(301, 3, 'Suite with living room and balcony with sea view.', 120.00, true),
(302, 3, 'Suite with jacuzzi and garden view.', 130.00, true),
(303, 3, 'Suite with kitchen and living room.', 140.00, true),
(304, 3, 'Suite with terrace and private pool.', 150.00, true),
(401, 1, 'Single room with bunk beds for children.', 70.00, true),
(402, 1, 'Single room accessible for disabled.', 65.00, true),
(403, 1, 'Single room with desk and ergonomic chair.', 75.00, true),
(501, 2, 'Double room with jacuzzi.', 100.00, true),
(502, 2, 'Double room with spa access.', 110.00, true),
(503, 2, 'Double room with living room.', 115.00, true),
(601, 3, 'Presidential suite with butler.', 200.00, true),
(602, 3, 'Executive suite with lounge access.', 180.00, true),
(603, 3, 'Family suite with two bedrooms.', 160.00, true);

-- Insert data into the table usuarios
INSERT INTO usuarios (username, email, password, tipo_usuario, foto) VALUES
('user1', 'user1@mail.com', 'p1', 'administrator', 'adam_feliz.jpg'),
('user2', 'user2@mail.com', 'p2', 'customer', 'adam.jpg'),
('user3', 'user3@mail.com', 'p3', 'customer', 'Danny.jpg'),
('user4', 'user4@mail.com', 'p4', 'customer', 'drama.jpg'),
('user5', 'user5@mail.com', 'p5', 'customer', 'evelien.jpg'),
('user6', 'user6@mail.com', 'p6', 'customer', 'jim.jpg'),
('user7', 'user7@mail.com', 'p7', 'customer', 'NOO.jpg'),
('user8', 'user8@mail.com', 'p8', 'customer', 'tony.jpg'),
('user9', 'user9@mail.com', 'p9', 'customer', 'yoda.jpg'),
('user10', 'user10@mail.com', 'p10', 'customer', 'adam.jpg');

-- -- Insert data into the table reservas => se inicia vacia la tabla y porque disponibilidad cambia al agregar, actualizar y eliminar, pero no sincroniza con reservas previas registradas
-- INSERT INTO reservas (fecha_reserva, fecha_salida, habitacion_id, cliente_id) VALUES
-- ('2024-05-10', '2024-05-15', 1, 1),
-- ('2024-05-12', '2024-05-18', 2, 2),
-- ('2024-05-14', '2024-05-20', 3, 3);

-- Insert data into the table contactos => funciona nodemailer y registro de tabala de contacto, se inicia vacia la tabla
-- INSERT INTO contactos (nombre, email, mensaje) VALUES
-- ('Juan', 'juan@example.com', 'I would like to make a reservation for the next weekend.'),
-- ('María', 'maria@example.com', 'Do you have availability for a double room?'),
-- ('Pedro', 'pedro@example.com', 'I would like to know more about the hotel services.');




paginacion y contar con un filtro donde el usuario podra filtrar por tipo y precio: having subquery in from union except rename 


SELECT *
FROM table1
INNER JOIN col_table2 ON table1.EMAIL1 = table2.EMAIL2;

----------------------------

SELECT *
FROM 
    usuarios u
JOIN 
    notas n
ON 
    u.email = n.email;

---------------------------    

SELECT 
    usuarios.email, 
    usuarios.nombre, 
    usuarios.edad, 
    notas.notas 
FROM 
    usuarios 
JOIN 
    notas 
ON 
    usuarios.email = notas.email;

-----------------------

SELECT 
    usuarios.*, 
    datos_contacto.telefono 
FROM 
    usuarios 
JOIN 
    datos_contacto 
ON 
    usuarios.email = datos_contacto.email;

-----------------------------    

Orden de cláusulas
COMANDO	SE LEE COMO:
SELECT	Selecciona estos datos.
FROM	De esta tabla.
JOIN	Únelos con esta tabla.
ON coincidir dato entre tablas
WHERE	Filtra los valores que cumplan tal condición.
GROUP BY	Agrupa los resultados por este criterio.
HAVING	Filtra por estos criterios agrupados.
ORDER BY	Ordena los resultados por este otro criterio.
LIMIT	Limita los resultados a esta cantidad.

---------------------

SELECT 
    usuarios.*, 
    notas.notas 
FROM 
    usuarios 
JOIN 
    notas 
ON 
    usuarios.email = notas.email 
WHERE 
    usuarios.email = 'juan.perez@example.com';

---------------------

SELECT 
    usuarios.*, 
    notas.* 
FROM 
    usuarios 
JOIN 
    notas 
ON 
    usuarios.email = notas.email 
WHERE 
    usuarios.email = 'juan.perez@example.com';

--------------------

SELECT 
    p.nombre, 
    SUM(v.cantidad) AS total_vendido
FROM 
    productos p
JOIN 
    ventas v ON p.productoid = v.productoid
GROUP BY 
    p.productoid, p.nombre
ORDER BY 
    total_vendido DESC
LIMIT 1;
-------------------------

SELECT 
    usuarios.email, 
    usuarios.nombre, 
    usuarios.edad, 
    notas.notas 
FROM 
    usuarios 
INNER JOIN 
    notas 
ON 
    usuarios.email = notas.email;
-----------------------
SELECT 
    empleados.email, 
    empleados.nombre, 
    empleados.edad, 
    departamentos.email, 
    departamentos.departamento
FROM 
    empleados 
RIGHT JOIN 
    departamentos 
ON 
    empleados.email = departamentos.email;

 ------------------------
 SELECT empleados.email, empleados.nombre, empleados.edad, departamentos.email AS email, departamentos.departamento
FROM empleados
RIGHT JOIN departamentos ON empleados.email = departamentos.email;

-------------------------------------------------
 SELECT productos.producto_id AS producto_id, productos.nombre, precios.precio_id, precios.producto_id AS producto_id, precios.precio
FROM productos
LEFT JOIN precios ON productos.producto_id = precios.producto_id;
------------------------------------------------
SELECT a.NOMBRE AS nombre_autor, l.TITULO AS titulo_libro  = lo que quiero mostrar con apodo
FROM autores a                                            = de tabla
INNER JOIN libros l ON a.ID = l.ID_AUTOR                  = unire columnas que estoy asociando con ON
WHERE l.ID_AUTOR IS NOT NULL;                            = NO NULO

-----------------------------------

SELECT estudiantes.nombre, inscripciones.curso, inscripciones.fecha
FROM estudiantes
NATURAL LEFT JOIN inscripciones;

--------------------------------

SELECT c1.nombre AS nombre_cliente, c2.nombre AS nombre_cliente_referente
FROM clientes c1
LEFT JOIN clientes c2 ON c1.id_cliente_referente = c2.id_cliente;
-----------------------------------
SELECT a1.nombre AS nombre, a2.nombre AS nombre_amigo_conectado
FROM amigos a1
JOIN amigos a2 ON a1.id_amigo_conectado = a2.id_amigo
WHERE a1.id_amigo_conectado IS NOT NULL;
------------------------------------

SELECT numero, pinta
FROM numeros
CROSS JOIN pintas
ORDER BY numero, pinta;

-----------------------------

PREGUNTA FINAL N° 154 CURSO 

SELECT u.EMAIL, COALESCE(COUNT(n.NOTAS), 0) AS CANTIDAD_NOTAS
FROM usuarios u
LEFT JOIN notas n ON u.EMAIL = n.EMAIL
GROUP BY u.EMAIL
ORDER BY 
  CASE WHEN COALESCE(COUNT(n.NOTAS), 0) = 0 THEN 1 ELSE 0 END, -- Ordena los usuarios sin notas al final
  u.EMAIL; -- Ordena el resto alfabéticamente por EMAIL

----------------------------


Guía útil para identificar el tipo de join
INNER JOIN (o JOIN)

Cuándo usarlo: Cuando necesitas sólo las filas donde haya coincidencias en ambas tablas.
Resultado: Devuelve solo las filas con datos correspondientes en ambas tablas.
LEFT JOIN (o LEFT OUTER JOIN)

Cuándo usarlo: Cuando necesitas todas las filas de la tabla de la izquierda y las filas coincidentes de la tabla de la derecha.
Resultado: Devuelve todas las filas de la tabla de la izquierda y las coincidencias de la tabla de la derecha, con NULLs donde no haya coincidencias.
RIGHT JOIN (o RIGHT OUTER JOIN)

Cuándo usarlo: Cuando necesitas todas las filas de la tabla de la derecha y las filas coincidentes de la tabla de la izquierda.
Resultado: Devuelve todas las filas de la tabla de la derecha y las coincidencias de la tabla de la izquierda, con NULLs donde no haya coincidencias.

Natural Join (o Natural INNER JOIN)
Ideas clave
Natural Join es un JOIN que adicionalmente asume que las columnas con el mismo nombre son las columnas de unión.
La ventaja de usar NATURAL JOIN es que simplifica la escritura de la consulta, pero solo es útil cuando las columnas de unión tienen el mismo nombre y tipo de datos en ambas tablas.

Natural Left Join
Ideas clave
Natural Join es un JOIN que adicionalmente asume que las columnas con el mismo nombre son las columnas de unión.
La ventaja de usar NATURAL JOIN es que simplifica la escritura de la consulta, pero solo es útil cuando las columnas de unión tienen el mismo nombre y tipo de datos en ambas tablas.
Así como para JOIN la opción de INNER es implícita, para NATURAL JOIN la opción de INNER también es implícita. y uno puede utilizar NATURAL INNER JOIN, NATURAL LEFT JOIN, NATURAL RIGHT JOIN.

Self Join
Un self join es un tipo de join en SQL que se utiliza para combinar una tabla consigo misma. Se usa cuando queremos relacionar filas de una tabla con otras filas de la misma tabla. Aunque el término "self join" se refiere a esta relación consigo misma, en la práctica se utilizan otros tipos de joins como INNER JOIN o LEFT JOIN para realizar esta operación.

Cross Join
El Cross Join, también conocido como producto cartesiano, combina cada fila de la primera tabla con cada fila de la segunda tabla, generando un conjunto de resultados que es el producto cartesiano de ambas tablas. Es útil cuando se desea combinar todas las filas de una tabla con todas las filas de otra tabla.

-------------------------


   






tabla remota neon

registros de inicio de sesion en bases de datos y de movimientos o transacciones
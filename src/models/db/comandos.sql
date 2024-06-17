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
CREATE TABLE tiposhabitaciones (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

-- Create the table habitaciones
CREATE TABLE habitaciones (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    tipo_habitacion_id INT REFERENCES tiposhabitaciones(id),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    disponibilidad BOOLEAN
);

-- Create the table usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(50),
    foto VARCHAR(255)
);

-- Create the table reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    fecha_reserva DATE,
    fecha_salida DATE,
    habitacion_id INT REFERENCES habitaciones(id),
    cliente_id INT REFERENCES usuarios(id)
);

-- Create the table contactos
CREATE TABLE contactos (
    id SERIAL PRIMARY KEY,
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









tabla remota neon

registros de inicio de sesion en bases de datos y de movimientos o transacciones
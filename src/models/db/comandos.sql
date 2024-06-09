--comandos postgre
select * from reservas
select * from usuarios
select * from contactos
select * from habitaciones
select * from tiposhabitaciones

DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS contactos;
DROP TABLE IF EXISTS habitaciones;
DROP TABLE IF EXISTS tiposhabitaciones;

-- Crear la tabla tiposhabitaciones
CREATE TABLE tiposhabitaciones (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

-- Crear la tabla habitaciones
CREATE TABLE habitaciones (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    tipo_habitacion_id INT REFERENCES tiposhabitaciones(id),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    disponibilidad BOOLEAN
);

-- Crear la tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(50),
    foto VARCHAR(255)
);

-- Crear la tabla reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    fecha_reserva DATE,
    fecha_salida DATE,
    habitacion_id INT REFERENCES habitaciones(id),
    cliente_id INT REFERENCES usuarios(id)
);

-- Crear la tabla contactos
CREATE TABLE contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    mensaje TEXT
);

-- Insertar datos en la tabla tiposhabitaciones
INSERT INTO tiposhabitaciones (tipo) VALUES
('simple'),
('Doble'),
('Suite');

-- Insertar 20 datos en la tabla habitaciones, asegurando que coincidan con los tres tipos existentes
INSERT INTO habitaciones (numero, tipo_habitacion_id, descripcion, precio, disponibilidad) VALUES
(101, 1, 'Habitación simple con baño privado.', 50.00, true),
(102, 1, 'Habitación simple con vista al jardín.', 55.00, true),
(103, 1, 'Habitación simple con acceso a la piscina.', 60.00, true),
(201, 2, 'Habitación doble con dos camas y vista al jardín.', 80.00, true),
(202, 2, 'Habitación doble con cama matrimonial.', 85.00, true),
(203, 2, 'Habitación doble con balcón privado.', 90.00, true),
(204, 2, 'Habitación doble con vista al mar.', 95.00, true),
(301, 3, 'Suite con sala de estar y balcón con vista al mar.', 120.00, true),
(302, 3, 'Suite con jacuzzi y vista al jardín.', 130.00, true),
(303, 3, 'Suite con cocina y sala de estar.', 140.00, true),
(304, 3, 'Suite con terraza y piscina privada.', 150.00, true),
(401, 1, 'Habitación simple con literas para niños.', 70.00, true),
(402, 1, 'Habitación simple accesible para discapacitados.', 65.00, true),
(403, 1, 'Habitación simple con escritorio y silla ergonómica.', 75.00, true),
(501, 2, 'Habitación doble con jacuzzi.', 100.00, true),
(502, 2, 'Habitación doble con acceso al spa.', 110.00, true),
(503, 2, 'Habitación doble con sala de estar.', 115.00, true),
(601, 3, 'Suite presidencial con mayordomo.', 200.00, false),
(602, 3, 'Suite ejecutiva con acceso al lounge.', 180.00, false),
(603, 3, 'Suite familiar con dos dormitorios.', 160.00, true);

-- Insertar datos en la tabla usuarios
INSERT INTO usuarios (username, email, password, tipo_usuario, foto) VALUES
('usuario1', 'usuario1@mail.com', 'contraseña1', 'cliente', 'adam_feliz.jpg'),
('usuario2', 'usuario2@mail.com', 'contraseña2', 'cliente', 'adam.jpg'),
('usuario3', 'usuario3@mail.com', 'contraseña3', 'cliente', 'Danny.jpg'),
('usuario4', 'usuario4@mail.com', 'contraseña4', 'cliente', 'drama.jpg'),
('usuario5', 'usuario5@mail.com', 'contraseña5', 'cliente', 'evelien.jpg'),
('usuario6', 'usuario6@mail.com', 'contraseña6', 'cliente', 'jim.jpg'),
('usuario7', 'usuario7@mail.com', 'contraseña7', 'cliente', 'NOO.jpg'),
('usuario8', 'usuario8@mail.com', 'contraseña8', 'cliente', 'tony.jpg'),
('usuario9', 'usuario9@mail.com', 'contraseña9', 'cliente', 'yoda.jpg'),
('usuario10', 'usuario10@mail.com', 'contraseña10', 'cliente', 'adam.jpg');

-- Insertar datos en la tabla reservas
INSERT INTO reservas (fecha_reserva, fecha_salida, habitacion_id, cliente_id) VALUES
('2024-05-10', '2024-05-15', 1, 1),
('2024-05-12', '2024-05-18', 2, 2),
('2024-05-14', '2024-05-20', 3, 3);

-- Insertar datos en la tabla contactos
INSERT INTO contactos (nombre, email, mensaje) VALUES
('Juan', 'juan@example.com', 'Quisiera hacer una reserva para el próximo fin de semana.'),
('María', 'maria@example.com', '¿Tienen disponibilidad para una habitación doble?'),
('Pedro', 'pedro@example.com', 'Me gustaría saber más sobre los servicios del hotel.');

# <h1 class="text-center"> ---- MODULE 8-Certification test. <br> Hotel Reservation Management System. ---- </h1>


 # Index of contents.

1. [requirements in english and spanish: ](#requirements-in-english-and-spanish)
2. [photos of requirements: ](#photos-of-requirements)
3. [ Development Languages and Tools: ](#tools)
4. [ project screenshots: ](#project-screenshots)
5. [Instalación: ](#instalación)
6. [Uso: ](#uso)
7. [Contribución](#contribución)
8. [Licencia](#licencia)
9. [Licencia](licencia.md)
10. [prueba](assets/documents/Prueba-JavaScript-01.pdf)


## Sección 1: requirements in english and spanish <a name="requirements-in-english-and-spanish"></a>

<details>
  <summary>Sección 1.A: requirements in english</summary>   
    <div>
        <p>
            Test hotel reservation management system. Congratulations on getting this far! This project is the pinnacle of everything you have learned so far in the course. Here, you will put your development skills to the test, to build a reservation management system that is functional, attractive and adaptable to different devices. The objective of this test is to develop a complete and dynamic web application that functions as a centralized hotel reservation management system. This system will allow users (administrator and guest) to efficiently manage all aspects related to reservations. Don't worry, you won't be alone. A team has been designated that will provide you with the necessary information to proceed with the development of the project: Detailed project information, flow diagram, physical model, wireframes at the end of the document. Functional system requirements: responsive fronted: use html, css (Bootstrap) and javascript to create a fronted that adapts to various devices, implement an intuitive design that facilitates navigation and user interactions. Data model: Users: detail such as username, email, password and user type. (Administrator, guest). Any user who registers will be a guest until they are changed to administrator. Rooms: information such as room type number (single, double or suite), description, price and availability. Reservations: Information about the reservation request, delivery dates, departure date, selected rooms and associated guest. Room types: types available, single double and suite. Contact: fields for name, email and message. Functionalities The root route must reach the home page, there must be a contact view with its respective form. If the user is not authenticated, they would not be able to enter the CRUD of /rooms and /reservations. If you try to access views other than home and contact, you will be redirected to the start section view. Upon authentication you will be sent to view/rooms. The login and register links will be displayed in the navigation bar if the user is not authenticated. By clicking on them, you will be redirected to your corresponding visits. If the user is authenticated, the username and a link to close the section will be displayed in the navigation bar. Which will redirect you to the start section view when you click on it, the /rooms view should show 10 of the available rooms through pagination and have a filter where the user can filter by type and price. Administrator users will be able to generate rooms from the /room/new view. But the guest type user only has permissions to view the list of available rooms. The /room/id view should show all the room information and allow reservations to be made using a form where the check-in date and check-out date will be inserted. There must be a list of /reservations in which the administrator user. You will have the list of reserved rooms and you will be able to manage the status of available rooms to occupied. Database: create a file called "reservas_hotel.sql" that contains the database creation process, the tables with their restrictions and relationships. Seed data: The creation of seed data for the project database tables is requested. This data can be included within the file, "reservas_hotel.sql" or in a separate file in CSV format called "reservas_hotel.csv". Non-functional requirements: project name: hotel_reservations. Fronted technologies: HTML, css, Bootstrap, JavaScript, jQuery, handlebars.js. Backend technologies: node.js, express, node.js libraries. Database: PostgreSQL, ORM, the use of an ORM is allowed for database connection and logic. Database name: hotel_reservations. Code organization: keep database connection logic separate in a file, keep database queries separate, keep server logic separate. Required files packet. json, packet-lock. json, readme.md. Individual development: the development of the test must be individual. Restrictions: it is prohibited to upload the code to Github or share it on platforms or with other students. Deliverables: compressed files: the source code of the project must be compressed in a file with the extension ".zip" if the file must have the name of the project "reservas_ hotel.zip", separated by underscores without spaces or capital letters, it is not You must not include either the ".git" folder or the "node_modules" folder in the zip file. SQL files: a file with a ".sql" extension must be included that contains the commands for creating the database, tables and inserting data. The file should be called "hotel reservations.sql" and should go inside the project folder. Readme.md: Readme.md file with the following sections: Project name, hotel reservation management system. Project Description: Use the requirements paragraph, screenshot of the project, include screenshots of the following views: home, registration, rooms, room/id, reservation/new. Prerequisites or dependencies to install. Project installation. Command to run the project. Command to load the database or look at the models. Command to load the seed data to the database. Access credentials according to user type, after loading the seed data: For administrator type user: email: administrator@mail.com password: Abc123·. For guest type user: email: huesped@mail.com password: Abc123·. You can use the following template as a reference to generate your readme.md file: https://github.com/brayandiazc/template-readme-es. Recommendations: requirements and deliverables: Carefully read each of the requirements and deliverables before starting. Folder Creation Create a folder with the name "hotel reservation" for your project. Project initialization with node.js: Initialize your project with node.js using the following command. npm init -y . Installation of the libraries: install the necessary libraries with the following command: npm install express, nodemon, libraries. Files A server.js file is generated to handle the server logic. Generate a db.js file for database configuration, database configuration, configure your connection to the PostgreSQL database. Use primary keys on all tables. ID serial primary key. Use foreign keys whenever necessary. Foreign key. Using git while developing the project. Gitignore file generates a gitignore file with the following configuration: Use of handlebars and Bootstrap: use of handlebars.js to work with templates and components in the views use the bootstrap components in conjunction with CSS to style your views you can find the documentation from Bootstrap: Add javascript dependencies to your project if necessary. 
        </p>
    </div>
</details>

<details>
  <summary>Sección 1.B: requirements in spanish</summary>  
    <div>
        <p>
            Prueba sistema de gestión de reservas para hotel. ¡Felicidades por llegar hasta aquí!. Este proyecto es el pináculo de todo lo que has aprendido hasta ahora en el curso. Aquí, pondrás a prueba tus habilidades de desarrollo, para construir un sistema de gestión de reservas que sea funcional, atractivo y adaptable a distintos dispositivos. El objetivo de esta prueba es desarrollar una aplicación web completa y dinámica que funcione como un sistema centralizado de gestión de reservas de hoteles. Este sistema permitirá a los usuarios (administrador y huésped) gestionar eficientemente todos los aspectos relacionados con las reservas. No te preocupes, no estarás solo. Se ha designado un equipo que te hará entrega de la información necesaria para proceder con el desarrollo del proyecto: Información detallada del proyecto, diagrama de flujo, modelo físico, wireframes al final del documento. Requerimientos funcionales del sistema: fronted responsivo: utilizar html, css (Bootstrap) y javascript para crear un fronted que se adapte a varios dispositivos, implementar un diseño intuitivo que facilite la navegación y las interacciones de los usuarios. Modelo de datos: Usuarios: detalle como nombre de usuario, correo electrónico, contraseña y tipo de usuario. (Administrador, huésped). todo usuario que se registre será un huésped hasta que se le cambie a administrador. Habitaciones: información como número de habitación tipo (simple, doble o suite) descripción, precio y disponibilidad. Reservas: información sobre la solicitud de reservas, fechas de entrega, fecha de salida, habitaciones seleccionadas y huésped asociado. Tipos de habitaciones: tipos disponibles, simple doble y suite. Contacto: campos para nombre, correo electrónico y mensaje. Funcionalidades la ruta a raíz debe llegar a la página de inicio, debe existir una vista de contacto con su respectivo formulario. Si el usuario no se encuentra autenticado, no podría ingresar al CRUD de /habitaciones y /reservas. Si trata de acceder a otras vistas diferentes a inicio y contacto será redireccionado a la vista de iniciar sección. Al autenticarse será enviado a la vista /habitaciones. Los enlaces de iniciar sesión y registrarse se mostrarán en la barra de navegación si el usuario no autenticado. Al pulsarlos, redireccionara a sus visitas correspondientes. Si el usuario está autenticado en la barra de navegación se mostrará su username y un enlace para cerrar sección. El cual lo redireccionará a la vista de iniciar sección al hacer clic en él, la vista de /habitaciones debe mostrar 10 de las habitaciones disponibles mediante paginación y contar con un filtro donde la el usuario podrá filtrar por tipo y precio. Los usuarios de tipo administrador podrán generar las habitaciones desde la vista /habitación/nueva. Pero el usuario de tipo huésped solo tiene permisos para visualizar el listado de habitaciones disponibles. La vista /habitación/id debe mostrar toda la información de la habitación y permitir hacer reservas mediante un formulario donde se insertarán la fecha de ingreso y la fecha de salida. Debe existir una lista de /reservas en la cual el usuario administrador. Tendrá el listado de las habitaciones reservadas y podrá gestionar el estado de las habitaciones disponibles a ocupada. Base de datos: crea un archivo llamado "reservas_ hotel.sql" que contenga el proceso de la creación de la base de datos, las tablas con sus restricciones y relaciones. Datos semilla: Se solicita la creación de datos semillas para las tablas de la base de datos del proyecto. Estos datos pueden estar incluidos dentro del archivo, "reservas_ hotel.sql"o en un archivo separado en formato CSV llamado "reservas_ hotel.csv".  Requerimientos no funcionales: nombre del proyecto: reservas_ hotel. Tecnologías fronted: HTML, css, Bootstrap, JavaScript, jQuery, handlebars.js. Tecnologías backend: node.js, express, librerías de node.js. Base de datos: PostgreSQL, ORM, se permite que el uso de un ORM para la conexión y lógica de la base de datos. Nombre de la base de datos: reservas_ hotel. Organización del código: mantener separada a la lógica de conexión a la base de datos en un archivo, mantener separadas las consultas a la base de datos, mantener separada la lógica del servidor. Archivos requeridos packet. json, packet-lock. json, readme.md. Desarrollo individual: el desarrollo de la prueba debe ser individual. Restricciones: se prohíbe subir el código a Github o compartirlo en plataformas o con otros estudiantes. Entregables: archivos comprimido: el código fuente del proyecto debe estar comprimido en un archivo con la extensión ".zip" si el archivo debe llevar el nombre del proyecto "reservas_ hotel.zip", separado por guiones bajos sin espacios ni mayúscula, no se debe incluir la carpeta ".git" ni la carpeta "node_modules" en el archivo comprimido. Archivos SQL: se debe incluir un archivo con extensión ".sql" que contenga los comandos para la creación de la base de datos, tablas e inserción de datos. El archivo debe llamarse "reservas hotel.sql" Y debe ir dentro de la carpeta del proyecto. Readme.md: Archivo readme.md con las siguientes secciones: Nombre del proyecto, sistema de gestión de reservas para hotel. Descripción del proyecto: utiliza el párrafo de objetivos, captura de pantalla del proyecto, incluir capturas de pantalla de las siguientes vistas: home, registro, habitaciones, habitación/id, reserva/nueva. Prerequisitos o dependencias a instalar. Instalación del proyecto. Comando para ejecutar el proyecto. Comando para cargar la base de datos o mirar los modelos. Comando para cargar los datos semilla a la base de datos. Credenciales de acceso según tipo de usuario, luego de cargar los datos semilla: Para usuario de tipo administrador: email: administrador@mail.com contraseña: Abc123·. Para usuario tipo huésped: email: huesped@mail.com contraseña: Abc123·. Puedes usar la siguiente plantilla como referencia para generar tu archivo readme.md: https://github.com/brayandiazc/template-readme-es. Recomendaciones: requerimientos y entregables: Lee cuidadosamente cada uno de los requerimientos y entregables antes de comenzar. Creación de la carpeta crea una carpeta con el nombre de "reserva hotel" para tu proyecto. Inicialización del proyecto con node.js: inicializa tu proyecto con node.js usando el siguiente comando. npm init -y . Instalación de las librerías: instalar las librerías necesarias con el siguiente comando: npm install express, nodemon, librerías. Archivos se genera un archivo server.js para manejar la lógica del servidor. Genera un archivo db.js para la configuración de la base de datos, configuración de la base de datos, configurar tu conexión a la base de datos PostgreSQL. Utiliza llaves primarias en todas las tablas. ID serial primary key. Usa las llaves foráneas siempre que sean necesarias. Foreign key. Uso de git mientras estás desarrollando el proyecto. Archivo gitignore genera un archivo gitignore con la siguiente configuración: Uso de handlebars y Bootstrap: uso de handlebars.js para trabajar con plantillas y componentes en las vistas utiliza los componentes de bootstrap en conjunto con CSS para dar estilos a tus vistas puedes encontrar la documentación de Bootstrap:. Agrega las dependencias de javascript a tu proyecto de ser necesarias.  
        </p>
    </div>
</details>

## Sección 2: photos of requirements <a name="photos-of-requirements"></a>

<details>
  <summary>Sección 2: photos of requirements</summary>
    <div>
        <img src="./assets/img/1_1.jpg" alt="">
        <img src="./assets/img/1_2.jpg" alt="">
        <img src="./assets/img/1_3.jpg" alt="">
        <img src="./assets/img/1_4.jpg" alt="">
        <img src="./assets/img/1_5.jpg" alt="">
        <img src="./assets/img/1_6.jpg" alt="">
        <img src="./assets/img/1_7.jpg" alt="">
    </div>
</details>

## Sección 3:  👨🏽‍💻Development Languages and Tools:  <a name="tools"></a>

<details>
  <summary>Sección 3:  👨🏽‍💻Development Languages and Tools: </summary>  
    <div>
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/html.svg"> &nbsp;
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/css.svg"> &nbsp;
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/javascript.svg"> &nbsp; &nbsp;
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/git.svg"> &nbsp; &nbsp;
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/github-icon-1.svg"> &nbsp; &nbsp; 
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/node.svg"> &nbsp; &nbsp; 
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/npm-square-red-1.svg"> &nbsp; &nbsp; 
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/toptal-logo-wordmark.svg"> &nbsp; &nbsp;  
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/visual-studio-code-1.svg"> &nbsp; &nbsp; 
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/dbeaver-head.png"> &nbsp; &nbsp; 
        <img width="70px" 
        height="70px" 
        style="margin: 10px"
        src="./assets/img/jwtio-json-web-token.svg"> &nbsp; &nbsp; 
    </div>
</details>

## Sección 4: project screenshots <a name="project-screenshots"></a>

<details>
  <summary>Sección 4: project screenshots </summary>
    <div>        
        ### Home.hbs
        <img src="./assets/img/2_1.jpg" alt="Home">
        ### Registro.hbs
        <img src="./assets/img/2_2.jpg" alt="Registro">        
        ### Login.hbs
        <img src="./assets/img/2_3.jpg" alt="Login">
        ### Contacto.hbs
        <img src="./assets/img/2_4.jpg" alt="Contacto">
        ### Admin.hbs
        <img src="./assets/img/2_5.jpg" alt="Admin">        
        ### Customer.hbs
        <img src="./assets/img/2_6.jpg" alt="Customer">        
        ### Perfil.hbs
        <img src="./assets/img/2_7.jpg" alt="Perfil">
        ### AddReservation.hbs
        <img src="./assets/img/2_8.jpg" alt="AddReservation">        
        ### AddRoom.hbs
        <img src="./assets/img/2_9.jpg" alt="AddRoom">        
        ### Undefined.hbs
        <img src="./assets/img/2_10.jpg" alt="Undefined">
    </div>
</details>


## Sección 4: Instalación <a name="instalación"></a>

<details>
  <summary>Sección 4: Instalación</summary>
  
  Aquí va el contenido de la instalación.

</details>

## Sección 5: Uso <a name="uso"></a>

<details>
  <summary>Sección 5: Uso</summary>
  
  Aquí va el contenido del uso.

</details>

## Sección 6: Contribución <a name="contribución"></a>

<details>
  <summary>Sección 6: Contribución</summary>
  
  Aquí va el contenido de la contribución.

</details>

## Sección 7: Licencia <a name="licencia"></a>

<details>
  <summary>Sección 7: Licencia</summary>
  
  Aquí va el contenido de la licencia.
  
</details>















   


<br>
🚀[token](https://m8d35Hotel.onrender.com)
<br>
# folder structure => model view controller (MVC)
👨🏽‍💻
<Hr>
    <img src="./assets/img/photo_MVC_backend_and_fronted.png" alt="">
    <img src="./assets/img/photo_ApiRestFull_requestsHTTP_CRUD.png" alt="">  
<hr>
www.desafiolatam.com
<br> 





<p>
    Definición de rutas y controladores para una API RESTful utilizando Node.js y Express. Aquí hay un resumen de lo que hace cada controlador:

    homeControl: Renderiza la página de inicio (Home) con botones de navegación dependiendo del estado de autenticación del usuario.
    getContactoControl: Renderiza la página de contacto.
    enviarContactoControl: Procesa el formulario de contacto y envía un mensaje de confirmación al cliente por correo electronico.
    addUsuarioControl: Procesa el formulario de registro de usuario, guarda la imagen de perfil en el servidor y agrega el usuario a la base de datos.
    registroControl: Renderiza la página de registro de usuario.
    getLoginControl: Renderiza la página de inicio de sesión.
    postLoginControl: Procesa el formulario de inicio de sesión, verifica las credenciales del usuario y crea un token JWT para la autenticación.
    habitacionesControl: Renderiza la página de habitaciones disponibles para un usuario autenticado, mostrando también las reservas realizadas por el usuario.
    reservarHabitacionControl: Controla la reserva de una habitación específica por parte de un usuario.
    getPerfil: Renderiza la página de perfil de usuario, mostrando los datos del usuario y permitiendo su edición.
    updatePerfilControl: Procesa la actualización del perfil de usuario, incluida la opción de cambiar la imagen de perfil.
    deletePerfilControl: Elimina el perfil de usuario y sus datos asociados (reservas).
    getAdminInicio: Renderiza la página de inicio de administrador, mostrando información sobre usuarios, reservas y habitaciones.
    getPerfilModalAdmin: Obtiene los datos del perfil de usuario para mostrarlos en un modal administrativo.
    putStatusAdmin: Actualiza el estado de un usuario (por ejemplo, activo o inactivo) en el panel de administración.
    registroAdminControl: Renderiza la página de registro para administradores.
    logoutControl: Controla el cierre de sesión del usuario, eliminando la cookie del token y redirigiendo al usuario a la página de inicio de sesión.
    Cada controlador realiza operaciones específicas en función de las rutas y los métodos HTTP solicitados. ¿Hay algún controlador en particular sobre el que te gustaría saber más?
</p>
<p>
    Este archivo JavaScript, consultasSQL.js, parece ser un módulo que maneja consultas SQL para interactuar con una base de datos. Veamos su estructura y funcionalidad:

    Importaciones: El módulo importa un objeto pool desde "../models/config/db.js". Esto probablemente representa un grupo de conexiones a la base de datos, comúnmente utilizado en aplicaciones Node.js para gestionar conexiones de base de datos de manera eficiente.

    Funciones:

    addUsuarioQuery: Inserta un nuevo registro de usuario en la tabla usuarios y devuelve los datos del usuario insertado.
    getUsuariosQuery: Recupera todos los registros de usuarios de la tabla usuarios.
    getReservasQuery: Recupera datos de reservas, incluyendo el id de la reserva, fecha de reserva, fecha de salida, número de habitación y nombre de usuario del cliente.
    getReservasUsuarioQuery: Recupera datos de reservas para un usuario específico identificado por su dirección de correo electrónico.
    getHabitacionesQuery: Recupera todos los registros de habitaciones de la tabla habitaciones.
    getHabitacionesDisponiblesQuery: Recupera registros de habitaciones disponibles junto con sus detalles de la tabla habitaciones.
    getHabitacionesNoDisponiblesQuery: Recupera registros de habitaciones no disponibles junto con sus detalles de la tabla habitaciones.
    getUsuarioByEmailQuery: Recupera un registro de usuario de la tabla usuarios basado en la dirección de correo electrónico proporcionada.
    updateUsuarioByEmailQuery: Actualiza un registro de usuario en la tabla usuarios basado en la dirección de correo electrónico proporcionada y los campos actualizados.
    deleteUsuarioByEmailQuery: Elimina un registro de usuario de la tabla usuarios basado en la dirección de correo electrónico proporcionada.
    setUsuarioStatus: Actualiza el estado de disponibilidad de una habitación en la tabla habitaciones.
    Manejo de Errores: Cada función incluye bloques try-catch para manejar los errores que puedan ocurrir durante la ejecución de la consulta. Los errores se registran en la consola y se vuelven a lanzar para ser manejados por el llamador.

    Registro: El módulo incluye un registro extenso utilizando declaraciones console.log y console.error para registrar el flujo de ejecución, detalles de la consulta, resultados y errores.

    Exportaciones: Todas las funciones se exportan del módulo para su uso en otras partes de la aplicación.

    En resumen, este módulo proporciona un conjunto de funciones para realizar diversas operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en datos de usuarios y habitaciones en la base de datos. Las declaraciones de registro ayudan en la depuración y monitorización del flujo de ejecución de estas operaciones.
</p>
<p>
    Este archivo routes.js parece definir las rutas para una aplicación web utilizando Express.js. Veamos qué hace cada ruta:

    Importaciones: Se importan varios controladores y middleware desde el archivo ApiRestFull.js y token.js. Estos controladores probablemente manejan la lógica de la aplicación y el middleware maneja la autenticación de tokens JWT.
    
    Configuración de Rutas:
    
    Se define una instancia de Router de Express.
    Se registran las rutas utilizando los métodos get y post del router.
    Registro de Rutas:
    
    La ruta principal '/' lleva al controlador homeControl.
    Hay rutas para el registro de usuarios, el inicio de sesión y las operaciones relacionadas con el perfil del usuario.
    Las rutas relacionadas con el perfil del usuario requieren un token JWT para la autenticación (verifyToken).
    También hay rutas específicas para las operaciones de administrador, como cambiar el estado de un usuario y registrarse como administrador.
    Hay una ruta para cerrar sesión ('/logout').
    Finalmente, hay rutas para la página de contacto y enviar un mensaje de contacto.
    Registro de Configuración: Se utilizan declaraciones console.log para registrar el inicio y la finalización de la configuración de las rutas.
    
    Exportación: El router configurado se exporta para su uso en otros archivos de la aplicación.
    
    En resumen, este archivo define las rutas y las asocia con los controladores correspondientes para manejar las solicitudes HTTP entrantes en la aplicación web. También gestiona la autenticación de tokens JWT para ciertas rutas que requieren autenticación de usuario.
</p>

# Estructura de Directorios de my_project🚀

Este proyecto tiene una estructura organizada en directorios para manejar diferentes aspectos como estilos, scripts, imágenes, bases de datos y vistas. Reutilizable, asegúrate de ajustar los nombres de los archivos y directorios según tu proyecto específico.

Este repositorio contiene los archivos y directorios siguientes:

1. Crear la BBDD
2. Crear las tablas
3. levantar el proyecto
4. crear el index
5. crear el package.json
6. configurar el package.json
7. Instalar las depenciencias
8. conectar la BBDD
9. crear el repositorio local y remoto
10. crear el gigignore
11. guardar el primer y hacer push
12. levantar el servidor
13. disponibilizar el archivo principal

...
<Hr>
    <img src="./assets/img/folder_structure.jpg" alt="">      
<hr>

- m8d35Hotel/
  - ├── assets/
  - │   ├── css/
  - │   │    ├── alerta-bootstrap.css
  - │   │    ├── body.css
  - │   │    ├── card.css
  - │   │    ├── carousel.css
  - │   │    ├── modal.css
  - │   │    └── navbar.css
  - │   ├── js/
  - │   │    ├── alert-tooltip.js
  - │   │    ├── api.js
  - │   │    ├── button-pdf.js
  - │   │    ├── card.js
  - │   │    ├── color-change-title.js
  - │   │    ├── image-rotation.js
  - │   │    ├── navbar-toggler-rotation.js
  - │   │    └── parpadea-blinking-fadetoggle.js
  - │   ├── img/
  - │   │    ├── 1.jpg
  - │   │    └── 2.jpg
  - │   └── documents/
  - │             ├── comandos-node-npm-express-json.md
  - │             └── Prueba-JavaScript-01.pdf
  - ├── middlewares/
  - │             ├── middlewares.js
  - │             └── token.js
  - ├── node_modules/
  - ├── routes/
  - │        └── routes.js   
  - ├── src/
  - │   ├── controllers/
  - │   │             └── ApiRestFull.js
  - │   ├── models/
  - │   │        ├── config/
  - │   │        │        └── db.js
  - │   │        └── db/
  - │   │             └── comandos.sql
  - │   ├── queries/
  - │   │         └── consultas.js
  - │   └── views/
  - │           ├── layouts/
  - │           │         └── main.hbs
  - │           ├── partials/
  - │           │         ├── footer.hbs
  - │           │         └── menu.hbs
  - │           ├── AddReservation.hbs
  - │           ├── AddRoom.hbs
  - │           ├── Admin.hbs
  - │           ├── contacto.hbs
  - │           ├── Customer.hbs
  - │           ├── Home.hbs
  - │           ├── Login.hbs
  - │           ├── Perfil.hbs
  - │           ├── Registro.hbs  
  - │           └── undefined.hbs
  - ├── .env
  - ├── .gitignore
  - ├── index.js
  - ├── package-lock.json
  - ├── package.json
  - └── README.md

<hr>

## Descripción de Directorios Principales

- **assets/**: Contiene recursos como archivos de hojas de estilo CSS, scripts JS, imágenes y documentos.
- **middlewares/**: Middlewares para la aplicación y de token.
- **node_modules/**: Módulos de Node.js utilizados en el proyecto.
- **routes/**: Rutas de la aplicación y de configuración de envío de correos electrónicos.
- **src/**: contiene carpetas controller, model, queries y views.
- - **controller/**: Controladores que manejan las solicitudes de la aplicación.
- - **model/**: Modelos de datos para la aplicación. Contiene las carpetas db y config.
- - - **config/**: contiene archivo db.js para la conexión a la base de datos.
- - - **db/**: Contiene los comandos para crear la base de datos local en postgre.
- - **queries/**: Archivos de consultas sql para la base de datos.
- - **views/**: Vistas de la aplicación, incluyendo páginas, diseños y parciales.

## Otros Archivos y Directorios

- **.env**: Archivo de configuración de variables de entorno.
- **.gitignore**: Archivo para especificar qué archivos y directorios se deben ignorar en Git.
- **index.js**: Archivo principal de la aplicación.
- **package-lock.json**: Archivo de bloqueo de versiones de las dependencias de Node.js.
- **package.json**: Archivo de configuración del proyecto Node.js.
- **README.md**: Este archivo de documentación.



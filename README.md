# GAINSCLOUD - Backend API

Servidor robusto construido con **Node.js** y **Express** para la gestión de entrenamientos, rutinas personalizadas y seguimiento de hábitos de salud. Utiliza **MySQL** como base de datos relacional.

## Tecnologías Principales
* **Runtime**: Node.js 
* **Framework**: Express
* **Base de Datos**: MySQL (Pool de conexiones con `mysql2`)
* **Seguridad**: JWT (JSON Web Tokens) y Bcrypt para hashing de contraseñas
* **Entorno**: Dotenv para variables de configuración [cite: 125]

## Instalación y Configuración

1. Clonar el repositorio.
2. Instalar dependencias:
   ```npm install```
3. Crear un archivo .env basado en el siguiente esquema
PORT=3005
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base_de_datos
JWT_SECRET=tu_clave_secreta
4. Iniciar el servidor: 
``` npm start ```

## Módulos en Desuso (Legacy / Desarrollo)

Los siguientes módulos permanecen en el código pero no se están usando, ya que se usarán cuando la App crezca y se perfeccionen:

1.  **Workouts (`/workouts`)**: Lógica para registrar sesiones de entrenamiento en vivo (fecha, feeling y series realizadas). Aunque los controladores para crear (`POST`), listar (`GET`) y borrar (`DELETE`) están operativos, el frontend ha desactivado esta funcionalidad.
2.  **Progress (`/progress`)**: Endpoint que calcula el progreso del peso promedio levantado por entrenamiento. Depende directamente de los datos generados en el módulo de *workouts*.
3.  **Routine Exercises (`/routines/exercises`)**: Controlador para añadir ejercicios detallados a una rutina. Está inactivo si el usuario solo define el nombre y los días de la rutina.
4.  **Feedback de Intensidad**: Lógica dentro del Dashboard que sugiere cambios en el entrenamiento basados en los últimos 7 días. Al no registrarse entrenamientos, esta sugerencia no se activará.

## Estructura del proyecto
```
finalproject-back/
├── node_modules/
├── src/
│   ├── controllers/
│   │   ├── dashboardController.js
│   │   ├── exerciseController.js
│   │   ├── habitsController.js
│   │   ├── objectivesController.js
│   │   ├── progressController.js
│   │   ├── routineExerciseController.js
│   │   ├── userController.js
│   │   └── workoutsController.js
│   ├── models/
│   │   ├── Dashboard.js
│   │   ├── Exercise.js
│   │   ├── Habit.js
│   │   ├── Objective.js
│   │   ├── Progress.js
│   │   ├── Routine.js
│   │   ├── RoutineExercise.js
│   │   ├── User.js
│   │   └── Workout.js
│   ├── routes/
│   │   ├── dashboard.js
│   │   ├── exercises.js 
│   │   ├── habits.js
│   │   ├── objectives.js
│   │   ├── progress.js
│   │   └── routines.js
│   │   └── users.js
│   │   └── workouts.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
│   └── db.js
├── .env
└── package.json 
```

## Endpoints de la API 

### Usuarios y Autenticación (`/users`)
* **POST /register**: Registra un nuevo usuario en el sistema. Genera y devuelve un token de acceso JWT para iniciar sesión automáticamente.
* **POST /login**: Autentica al usuario comparando la contraseña encriptada. Si es correcto, genera un token JWT.
* **GET /profile**: Obtiene la información del perfil (nombre, plan, edad, objetivo) del usuario autenticado a través del token.
* **PUT /update-plan**: Permite cambiar el plan del usuario entre 'free' y 'premium'.
* **PUT /downgrade**: Cambia el plan del usuario específicamente a 'free'.

### Dashboard e Inteligencia (`/dashboard`)
* **GET /**: Devuelve un resumen global del usuario. Incluye estadísticas de ejercicios, objetivo actual, última actividad y un **mensaje inteligente del coach** basado en hábitos como el sueño o la hidratación.
* **GET /tips**: Endpoint que recupera la misma lógica de mensajes personalizados y sugerencias de entrenamiento.

### Rutinas (`/routines`)
* **GET /**: Lista todas las rutinas creadas por el usuario, incluyendo los días de la semana asignados a cada una.
* **POST /**: Crea una nueva rutina y vincula los días correspondientes en la base de datos.
* **GET /:id**: Detalle completo de una rutina específica, incluyendo sus días y la lista de ejercicios asociados con sus series y repeticiones.
* **DELETE /:id**: Elimina una rutina de forma permanente, junto con sus días y ejercicios asociados.

### Hábitos y Objetivos (`/habits` / `/objectives`)
* **GET /habits**: Recupera los hábitos de salud (sueño, agua, tabaco, alcohol) registrados por el usuario.
* **POST /habits**: Crea o actualiza (upsert) los datos de hábitos diarios.
* **GET /objectives**: Lista todos los objetivos fitness disponibles en el sistema.
* **GET /objectives/user**: Devuelve el objetivo específico que tiene asignado el usuario actualmente.
* **PUT /objectives**: Actualiza el objetivo principal del usuario.

---

## Base de Datos
La conexión se gestiona mediante un **Pool de conexiones** de MySQL (`mysql2/promise`).
* **Seguridad**: Se utiliza SSL para permitir conexiones seguras con servicios externos (como Aiven).
* **Variables**: Configuración dinámica mediante archivo `.env` (Host, User, Password, Port).

## Despliegue

El backend está desplegado con Render, y la base de datos con Aiven.

## Autora

Mónica Serrano Salazar
Proyecto Final Bootcamp Fullstack The Bridge

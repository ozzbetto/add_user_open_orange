# Remisiones IT TOCSA S.A. - Management System

## 🇬🇧 English Version

### Project Description
This is a full-stack web application (MEAN stack: MongoDB, Express.js, Angular, Node.js) designed to manage and generate delivery notes (Remisiones) for **IT TOCSA S.A.** The system allows creating, listing, and downloading PDF documents for equipment transfers.

### Features
*   **Remission Management:** Create, edit, and view delivery notes.
*   **Automatic PDF Generation:** Generate official documents on-the-fly using `pdfmake`.
*   **Sequential Numbering:** Automatic tracking of remission numbers.
*   **Responsive UI:** Built with Angular and PrimeNG for a modern look.
*   **Dockerized:** Ready for easy deployment with Docker Compose.

---

### Installation Requirements

#### For Development (Local)
*   **Node.js:** v20 or higher.
*   **MongoDB:** A local instance or a cloud URI (Atlas).
*   **Git:** To clone the repository.

**Steps:**
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd remisiones-it-tocsa
    ```
2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```
4.  Access the app at `http://localhost:4200`.

#### For Production (Server)
*   **Docker** & **Docker Compose** installed on the server.

**Steps:**
1.  Copy the project folder to the server.
2.  Run the following command in the root directory:
    ```bash
    docker-compose up -d --build
    ```
3.  The application will be available at `http://<server-ip>:3000`.

---

## 🇪🇸 Versión en Español

### Descripción del Proyecto
Esta es una aplicación web de pila completa (MEAN: MongoDB, Express.js, Angular, Node.js) diseñada para gestionar y generar notas de remisión para **IT TOCSA S.A.** El sistema permite crear, listar y descargar documentos PDF para el traslado de equipos.

### Características
*   **Gestión de Remisiones:** Crear, editar y visualizar notas de remisión.
*   **Generación de PDF Automática:** Genera documentos oficiales al instante usando `pdfmake`.
*   **Numeración Secuencial:** Seguimiento automático de números de remisión.
*   **Interfaz Responsiva:** Construida con Angular y PrimeNG para una apariencia moderna.
*   **Dockerizada:** Lista para un despliegue sencillo con Docker Compose.

---

### Requisitos de Instalación

#### Para Desarrollo (Local)
*   **Node.js:** v20 o superior.
*   **MongoDB:** Una instancia local o un URI en la nube (Atlas).
*   **Git:** Para clonar el repositorio.

**Pasos:**
1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd remisiones-it-tocsa
    ```
2.  **Configuración del Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
3.  **Configuración del Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```
4.  Accede a la aplicación en `http://localhost:4200`.

#### Para Producción (Servidor)
*   **Docker** y **Docker Compose** instalados en el servidor.

**Pasos:**
1.  Copia la carpeta del proyecto al servidor.
2.  Ejecuta el siguiente comando en el directorio raíz:
    ```bash
    docker-compose up -d --build
    ```
3.  La aplicación estará disponible en `http://<ip-del-servidor>:3000`.

---

### Technical Support / Soporte Técnico
*   **Author:** IT TOCSA S.A. Development Team
*   **Issue:** All users now share the same database through the production server IP, solving the "local view" problem.

# 📱 Mobile — Gestión de Disponibilidad de Mesas

> **Repositorio del Frontend Mobile:** Aplicación móvil para la gestión de restaurantes y disponibilidad de mesas.
>
> Este proyecto consume la **API REST Mesas Disponibles** y representa el cliente móvil del sistema.
>
> La aplicación utiliza la misma API que el Frontend Web, permitiendo comparar las diferencias entre desarrollar una aplicación web y una aplicación móvil nativa.

---

## 📋 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Objetivo](#2-objetivo)
3. [Arquitectura General](#3-arquitectura-general)
4. [Funcionalidades](#4-funcionalidades)
5. [Flujos de Usuario](#5-flujos-de-usuario)
6. [Autenticación](#6-autenticación)
7. [Consumo de la API](#7-consumo-de-la-api)
8. [Arquitectura del Frontend](#8-arquitectura-del-frontend)
9. [Estructura del Proyecto](#9-estructura-del-proyecto)
10. [Estado de la Aplicación](#10-estado-de-la-aplicación)
11. [Navegación](#11-navegación)
12. [Validaciones y Errores](#12-validaciones-y-errores)
13. [Seguridad](#13-seguridad)
14. [Requisitos No Funcionales](#14-requisitos-no-funcionales)
15. [Etapas de Desarrollo](#15-etapas-de-desarrollo)
16. [Diferencias entre los Frontends](#16-diferencias-entre-los-frontends)
17. [Objetivo Académico](#17-objetivo-académico)

---

# 1. Visión General

El sistema está compuesto por una API REST y diferentes clientes.

```text
                         ┌─────────────────────┐
                         │       MySQL         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │        API          │
                         │      REST/JSON      │
                         │                     │
                         │       JWT           │
                         └─────────┬───────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │   Frontend Web   │          │  Frontend Mobile │
          │                  │          │                  │
          │    Navegador     │          │   Aplicación     │
          │                  │          │      nativa      │
          └──────────────────┘          └──────────────────┘
```

El Frontend Mobile **no accede directamente a MySQL**.

Toda comunicación con el servidor se realiza mediante la API REST.

---

# 2. Objetivo

El objetivo de la aplicación móvil es permitir que un administrador gestione sus restaurantes y mesas desde un dispositivo móvil.

La aplicación deberá permitir:

- Iniciar sesión.
- Mantener la sesión del usuario.
- Consultar sus restaurantes.
- Crear restaurantes.
- Editar restaurantes.
- Eliminar restaurantes.
- Consultar las mesas de un restaurante.
- Crear mesas.
- Editar mesas.
- Eliminar mesas.
- Cambiar rápidamente el estado de una mesa.
- Consultar públicamente restaurantes según disponibilidad.

El desarrollo también tiene como objetivo académico comprender las diferencias entre un cliente Web y un cliente Mobile que utilizan el mismo backend.

---

# 3. Arquitectura General

El backend concentra la lógica de negocio.

Los clientes solamente consumen la API.

```text
                         ┌──────────────────┐
                         │      MySQL       │
                         └────────▲─────────┘
                                  │
                                  │
                         ┌────────┴─────────┐
                         │       API        │
                         │                  │
                         │ REST / JSON      │
                         │ JWT              │
                         │ Validaciones     │
                         │ Lógica negocio   │
                         └───────┬──────────┘
                                 │
                    HTTP / JSON  │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
             ┌─────────────┐           ┌─────────────┐
             │     WEB     │           │   MOBILE    │
             │             │           │             │
             │ Navegador   │           │ App nativa  │
             └─────────────┘           └─────────────┘
```

Una modificación realizada desde Mobile será visible posteriormente desde Web, y viceversa, porque ambos clientes trabajan sobre los mismos datos almacenados en el servidor.

---

# 4. Funcionalidades

## 4.1 Autenticación

El usuario podrá iniciar sesión mediante:

- Email.
- Contraseña.

La aplicación enviará las credenciales a:

```http
POST /api/login
```

Si las credenciales son correctas, la API devolverá un JWT.

---

## 4.2 Restaurantes

Un usuario puede administrar múltiples restaurantes.

La aplicación permitirá:

- Listar restaurantes.
- Crear restaurantes.
- Consultar un restaurante.
- Editar un restaurante.
- Eliminar un restaurante.

Los datos principales son:

```text
Nombre
Ubicación
Teléfono
Descripción
```

Endpoints utilizados:

```http
GET    /api/restaurants
POST   /api/restaurants
GET    /api/restaurants/{id}
PUT    /api/restaurants/{id}
DELETE /api/restaurants/{id}
```

---

## 4.3 Mesas

Cada restaurante puede tener múltiples mesas.

Una mesa contiene:

```text
Detalle
Cantidad de sillas
Estado
```

La aplicación permitirá:

- Listar mesas.
- Crear mesas.
- Consultar una mesa.
- Editar mesas.
- Eliminar mesas.
- Cambiar rápidamente su estado.

Endpoints:

```http
GET    /api/restaurants/{id}/tables
POST   /api/restaurants/{id}/tables
GET    /api/tables/{id}
PUT    /api/tables/{id}
DELETE /api/tables/{id}
PATCH  /api/tables/{id}/status
```

---

# 5. Flujos de Usuario

## 5.1 Login

```text
Usuario
   │
   ▼
Pantalla Login
   │
   │ email + password
   ▼
API
   │
   ├── Error ──► Mostrar mensaje
   │
   └── Éxito
        │
        ▼
       JWT
        │
        ▼
 Guardar sesión
        │
        ▼
    Dashboard
```

---

## 5.2 Selección de restaurante

```text
Dashboard
    │
    ▼
Mis Restaurantes
    │
    ├── Restaurante A
    ├── Restaurante B
    └── Restaurante C
             │
             ▼
           Mesas
```

---

## 5.3 Cambio de estado

La aplicación deberá proporcionar una acción rápida para cambiar el estado de una mesa.

Por ejemplo:

```text
┌─────────────────────────┐
│ Mesa 5                  │
│                         │
│ 4 sillas                │
│                         │
│ 🟢 DISPONIBLE           │
│                         │
│ [ Cambiar estado ]      │
└─────────────────────────┘
```

Al presionar el botón:

```http
PATCH /api/tables/{id}/status
```

No se envía el nuevo estado en el body.

La API determina el siguiente estado y devuelve la mesa actualizada.

---

# 6. Autenticación

La autenticación utiliza JWT.

## Flujo

```text
Mobile
  │
  │ POST /api/login
  │ email + password
  ▼
API
  │
  │ JWT
  ▼
Mobile
  │
  │ Authorization: Bearer <token>
  ▼
Endpoints privados
```

El token deberá almacenarse utilizando un mecanismo apropiado para aplicaciones móviles.

La aplicación no deberá almacenar la contraseña del usuario.

---

# 7. Consumo de la API

El frontend se comunicará con el backend mediante solicitudes HTTP utilizando la API REST.

La comunicación utilizará JSON como formato de intercambio de información.

```text
┌──────────────────────────────┐
│          Frontend            │
│                              │
│ HTML / CSS / JavaScript      │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│             API              │
│                              │
│ REST / JWT / Validaciones    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│            MySQL             │
└──────────────────────────────┘
```

El frontend **no accede directamente a MySQL**.

Toda operación relacionada con los datos deberá realizarse mediante los endpoints definidos por la API.

---

## Cliente HTTP

Las solicitudes podrán realizarse utilizando las herramientas disponibles en JavaScript, por ejemplo:

```javascript
fetch('/api/restaurants')
```

o mediante una biblioteca especializada si el framework seleccionado lo requiere.

El proyecto deberá centralizar las solicitudes a la API para evitar repetir código innecesariamente.

Una organización posible es:

```text
src/
├── services/
│   ├── api.js
│   ├── auth.js
│   ├── restaurants.js
│   └── tables.js
```

Por ejemplo:

```text
restaurants.js
      │
      ├── getRestaurants()
      ├── getRestaurant(id)
      ├── createRestaurant(data)
      ├── updateRestaurant(id, data)
      └── deleteRestaurant(id)
```

De esta manera, los componentes visuales no necesitan conocer todos los detalles de las solicitudes HTTP.

---

## Ejemplo de flujo

Cuando el usuario presiona el botón para cambiar el estado de una mesa:

```text
Usuario
   │
   │ Click
   ▼
Componente / Página
   │
   ▼
Función JavaScript
   │
   ▼
API Client
   │
   │ PATCH
   │ /api/tables/{id}/status
   │ Authorization: Bearer <JWT>
   ▼
API
   │
   ▼
JSON Response
   │
   ▼
JavaScript
   │
   ▼
Actualizar interfaz
```

La API es responsable de determinar el nuevo estado de la mesa.

El frontend únicamente solicita:

```http
PATCH /api/tables/{id}/status
```

sin enviar el nuevo `status_id`.

---

# 8. Arquitectura del Frontend

El proyecto utilizará una arquitectura sencilla que permita separar las responsabilidades principales.

```text
┌──────────────────────────────┐
│             UI               │
│                              │
│ HTML / Components / Pages    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Lógica JavaScript     │
│                              │
│ Eventos / Estado / Validación│
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          API Client          │
│                              │
│ HTTP / JSON / JWT            │
└──────────────┬───────────────┘
               │
               ▼
              API
```

La separación no pretende implementar una arquitectura excesivamente compleja.

El objetivo es que cada parte tenga una responsabilidad clara:

### UI

Responsable de:

* Mostrar información.
* Capturar acciones del usuario.
* Mostrar formularios.
* Mostrar estados de carga.
* Mostrar errores.

### JavaScript

Responsable de:

* Manejar eventos.
* Controlar el estado de la interfaz.
* Validar datos básicos.
* Ejecutar acciones.
* Procesar respuestas de la API.

### API Client

Responsable de:

* Realizar solicitudes HTTP.
* Enviar headers.
* Enviar JSON.
* Recibir respuestas.
* Manejar errores HTTP.

### API

Responsable de:

* Autenticación.
* Autorización.
* Validaciones.
* Lógica de negocio.
* Acceso a MySQL.
* Persistencia de información.

---

# 9. Estructura del Proyecto

La estructura exacta dependerá de si se utiliza JavaScript puro o un framework.

Una estructura de referencia para un frontend web podría ser:

```text
frontend-mobile/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── RestaurantCard
│   │   ├── TableCard
│   │   ├── RestaurantForm
│   │   └── TableForm
│   │
│   ├── pages/
│   │   ├── Login
│   │   ├── Home
│   │   ├── Restaurants
│   │   ├── RestaurantDetail
│   │   ├── Tables
│   │   └── PublicRestaurants
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   └── tables.js
│   │
│   ├── router/
│   │   └── ...
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── layout.css
│   │   └── components.css
│   │
│   └── main.js
│
├── index.html
├── package.json
├── .env
├── .env.example
└── README.md
```

Esta estructura es orientativa.

Si se utiliza un framework como **Vue, React o Svelte**, la estructura se adaptará a las convenciones correspondientes.

Si se utiliza JavaScript sin framework, podrá utilizarse una estructura más simple:

```text
frontend-mobile/
│
├── index.html
│
├── css/
│   ├── global.css
│   └── mobile.css
│
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── restaurants.js
│   ├── tables.js
│   └── app.js
│
├── assets/
│
└── README.md
```

La elección del framework queda a criterio del equipo, siempre que se mantenga el objetivo principal del proyecto: desarrollar un cliente web orientado a dispositivos móviles.


# 10. Estado de la Aplicación

El frontend deberá manejar el estado necesario para representar correctamente la información recibida desde la API.

Por ejemplo, una pantalla que muestra las mesas de un restaurante deberá contemplar al menos los siguientes estados:

```text
┌──────────────┐
│   Cargando   │
└──────┬───────┘
       │
       ▼
   Solicitud API
       │
   ┌───┴────┐
   │        │
   ▼        ▼
Éxito     Error
   │        │
   ▼        ▼
Mostrar   Mostrar
datos     mensaje
```

El estado puede incluir información como:

* Datos obtenidos de la API.
* Estado de carga.
* Errores.
* Usuario autenticado.
* Restaurante seleccionado.
* Mesa seleccionada.
* Formularios.
* Mensajes de confirmación.

La forma de administrar este estado dependerá de la tecnología utilizada.

Si se utiliza JavaScript sin framework, podrá manejarse mediante variables, objetos y funciones.

Si se utiliza un framework como Vue, React o Svelte, podrá utilizarse el sistema de estado correspondiente.

---

# 11. Navegación

La aplicación deberá contar con una navegación clara y adaptada a dispositivos móviles.

El proyecto podrá utilizar un sistema de rutas proporcionado por el framework seleccionado o implementar una navegación sencilla mediante JavaScript.

El flujo principal será:

```text
                    ┌──────────┐
                    │  Login   │
                    └────┬─────┘
                         │
                         ▼
                  ┌──────────────┐
                  │    Inicio    │
                  └──────┬───────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Restaurantes   │
                └────────┬────────┘
                         │
                         ▼
               ┌──────────────────┐
               │ Detalle          │
               │ Restaurante      │
               └────────┬─────────┘
                        │
                        ▼
               ┌──────────────────┐
               │      Mesas       │
               └────────┬─────────┘
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
           Crear      Editar     Eliminar
             │
             ▼
       Cambiar estado
```

También deberá existir una sección pública que pueda consultarse sin iniciar sesión:

```text
Inicio
  │
  ▼
Restaurantes disponibles
  │
  ├── Restaurante A
  ├── Restaurante B
  └── Restaurante C
```

La navegación deberá estar diseñada específicamente teniendo en cuenta el uso desde dispositivos móviles.

---

# 12. Validaciones y Errores

El frontend deberá realizar validaciones básicas antes de enviar información a la API.

Por ejemplo:

```text
Nombre del restaurante
    └── obligatorio

Email
    └── formato válido

Cantidad de sillas
    ├── obligatoria
    ├── número entero
    └── mayor que 0
```

Estas validaciones tienen como objetivo mejorar la experiencia del usuario y evitar solicitudes innecesarias.

Sin embargo:

> **Las validaciones realizadas en el frontend no reemplazan las validaciones del backend.**

La API siempre deberá validar nuevamente los datos recibidos.

---

## Códigos HTTP

El frontend deberá interpretar correctamente las respuestas de la API.

```text
200 OK
    Operación exitosa.

201 Created
    Recurso creado correctamente.

204 No Content
    Operación exitosa sin contenido.

400 Bad Request
    Solicitud incorrecta.

401 Unauthorized
    Token ausente, inválido o expirado.

403 Forbidden
    Usuario sin permisos.

404 Not Found
    Recurso inexistente.

409 Conflict
    Conflicto con el estado actual.

422 Unprocessable Entity
    Error de validación.

500 Internal Server Error
    Error inesperado del servidor.
```

Los códigos HTTP no deberán mostrarse directamente al usuario como única información.

Por ejemplo, ante un:

```text
422 Unprocessable Entity
```

la interfaz podrá mostrar:

```text
Hay errores en los datos ingresados.
Revisá los campos marcados.
```

---

# 13. Seguridad

El frontend deberá contemplar las siguientes medidas:

* No almacenar contraseñas.
* No mostrar contraseñas en texto plano.
* No exponer información sensible innecesariamente.
* Utilizar JWT para las solicitudes autenticadas.
* No confiar exclusivamente en las validaciones del cliente.
* Utilizar HTTPS en producción.
* Manejar correctamente un JWT expirado o inválido.
* Evitar insertar HTML arbitrario proveniente de datos externos.
* No incluir claves privadas dentro del código frontend.
* Configurar la URL de la API mediante variables de entorno o configuración del proyecto.

Ejemplo:

```env
API_URL=http://localhost:8000/api
```

El frontend debe considerarse un entorno potencialmente accesible para el usuario.

Por lo tanto, **ningún secreto real deberá almacenarse en el código JavaScript enviado al navegador**.

---

# 14. Requisitos No Funcionales

### RNF-MOBILE-01 — Usabilidad

La interfaz deberá ser sencilla de utilizar mediante pantallas táctiles.

### RNF-MOBILE-02 — Diseño Mobile First

La interfaz deberá diseñarse inicialmente para dispositivos móviles.

### RNF-MOBILE-03 — Adaptabilidad

La aplicación deberá continuar siendo funcional en diferentes tamaños de pantalla.

### RNF-MOBILE-04 — Navegación

La navegación deberá estar optimizada para pantallas pequeñas y reducir pasos innecesarios.

### RNF-MOBILE-05 — Separación de responsabilidades

La interfaz, la lógica JavaScript y el acceso a la API deberán mantenerse separados.

### RNF-MOBILE-06 — Manejo de errores

Los errores de red y las respuestas de la API deberán procesarse correctamente.

### RNF-MOBILE-07 — Estados de carga

Las operaciones que dependan de la red deberán informar al usuario mientras se encuentran en proceso.

### RNF-MOBILE-08 — Seguridad

El frontend no deberá almacenar contraseñas ni exponer información sensible.

### RNF-MOBILE-09 — Independencia del backend

El frontend no deberá acceder directamente a MySQL.

### RNF-MOBILE-10 — Compatibilidad

La aplicación deberá funcionar correctamente en navegadores modernos utilizados habitualmente en dispositivos móviles.

---

# 15. Etapas de Desarrollo

* [ ] **Etapa 1 — Inicialización:** Crear el proyecto y configurar Git.
* [ ] **Etapa 2 — Elección tecnológica:** Definir JavaScript puro o framework JavaScript.
* [ ] **Etapa 3 — Diseño:** Crear wireframes orientados a dispositivos móviles.
* [ ] **Etapa 4 — Navegación:** Definir las páginas, rutas y flujo de navegación.
* [ ] **Etapa 5 — Cliente HTTP:** Configurar la comunicación con la API.
* [ ] **Etapa 6 — Autenticación:** Implementar login y manejo del JWT.
* [ ] **Etapa 7 — Restaurantes:** Implementar listado, creación, edición y eliminación.
* [ ] **Etapa 8 — Mesas:** Implementar listado, creación, edición y eliminación.
* [ ] **Etapa 9 — Cambio de estado:** Implementar `PATCH /api/tables/{id}/status`.
* [ ] **Etapa 10 — Consulta pública:** Implementar listado de restaurantes ordenados por disponibilidad.
* [ ] **Etapa 11 — Validaciones:** Incorporar validaciones de formularios.
* [ ] **Etapa 12 — Manejo de errores:** Implementar estados de loading, errores y respuestas HTTP.
* [ ] **Etapa 13 — Diseño Mobile First:** Optimizar componentes, tamaños, navegación e interacción táctil.
* [ ] **Etapa 14 — Testing:** Probar funcionalidades, navegación, autenticación y comunicación con la API.
* [ ] **Etapa 15 — Documentación:** Completar documentación técnica y decisiones de diseño.

---

# 16. Diferencias entre los Frontends

Los dos proyectos son **aplicaciones web independientes** que consumen exactamente la misma API.

```text
                         ┌──────────────┐
                         │     API      │
                         │ REST / JSON  │
                         │     JWT      │
                         └───────┬──────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
        ┌──────────────────┐          ┌──────────────────┐
        │   FRONTEND WEB   │          │ FRONTEND MOBILE  │
        │                  │          │                  │
        │ Desktop-oriented │          │ Mobile First     │
        │                  │          │                  │
        │ HTML/CSS/JS      │          │ HTML/CSS/JS      │
        │                  │          │                  │
        │ Framework        │          │ Framework        │
        │ opcional         │          │ opcional         │
        └──────────────────┘          └──────────────────┘
```

La API no deberá saber qué frontend realizó una solicitud.

Por ejemplo, ambos clientes pueden ejecutar:

```http
PATCH /api/tables/15/status
```

La API procesa la solicitud de la misma manera.

La diferencia se encuentra en la interfaz, navegación y experiencia de usuario.

---

## Diferencias principales

| Característica     | Frontend Web                          | Frontend Mobile             |
| ------------------ | ------------------------------------- | --------------------------- |
| Tipo               | Aplicación Web                        | Aplicación Web              |
| Tecnologías        | HTML/CSS/JS                           | HTML/CSS/JS                 |
| Framework          | Opcional                              | Opcional                    |
| Enfoque            | Desktop-oriented                      | Mobile First                |
| Pantalla principal | Mayor cantidad de información         | Información resumida        |
| Navegación         | Menús y layouts amplios               | Navegación simplificada     |
| Formularios        | Pueden utilizar varias columnas       | Principalmente verticales   |
| Tablas             | Mayor cantidad de información visible | Tarjetas/listados compactos |
| Interacción        | Mouse + teclado + touch               | Principalmente touch        |
| API                | Misma                                 | Misma                       |
| Base de datos      | No accede directamente                | No accede directamente      |

---

# 17. Objetivo Académico

El desarrollo de dos frontends separados permitirá demostrar que una API REST puede ser utilizada por diferentes clientes sin modificar el backend.

```text
                         ┌──────────────┐
                         │     API      │
                         └───────┬──────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
              Web            Mobile          Futuro
                 │               │               │
                 ▼               ▼               ▼
              Cliente        Cliente        Otro cliente
               Web            Web
```

El objetivo es comprender:

* Arquitectura cliente-servidor.
* APIs REST.
* HTTP.
* JSON.
* JWT.
* Consumo de APIs desde JavaScript.
* Separación entre frontend y backend.
* Manejo de estados.
* Navegación web.
* Diseño responsive.
* Diseño Mobile First.
* Validaciones.
* Manejo de errores.
* Organización de proyectos frontend.
* Diferencias entre diseñar para escritorio y diseñar para dispositivos móviles.

En un proyecto real, estas dos interfaces podrían formar parte de **un único frontend responsive**.

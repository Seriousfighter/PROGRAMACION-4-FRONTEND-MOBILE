# 📱 Frontend Mobile — Gestión de Disponibilidad de Mesas

> **Repositorio del Frontend Mobile:** Cliente web orientado principalmente a dispositivos móviles para la gestión de restaurantes y disponibilidad de mesas.
>
> Este proyecto consume la **misma API REST** utilizada por el Frontend Web.
>
> El objetivo académico es desarrollar un segundo cliente web con una organización de navegación y una interfaz pensadas específicamente para pantallas pequeñas, permitiendo comparar las decisiones de diseño y desarrollo frente al Frontend Web.

---

# 📋 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Objetivo](#2-objetivo)
3. [Arquitectura General](#3-arquitectura-general)
4. [Funcionalidades](#4-funcionalidades)
5. [Flujos de Navegación](#5-flujos-de-navegación)
6. [Autenticación](#6-autenticación)
7. [Consumo de la API](#7-consumo-de-la-api)
8. [Arquitectura del Frontend](#8-arquitectura-del-frontend)
9. [Estructura del Proyecto](#9-estructura-del-proyecto)
10. [Diseño Mobile](#10-diseño-mobile)
11. [Manejo de Estados](#11-manejo-de-estados)
12. [Validaciones y Errores](#12-validaciones-y-errores)
13. [Seguridad](#13-seguridad)
14. [Requisitos No Funcionales](#14-requisitos-no-funcionales)
15. [Etapas de Desarrollo](#15-etapas-de-desarrollo)
16. [Diferencias con el Frontend Web](#16-diferencias-con-el-frontend-web)

---

# 1. Visión General

El sistema está compuesto por una API REST y dos clientes web independientes.

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
                     ┌─────────────┴─────────────┐
                     │                           │
                     ▼                           ▼
          ┌──────────────────┐        ┌──────────────────┐
          │   Frontend Web   │        │ Frontend Mobile  │
          │                  │        │                  │
          │ Desktop-oriented │        │ Mobile-oriented  │
          │                  │        │                  │
          │ Cliente Web      │        │ Cliente Web      │
          └──────────────────┘        └──────────────────┘
```

Ambos frontends:

- Son aplicaciones web.
- Consumen la misma API.
- Utilizan HTTP/JSON.
- Utilizan JWT para autenticación.
- Trabajan sobre los mismos datos.

La diferencia principal está en **cómo se presenta y organiza la información**.

---

# 2. Objetivo

El objetivo de este frontend es desarrollar una interfaz web pensada principalmente para dispositivos móviles.

Se busca estudiar:

- Diseño Mobile First.
- Interfaces táctiles.
- Navegación simplificada.
- Organización de contenido en pantallas pequeñas.
- Componentes adaptados a dispositivos móviles.
- Estados de carga y errores.
- Consumo de APIs desde un cliente web.
- Diferencias entre una interfaz orientada a escritorio y una orientada a móviles.

---

# 3. Arquitectura General

El frontend no tiene acceso directo a la base de datos.

Toda la información se obtiene mediante la API.

```text
┌─────────────────────┐
│ Frontend Mobile     │
│                     │
│ HTML / CSS / JS     │
└──────────┬──────────┘
           │
           │ HTTP / JSON
           ▼
┌─────────────────────┐
│        API          │
│                     │
│ Routes              │
│ Controllers         │
│ Services            │
│ Models / ORM        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       MySQL         │
└─────────────────────┘
```

La API es responsable de la lógica de negocio y persistencia.

El frontend es responsable principalmente de la presentación y la interacción con el usuario.

---

# 4. Funcionalidades

## 4.1 Autenticación

El usuario podrá iniciar sesión mediante:

- Email.
- Contraseña.

Endpoint:

```http
POST /api/login
```

La API devolverá un JWT que será utilizado para las operaciones autenticadas.

---

## 4.2 Restaurantes

El usuario podrá administrar múltiples restaurantes.

Funcionalidades:

- Listar restaurantes.
- Crear restaurante.
- Consultar restaurante.
- Editar restaurante.
- Eliminar restaurante.

Datos:

```text
Nombre
Ubicación
Teléfono
Descripción
```

Endpoints:

```http
GET    /api/restaurants
POST   /api/restaurants
GET    /api/restaurants/{id}
PUT    /api/restaurants/{id}
DELETE /api/restaurants/{id}
```

---

## 4.3 Mesas

Cada restaurante puede contener múltiples mesas.

Una mesa contiene:

```text
Detalle
Cantidad de sillas
Estado
```

Funcionalidades:

- Listar mesas.
- Crear mesa.
- Consultar mesa.
- Editar mesa.
- Eliminar mesa.
- Cambiar estado.

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

## 4.4 Consulta pública

La aplicación contará con una sección pública.

```http
GET /api/public/restaurants
```

Esta pantalla mostrará los restaurantes ordenados según la cantidad de mesas disponibles.

No requiere autenticación.

---

# 5. Flujos de Navegación

La navegación estará diseñada teniendo en cuenta el tamaño reducido de las pantallas.

### Flujo principal

```text
                    ┌──────────┐
                    │  Login   │
                    └────┬─────┘
                         │
                         ▼
                ┌─────────────────┐
                │    Inicio       │
                └────────┬────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
         Restaurantes  Perfil    Logout
              │
              ▼
        Seleccionar
        restaurante
              │
              ▼
            Mesas
              │
        ┌─────┼─────┐
        │     │     │
        ▼     ▼     ▼
      Crear  Editar Eliminar
        │
        ▼
   Cambiar estado
```

La navegación podrá implementarse mediante rutas y componentes propios del framework seleccionado.

---

# 6. Autenticación

El proceso de autenticación será equivalente al utilizado por el Frontend Web.

```text
Usuario
   │
   ▼
Login
   │
   │ email + password
   ▼
POST /api/login
   │
   ▼
API
   │
   │ JWT
   ▼
Frontend Mobile
   │
   │ Authorization: Bearer <token>
   ▼
Endpoints privados
```

El frontend no almacena ni vuelve a enviar la contraseña una vez completado el login.

---

# 7. Consumo de la API

La comunicación con el backend deberá centralizarse.

Conceptualmente:

```text
Página / Componente
          │
          ▼
      API Client
          │
          ▼
     HTTP / JSON
          │
          ▼
         API
```

Se recomienda separar las operaciones por recurso:

```text
services/
│
├── auth
├── restaurants
└── tables
```

De esta manera, los componentes de interfaz no necesitan conocer directamente los detalles de las solicitudes HTTP.

---

# 8. Arquitectura del Frontend

El proyecto deberá mantener separadas las responsabilidades.

```text
┌─────────────────────────────┐
│            UI               │
│                             │
│ Pages / Components          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Lógica de interfaz     │
│                             │
│ Estado / eventos / loading  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         API Client          │
│                             │
│ HTTP / JSON / JWT           │
└──────────────┬──────────────┘
               │
               ▼
              API
```

El objetivo es evitar componentes que concentren simultáneamente:

- Interfaz.
- Solicitudes HTTP.
- Lógica de negocio.
- Manejo de autenticación.
- Validaciones complejas.

---

# 9. Estructura del Proyecto

La estructura dependerá del framework seleccionado.

Como referencia:

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
│   │   ├── TableForm
│   │   └── ...
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
│   │   ├── api
│   │   ├── auth
│   │   ├── restaurants
│   │   └── tables
│   │
│   ├── router/
│   │   └── ...
│   │
│   ├── store/
│   │   └── ...
│   │
│   └── main
│
├── .env
├── .env.example
├── package.json
└── README.md
```

La estructura es orientativa y podrá modificarse según el framework utilizado.

---

# 10. Diseño Mobile

La aplicación estará diseñada utilizando un enfoque **Mobile First**.

Esto significa que el diseño inicial se realizará pensando primero en pantallas pequeñas.

```text
Mobile
  │
  ▼
Diseño inicial
  │
  ▼
Pantalla pequeña
  │
  ▼
Se agregan adaptaciones
  │
  ▼
Pantallas mayores
```

## Principios de diseño

Se deberán considerar:

### Touch

Los elementos interactivos deberán tener un tamaño adecuado para ser utilizados mediante una pantalla táctil.

### Jerarquía visual

La información más importante deberá aparecer primero.

### Navegación simple

Se deberá reducir la cantidad de pasos necesarios para realizar operaciones frecuentes.

### Contenido

Se evitarán interfaces excesivamente cargadas.

### Formularios

Los formularios deberán estar organizados verticalmente y utilizar controles apropiados.

Ejemplo:

```text
┌──────────────────────────────┐
│ ← Restaurante                │
├──────────────────────────────┤
│                              │
│ Nombre                       │
│ ┌──────────────────────────┐ │
│ │ Restaurante El Sabor     │ │
│ └──────────────────────────┘ │
│                              │
│ Ubicación                    │
│ ┌──────────────────────────┐ │
│ │ Av. Principal 123        │ │
│ └──────────────────────────┘ │
│                              │
│ Teléfono                     │
│ ┌──────────────────────────┐ │
│ │ 0343...                  │ │
│ └──────────────────────────┘ │
│                              │
│       [ Guardar cambios ]    │
│                              │
└──────────────────────────────┘
```

---

# 11. Manejo de Estados

Las solicitudes a la API deberán contemplar diferentes estados.

```text
                    Solicitud
                        │
                        ▼
                    Loading
                   /       \
                  /         \
                 ▼           ▼
              Success       Error
                 │           │
                 ▼           ▼
             Actualizar    Mostrar
                 UI         mensaje
```

Por ejemplo:

```text
Cargando mesas...
```

o:

```text
No se pudieron cargar las mesas.
[ Reintentar ]
```

---

# 12. Validaciones y Errores

El frontend podrá realizar validaciones básicas antes de enviar los datos.

Ejemplo:

```text
Nombre:
    requerido

Cantidad de sillas:
    requerido
    entero
    mayor que 0
```

Sin embargo:

> **Las validaciones realizadas en el frontend no reemplazan las validaciones de la API.**

La API deberá validar nuevamente toda información recibida.

---

## Códigos HTTP

El frontend deberá interpretar correctamente las respuestas:

```text
200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

Ejemplo:

```text
401
 │
 ▼
Sesión inválida
 │
 ▼
Eliminar sesión local
 │
 ▼
Redirigir a Login
```

---

# 13. Seguridad

El frontend deberá:

- No almacenar contraseñas.
- No exponer información sensible.
- Utilizar HTTPS en producción.
- Utilizar JWT únicamente cuando corresponda.
- Manejar expiración de sesión.
- No confiar exclusivamente en las validaciones del cliente.
- Evitar insertar contenido HTML arbitrario proveniente de usuarios.
- Utilizar variables de entorno para configurar la API.

Ejemplo:

```env
VITE_API_URL=http://localhost:8000/api
```

---

# 14. Requisitos No Funcionales

### RNF-MOBILE-01 — Diseño Mobile First

La interfaz deberá priorizar dispositivos móviles.

### RNF-MOBILE-02 — Usabilidad

La aplicación deberá ser sencilla de utilizar mediante pantallas táctiles.

### RNF-MOBILE-03 — Adaptabilidad

La interfaz deberá continuar siendo funcional en diferentes tamaños de pantalla.

### RNF-MOBILE-04 — Navegación

La navegación deberá estar diseñada teniendo en cuenta las limitaciones de las pantallas pequeñas.

### RNF-MOBILE-05 — Separación de responsabilidades

La presentación deberá mantenerse separada de la comunicación con la API.

### RNF-MOBILE-06 — Manejo de errores

Los errores deberán comunicarse claramente al usuario.

### RNF-MOBILE-07 — Estados de carga

Las operaciones asíncronas deberán mostrar un indicador apropiado.

### RNF-MOBILE-08 — Seguridad

No se deberán almacenar contraseñas ni exponer información sensible.

### RNF-MOBILE-09 — Independencia

El frontend no deberá acceder directamente a MySQL.

---

# 15. Etapas de Desarrollo

- [ ] **Etapa 1 — Inicialización:** Crear proyecto, configurar Git y dependencias.
- [ ] **Etapa 2 — Diseño:** Crear wireframes orientados a dispositivos móviles.
- [ ] **Etapa 3 — Navegación:** Definir rutas y flujo entre pantallas.
- [ ] **Etapa 4 — API Client:** Configurar comunicación HTTP con el backend.
- [ ] **Etapa 5 — Autenticación:** Implementar login, JWT y sesión.
- [ ] **Etapa 6 — Restaurantes:** Implementar listado y CRUD.
- [ ] **Etapa 7 — Mesas:** Implementar listado y CRUD.
- [ ] **Etapa 8 — Estados:** Implementar cambio rápido de estado.
- [ ] **Etapa 9 — Vista pública:** Implementar consulta de restaurantes.
- [ ] **Etapa 10 — Mobile First:** Ajustar interfaz, navegación y componentes.
- [ ] **Etapa 11 — Responsive:** Comprobar funcionamiento en diferentes resoluciones.
- [ ] **Etapa 12 — Testing:** Probar navegación, formularios, API y errores.
- [ ] **Etapa 13 — Documentación:** Completar README y documentación técnica.

---

# 16. Diferencias con el Frontend Web

Los dos proyectos son **aplicaciones web independientes**.

No se trata de una aplicación Android y otra Web.

Ambos utilizan:

- Navegador.
- HTTP.
- JSON.
- API REST.
- JWT.
- HTML/CSS/JavaScript o el framework seleccionado.

La diferencia está principalmente en las decisiones de interfaz y navegación.

| Característica | Frontend Web | Frontend Mobile |
|---|---|---|
| Tipo | Aplicación Web | Aplicación Web |
| Enfoque | Desktop-oriented | Mobile-oriented |
| Diseño | Pensado primero para escritorio | Mobile First |
| Pantalla principal | Dashboard amplio | Vista compacta |
| Navegación | Menús laterales/superiores | Navegación simplificada |
| Tablas | Mayor cantidad de información visible | Información resumida |
| Formularios | Pueden utilizar varias columnas | Principalmente verticales |
| Interacción | Mouse + teclado + touch | Principalmente touch |
| Componentes | Más información simultánea | Componentes compactos |
| API | Misma | Misma |

---

## ¿Por qué dos Frontends?

En un proyecto real, probablemente se desarrollaría **un único frontend responsive** capaz de adaptarse a diferentes dispositivos.

En este proyecto se desarrollan dos clientes separados por motivos académicos.

Esto permite comparar:

```text
              MISMA API
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   FRONTEND WEB        FRONTEND MOBILE
        │                   │
        ▼                   ▼
 Desktop-oriented       Mobile First
        │                   │
        ▼                   ▼
 Navegación propia     Navegación propia
        │                   │
        ▼                   ▼
 Estilos propios       Estilos propios
```

El objetivo es demostrar que **la API permanece independiente de la interfaz**.

Por ejemplo, ambos clientes pueden ejecutar:

```http
PATCH /api/tables/15/status
```

La API recibe exactamente la misma solicitud, independientemente de cuál frontend la origine.

---

## Objetivo académico

El desarrollo de este segundo frontend busca comprender:

- Arquitectura cliente-servidor.
- Separación entre frontend y backend.
- Consumo de APIs REST.
- HTTP y JSON.
- Autenticación mediante JWT.
- Diseño Mobile First.
- Diseño responsive.
- Navegación web.
- Organización de componentes.
- Manejo de estados.
- Validaciones del cliente.
- Manejo de errores HTTP.
- Reutilización de un mismo backend desde diferentes clientes.

La comparación entre ambos frontends permite observar que **la misma lógica de negocio puede ser utilizada por diferentes interfaces sin modificar la API**.
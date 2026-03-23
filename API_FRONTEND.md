# 🎓 Academia de Baile — Documentación de API para Frontend

**Versión backend**: Spring Boot 3.5.11 | Java 21  
**Fecha**: 23 de marzo de 2026

---

## 📌 Configuración Base

| Parámetro       | Valor                          |
| --------------- | ------------------------------ |
| Base URL        | `http://localhost:8080`        |
| Prefijo API     | `/api`                         |
| Formato         | JSON (`application/json`)      |
| CORS            | Todos los orígenes permitidos  |
| Swagger UI      | `http://localhost:8080/swagger-ui.html` |
| OpenAPI JSON    | `http://localhost:8080/api-docs` |

---

## 🔐 Autenticación

### Tipo de autenticación
JWT (JSON Web Token) — stateless.

### Duración del token
**24 horas** (86 400 000 ms). Tras expirar, el usuario debe volver a hacer login.

### Cómo incluir el token

En todas las peticiones que requieran autenticación, añadir el header:

```
Authorization: Bearer <token>
```

### Flujo completo

```
1. POST /api/auth/login  →  recibe { token, id, email, firstName, lastName, roles }
2. Guardar token en localStorage / sessionStorage / cookie segura
3. Adjuntar header Authorization en cada request protegido
4. Al expirar (401), redirigir al login y limpiar el token almacenado
```

---

## 📡 Endpoints por módulo

### 1. Autenticación — `/api/auth`

> Sin autenticación requerida

#### `POST /api/auth/login`

**Request**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "roles": ["ROLE_STUDENT"]
}
```

**Errores comunes**
| Código | Causa |
|--------|-------|
| 400    | Email inválido o contraseña menor a 6 caracteres |
| 401    | Credenciales incorrectas |

---

#### `POST /api/auth/register`

**Request**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "phone": "+56912345678"
}
```

> `phone` es opcional.

**Validaciones**
- `firstName` / `lastName`: entre 2 y 50 caracteres
- `email`: formato válido, único en el sistema
- `password`: entre 6 y 100 caracteres

**Response 201** — mismo formato que login (`JwtResponseDTO`)

---

#### `POST /api/auth/logout`

Stateless. Sólo eliminar el token del lado cliente.

**Response 200**
```json
{ "message": "Logout exitoso. Elimina el token del cliente." }
```

---

### 2. Usuarios — `/api/users`

> Requiere `Authorization: Bearer <token>`

| Método   | Endpoint                       | Roles permitidos                        | Descripción |
| -------- | ------------------------------ | --------------------------------------- | ----------- |
| `GET`    | `/api/users`                   | ADMIN, TEACHER                          | Todos los usuarios |
| `GET`    | `/api/users/{id}`              | ADMIN, TEACHER, propio usuario          | Usuario por ID |
| `GET`    | `/api/users/email/{email}`     | ADMIN, TEACHER, propio usuario          | Usuario por email |
| `GET`    | `/api/users/active`            | ADMIN, TEACHER                          | Sólo usuarios activos |
| `GET`    | `/api/users/search?name=...`   | ADMIN, TEACHER                          | Buscar por nombre |
| `POST`   | `/api/users`                   | ADMIN                                   | Crear usuario |
| `PUT`    | `/api/users/{id}`              | ADMIN, propio usuario                   | Actualizar usuario |
| `DELETE` | `/api/users/{id}`              | ADMIN                                   | Eliminar usuario |
| `PATCH`  | `/api/users/{id}/toggle-status`| ADMIN                                   | Activar / Desactivar |

**Objeto `UserDTO` (request / response)**
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseña123",
  "phone": "+56912345678",
  "isActive": true,
  "createdAt": "2026-03-23T20:00:00",
  "updatedAt": "2026-03-23T20:00:00",
  "roles": ["ADMIN", "STUDENT"]
}
```

> **Nota**: `password` es **write-only** — nunca se devuelve en las respuestas.  
> `roles` es **read-only** — no se envía al crear/actualizar (usar `/api/roles`).

---

### 3. Roles — `/api/roles`

> Requiere `Authorization: Bearer <token>`

| Método | Endpoint                          | Roles permitidos      | Descripción |
| ------ | --------------------------------- | --------------------- | ----------- |
| `GET`  | `/api/roles`                      | ADMIN                 | Todos los roles |
| `GET`  | `/api/roles/{id}`                 | ADMIN                 | Rol por ID |
| `GET`  | `/api/roles/user/{userId}`        | ADMIN, propio usuario | Roles de un usuario |
| `GET`  | `/api/roles/users/{roleName}`     | ADMIN, TEACHER        | Usuarios por rol |
| `POST` | `/api/roles/assign/{userId}?roleName=ADMIN` | ADMIN    | Asignar rol |
| `POST` | `/api/roles/remove/{userId}?roleName=ADMIN` | ADMIN    | Remover rol |

**Valores de `roleName`** (query param)
```
ADMIN | TEACHER | STUDENT
```

---

### 4. Precios — `/api/pricing`

> Sin autenticación requerida (consultas públicas)

#### `GET /api/pricing/calculate`

Calcula las opciones de precio disponibles para una combinación de curso + categoría.

**Query params**
| Param           | Tipo            | Requerido | Descripción |
|-----------------|-----------------|-----------|-------------|
| `courseId`      | `Long`          | ✅        | ID del curso |
| `studentCategory` | `StudentCategory` | ✅   | Categoría del estudiante |
| `personCount`   | `Integer`       | No (def. 1) | 1 o 2 personas |

**Ejemplo**
```
GET /api/pricing/calculate?courseId=1&studentCategory=REGULAR&personCount=1
```

**Response 200 — `PricingCalculationDTO`**
```json
{
  "courseId": 1,
  "courseName": "Salsa Principiantes",
  "studentCategory": "REGULAR",
  "personCount": 1,
  "isCouple": false,
  "options": [
    {
      "pricingRuleId": 3,
      "name": "Paquete 4 Clases",
      "description": "4 clases de salsa",
      "pricingType": "PACKAGE_4",
      "classQuantity": 4,
      "originalPrice": 60000,
      "finalPrice": 54000,
      "discountPercentage": 10.0,
      "savings": 6000,
      "pricePerClass": 13500,
      "isRecommended": true,
      "validFrom": "2026-01-01T00:00:00",
      "validUntil": "2026-12-31T23:59:59"
    }
  ],
  "recommendedOptionId": 3,
  "calculatedAt": "2026-03-23T20:00:00",
  "hasDefaultPricing": false
}
```

---

#### `POST /api/pricing/calculate`

Misma lógica que GET, pero enviando los datos en el body.

**Request**
```json
{
  "courseId": 1,
  "studentCategory": "REGULAR",
  "personCount": 1
}
```

---

#### `GET /api/pricing/quick-quote`

Cotización rápida sin especificar curso.

**Query params**: `studentCategory`, `personCount` (opcional, def. 1)

**Ejemplo**
```
GET /api/pricing/quick-quote?studentCategory=UNIVERSITY&personCount=1
```

---

#### `GET /api/pricing/rules`

Lista todas las reglas de precios activas.

**Query params** (todos opcionales)
| Param           | Tipo            | Descripción |
|-----------------|-----------------|-------------|
| `studentCategory` | `StudentCategory` | Filtrar por categoría |
| `pricingType`   | `PricingType`   | Filtrar por tipo |
| `activeOnly`    | `Boolean`       | Default `true` |

**Ejemplo**
```
GET /api/pricing/rules?studentCategory=REGULAR&activeOnly=true
```

**Response 200** — lista de `PricingRuleDTO`
```json
[
  {
    "id": 3,
    "name": "Paquete 4 Clases Regular",
    "description": "Paquete básico para estudiantes regulares",
    "pricingType": "PACKAGE_4",
    "studentCategory": "REGULAR",
    "personCount": 1,
    "classQuantity": 4,
    "price": 60000,
    "discountPercentage": 10.0,
    "finalPrice": 54000,
    "validFrom": "2026-01-01T00:00:00",
    "validUntil": "2026-12-31T23:59:59",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00",
    "updatedAt": "2026-01-01T00:00:00"
  }
]
```

---

#### `GET /api/pricing/rules/{ruleId}`

Regla de precios específica por ID.

---

#### `GET /api/pricing/rules/available`

Lista de reglas disponibles para un curso, categoría y número de personas.

**Query params**: `courseId`, `studentCategory`, `personCount` (def. 1)

---

#### `GET /api/pricing/rules/category/{category}`

Reglas por categoría de estudiante. Query param opcional: `personCount`.

---

### 5. Pagos — `/api/payments`

> La mayoría de endpoints requiere `Authorization: Bearer <token>`

#### `GET /api/payments/pricing/calculate`
Alias del endpoint de precios. Mismos parámetros que `GET /api/pricing/calculate`.

---

#### `GET /api/payments/pricing/flexible`

Cálculo rápido sin especificar curso por número de clases.

**Query params**
| Param           | Tipo            | Default | Descripción |
|-----------------|-----------------|---------|-------------|
| `numberOfClasses` | `Integer`     | —       | Nro. de clases |
| `studentCategory` | `StudentCategory` | —   | Categoría |
| `isCouple`      | `Boolean`       | `false` | Si es pareja |

**Response 200**
```json
{
  "price": 54000,
  "currency": "CLP",
  "numberOfClasses": 4,
  "studentCategory": "REGULAR",
  "isCouple": false,
  "pricePerClass": 13500.00
}
```

---

#### `GET /api/payments/pricing/rule/{pricingRuleId}`

Calcula el precio final de una regla específica.

**Response 200**
```json
{
  "price": 54000,
  "currency": "CLP",
  "pricingRuleId": 3
}
```

---

#### `POST /api/payments/validate`

Valida los datos de un pago antes de procesarlo.

**Roles**: cualquier usuario autenticado (o anónimo)

**Request — `PaymentRequestDTO`**
```json
{
  "courseId": 1,
  "pricingRuleId": 3,
  "studentCategory": "REGULAR",
  "paymentMethod": "CASH",
  "personCount": 1,
  "notes": "Pago en recepción",
  "transactionId": null
}
```

**Response 200 (válido)**
```json
{
  "valid": true,
  "price": 54000,
  "currency": "CLP",
  "message": "Datos de pago válidos"
}
```

**Response 400 (inválido)**
```json
{
  "valid": false,
  "message": "La regla de precios no está disponible"
}
```

---

#### `POST /api/payments/process` 🔒

Procesa el pago y genera la inscripción.

**Roles requeridos**: `STUDENT` o `ADMIN`

**Request** — mismo formato que `/validate`

**Response 200 — `PaymentResponseDTO`**
```json
{
  "id": 10,
  "paymentCode": "PAY-20260323-ABC123",
  "studentName": "Juan Pérez",
  "courseName": "Salsa Principiantes",
  "pricingType": "PACKAGE_4",
  "studentCategory": "REGULAR",
  "quantityClasses": 4,
  "personCount": 1,
  "originalPrice": 60000,
  "discountAmount": 6000,
  "finalPrice": 54000,
  "pricePerClass": 13500,
  "paymentMethod": "CASH",
  "status": "COMPLETED",
  "transactionId": null,
  "paymentDate": "2026-03-23T20:00:00",
  "createdAt": "2026-03-23T20:00:00",
  "notes": "Pago en recepción"
}
```

---

#### `GET /api/payments/status/{paymentCode}` 🔒

Consulta un pago por su código único.

**Ejemplo**: `GET /api/payments/status/PAY-20260323-ABC123`

---

#### `GET /api/payments/my-payments` 🔒

Historial de pagos del usuario autenticado.

**Roles**: STUDENT, TEACHER, ADMIN

**Response 200** — lista de `PaymentResponseDTO`

---

### 6. Health check — `/api/test`

> Sin autenticación

| Endpoint          | Response      |
| ----------------- | ------------- |
| `GET /api/test/hello` | `"Hello from Academy App!"` |
| `GET /api/test/ping`  | `"pong"` |

---

## 📦 Enumeraciones (valores aceptados por la API)

### `StudentCategory`
| Valor       | Etiqueta       |
|-------------|----------------|
| `REGULAR`   | Regular        |
| `UNIVERSITY`| Universitario  |
| `COUPLE`    | Pareja         |
| `SENIOR`    | Adulto Mayor   |
| `CHILD`     | Niño           |

### `PricingType`
| Valor               | Etiqueta                |
|---------------------|-------------------------|
| `SINGLE_CLASS`      | Clase Individual        |
| `PACKAGE_4`         | Paquete 4 Clases        |
| `PACKAGE_8`         | Paquete 8 Clases        |
| `PACKAGE_12`        | Paquete 12 Clases       |
| `COUPLE_PACKAGE_8`  | Paquete Pareja 8 Clases |
| `UNLIMITED_MONTHLY` | Mensualidad Ilimitada   |

### `PaymentMethod`
| Valor             | Etiqueta              |
|-------------------|-----------------------|
| `CASH`            | Efectivo              |
| `CREDIT_CARD`     | Tarjeta de Crédito    |
| `DEBIT_CARD`      | Tarjeta de Débito     |
| `BANK_TRANSFER`   | Transferencia Bancaria|
| `MOBILE_PAYMENT`  | Pago Móvil            |

### `PaymentStatus`
| Valor       | Descripción          |
|-------------|----------------------|
| `PENDING`   | Pendiente            |
| `COMPLETED` | Completado           |
| `FAILED`    | Fallido              |
| `REFUNDED`  | Reembolsado          |
| `CANCELLED` | Cancelado            |

### `DanceType`
`SALSA` | `BACHATA` | `MERENGUE` | `REGGAETON` | `CUMBIA` | `TANGO` | `KIZOMBA` | `ZOUK` | `MAMBO` | `CHA_CHA_CHA`

### `DanceLevel`
`BEGINNER` | `INTERMEDIATE` | `ADVANCED` | `MASTER` | `OPEN`

### `EnrollmentStatus`
`PENDING` | `ACTIVE` | `COMPLETED` | `CANCELLED` | `SUSPENDED` | `TRANSFERRED` | `HOURS_EXHAUSTED`

---

## ⚠️ Manejo de errores

El backend responde con estos códigos HTTP estándar:

| Código | Situación |
|--------|-----------|
| `200`  | OK — solicitud exitosa |
| `201`  | Created — recurso creado |
| `204`  | No Content — eliminación exitosa |
| `400`  | Bad Request — datos inválidos o faltantes |
| `401`  | Unauthorized — token ausente, inválido o expirado |
| `403`  | Forbidden — rol insuficiente para el recurso |
| `404`  | Not Found — recurso no encontrado |
| `500`  | Internal Server Error |

### Estructura de error típica (validación)
```json
{
  "timestamp": "2026-03-23T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El email debe tener un formato válido",
  "path": "/api/auth/login"
}
```

---

## 🚀 Flujo de uso recomendado (paso a paso)

### Flujo de inscripción de un estudiante

```
1. POST /api/auth/login                          → obtener token
2. GET  /api/pricing/calculate                   → mostrar opciones al usuario
           ?courseId=X&studentCategory=REGULAR
3. GET  /api/pricing/rules/available             → obtener pricingRuleId elegida
           ?courseId=X&studentCategory=REGULAR
4. POST /api/payments/validate                   → confirmar antes de cobrar
5. POST /api/payments/process          🔒        → procesar pago y generar inscripción
6. GET  /api/payments/status/{code}    🔒        → mostrar comprobante
```

---

## 🔧 Configuración CORS

El backend acepta peticiones de **cualquier origen** con los métodos `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` y todos los headers. No se requiere configuración adicional en el frontend durante desarrollo.

```javascript
// Ejemplo con fetch
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@mail.com', password: '123456' })
});
const data = await response.json();
const token = data.token;

// Petición autenticada
const users = await fetch('http://localhost:8080/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 📚 Recursos adicionales

- **Swagger UI interactivo**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) — permite probar todos los endpoints directamente desde el navegador.
- **OpenAPI spec**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs) — JSON importable en Postman o Insomnia.

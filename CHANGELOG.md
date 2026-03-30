# 📝 Registro de Cambios - Academia de Baile Frontend

> **Última actualización**: 29 de marzo de 2026

---

## 🆕 Cambios Recientes

### **25 de marzo de 2026** (hace 4 días)
**Commit**: `8c566ab`

- ✨ Actualización del catálogo de clases
- 🎨 Modificación de colores de fondo en las páginas de login y registro

---

### **24 de marzo de 2026** (hace 5 días)
**Commit**: `2144018`

- 🎨 **Modernización del dashboard** con diseño vibrante
- 🔗 Agregado enlace al dashboard en el menú de navegación

---

### **23 de marzo de 2026** (hace 6 días)

#### **Gestión de Usuarios y Profesores**
**Commits**: `9bb06f2`, `f0dc81c`, `56d9436`

- 👥 **Implementación del sistema de gestión de usuarios** 
  - Gestión completa de profesores y alumnos
  - Menú dropdown para navegación entre secciones
- 👨‍🏫 **Funcionalidad completa de gestión de profesores**
  - Crear, editar y visualizar profesores
- 🔧 Corrección en la asignación de roles al crear/editar profesores
- 🔒 Corrección en la detección de roles de administrador

#### **Gestión de Cursos**
**Commits**: `24d6529`, `5b504a3`

- 📚 **Funcionalidad completa de gestión de cursos para administradores**
  - CRUD completo de cursos
  - Interfaz administrativa mejorada
- 🧹 Eliminación de código de debug de la sección de cursos

#### **Correcciones Técnicas**
**Commit**: `ea9e006`

- 🛠️ Corrección de error de localStorage en SSR (Server-Side Rendering)

---

### **22 de marzo de 2026** (hace 7 días)

**Commits**: `1da34a1`, `9ea88dc`

- 📖 Creación de **página de catálogo de cursos** con listado completo
  - Vista pública de todos los cursos disponibles
  - Diseño responsive y atractivo
- 🎨 Implementación de **autenticación visual en el header**
  - Indicadores de sesión activa
  - Menú contextual según usuario autenticado

---

## 🏗️ Desarrollo de Funcionalidades (Fases Anteriores)

### **Fase 2: Módulos Académicos**
**Commits**: `d30e375`, `3b5c932`

- ✅ Agregados módulos de **Sesiones de Clase y Asistencias**
  - Control de asistencia de estudiantes
  - Gestión de sesiones programadas
- ✅ Agregados módulos de **Cursos, Estudiantes e Inscripciones**
  - Sistema completo de inscripción
  - Gestión de estudiantes

### **Fase 1: Servicios y Base**
**Commit**: `3fbbdf3`

- ✅ Implementación de **servicios completos** según documentación API
  - AuthService
  - UserService
  - CourseService
  - StudentService
  - EnrollmentService
  - ClassSessionService
  - AttendanceService
  - PaymentService
  - PricingService
  - RoleService
  - TestService

### **Diseño y Contenido**
**Commit**: `46a29a1`

- 💃 Sección **"Nuestras Disciplinas"** con tarjetas informativas
  - Ballet clásico
  - Hip Hop
  - Salsa

---

## 🎯 Resumen de Funcionalidades Implementadas

### ✅ Autenticación y Autorización
- Login y registro de usuarios
- Guards de autenticación
- Interceptores JWT
- Control de roles (Administrador, Profesor, Alumno)

### ✅ Gestión Administrativa
- **Usuarios**: CRUD completo con roles
- **Profesores**: Gestión especializada
- **Cursos**: Administración completa
- **Estudiantes**: Gestión y seguimiento

### ✅ Módulos Académicos
- Catálogo público de cursos
- Inscripciones de estudiantes
- Sesiones de clase
- Control de asistencias
- Sistema de pagos (en desarrollo)

### ✅ Interfaz de Usuario
- Dashboard modernizado
- Header con autenticación visual
- Diseño responsive
- Colores y estilos actualizados

---

## 🔧 Tecnologías Utilizadas

- **Framework**: Angular 18+
- **Lenguaje**: TypeScript
- **Estilos**: CSS nativo
- **Backend**: Spring Boot 3.5.11 + Java 21
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)

---

## 📚 Documentación Relacionada

- [API_FRONTEND.md](./API_FRONTEND.md) - Documentación completa de la API
- [README.md](./README.md) - Información general del proyecto

---

*Generado automáticamente el 29 de marzo de 2026*

# 🎓 PartyPlanner

**PartyPlanner** es una aplicación web académica diseñada para estudiantes universitarios que quieren **organizar su vida académica de forma inteligente, visual y colaborativa**.  
Permite gestionar semestres, ramos, notas, asistencia, horarios, progreso y trabajar en conjunto con un compañero (“Duo”) para comparar avances y rendimiento.

---

## 🌐 Demo en línea

👉 [Abrir PartyPlanner](https://jeanalexandrevergarausm.github.io/PartyPlanner)

---

## 🧠 Descripción general

PartyPlanner combina herramientas de planificación académica, análisis de progreso, colaboración entre pares e integración con servicios externos (Firebase, Google Calendar y un bot con IA).  

El objetivo principal es **centralizar toda la información universitaria del estudiante** en una sola plataforma:

- Perfil y datos personales.
- Semestres y ramos.
- Notas, asistencia y horarios.
- Malla curricular y progreso en la carrera.
- Colaboración y comparación con un Duo.
- Integración con **Google Calendar** y sistema de **recordatorios**.
- Interacción con un **asistente inteligente** que responde preguntas y ejecuta acciones.

---

## 💡 Objetivos

- Facilitar la **organización académica** de los estudiantes.
- Permitir una **gestión visual** de semestres, ramos y malla curricular.
- Ofrecer una experiencia **colaborativa** entre compañeros (“Duo”).
- Integrar un **asistente inteligente** capaz de responder preguntas y realizar acciones dentro de la app.
- Conectarse con herramientas externas como **Google Calendar** para centralizar eventos académicos.

---

## ✨ Funcionalidades principales

### 🧍‍♂️ Perfil

- Gestión de **nombre, correo, fecha de nacimiento, universidad, carrera y color favorito**.
- Subida de **foto o avatar** (con imagen por defecto).
- Opción de **eliminar o cambiar el avatar**.
- Sincronización del perfil con **Firebase**.
- Configuración visual (color favorito) que se refleja en distintas vistas.
- Selector persistente de **modo oscuro o claro**.
- El bot puede responder, entre otras:
  - “¿Cuál es mi universidad?”
  - “¿Cuántos años tengo?”
  - “¿Cuál es mi correo universitario?”
  - “¿Cómo cambio mi color favorito?”
- Soporte para consultar información del **Duo** (nombre, carrera, color favorito, cumpleaños, etc.).

---

### 📚 Semestres

- Creación y gestión de **semestres académicos** (ej: `2025-1`, `2025-2`).
- Asociación automática con la universidad definida en el perfil.
- Añadir, editar y eliminar **ramos** dentro de cada semestre.
- Configuración de cada ramo:
  - Nombre, código, profesor, sección/paralelo, color, asistencia obligatoria, etc.
- Vista del **semestre activo** y cambio rápido entre semestres.
- Vista compartida del **semestre del Duo**.

#### Comandos de bot (ejemplos)

**Usuario:**

- “¿Cuántos ramos estoy tomando este semestre?”
- “¿Qué ramos tengo este semestre?”
- “¿Cuántos semestres hay registrados?”
- “¿Cuál es mi semestre actual?”
- “¿Qué ramo tiene asistencia obligatoria?”
- “¿El ramo X tiene asistencia obligatoria?”
- “¿Cómo se llama el profesor de X (ramo)?”
- “¿Cuál es el código de X (ramo)?”
- “¿Cuál es el paralelo de X (ramo)?”
- “¿Cuál es el color de X (ramo)?”

**Duo:**

- “¿Cuántos ramos está tomando mi Duo este semestre?”
- “¿Qué ramos tiene mi Duo este semestre?”
- “¿Qué ramo de mi Duo tiene asistencia obligatoria?”
- “¿Cuántos semestres tiene mi Duo registrados?”
- “¿Cuál es el semestre actual de mi Duo?”
- “¿Cuántos ramos tomó mi Duo el semestre XXXX-X?”
- “¿Cómo se llama el profesor de X (ramo) de mi Duo?”
- “¿Cuál es el paralelo de X (ramo) de mi Duo?”

**Acciones sobre semestres/ramos:**

- “Quiero que crees un nuevo semestre.”
- “Quiero que dejes como activo el semestre XXXX-X.”
- “Quiero que agregues un ramo al semestre actual/anterior/XXXX-X.”
- “Quiero que edites un ramo del semestre actual/anterior/XXXX-X.”  
  (nombre, código, profesor, paralelo, color, etc.)
- “Quiero que elimines un ramo del semestre actual/anterior/XXXX-X.”
- “Quiero que elimines el semestre actual/anterior/XXXX-X.”

---

### 📊 Notas

- Gestión de **evaluaciones** por ramo (certámenes, tareas, controles, labs, etc.).
- Definición de **fórmulas personalizadas** para el promedio final:
  - Sumas, ponderaciones, porcentajes.
  - Uso de notas finales de otros ramos via `finalCode("CODIGO")` o `final("Nombre")`.
- Simulador de notas:
  - Permite proyectar diferentes escenarios.
  - Calcula la nota mínima necesaria para aprobar.
- Estado del ramo:
  - Promedio actual.
  - Condición de aprobado/reprobado.
- Reglas de aprobación personalizadas, con guardado automático y confirmación visual.
- Capacidad de comparar resultados con el **Duo**.

---

### 📅 Calendario académico

- Calendario mensual con tres vistas:
  - **Propio** (eventos del usuario).
  - **Duo** (eventos del compañero).
  - **Combinado** (ambos calendarios superpuestos).
- Creación rápida de eventos:
  - Haciendo clic en un día se abre un **modal** para:
    - Título, fecha, hora de inicio y término.
    - Asignar ramo y usar su color.
    - Configurar **repetición** (día, mes, año).
    - Marcar el evento como **persistente** para semestres futuros.
    - Convertirlo en **tarea** y marcarla como completada o pendiente desde el calendario.
- Edición/eliminación:
  - Clic en un evento para editarlo.
  - Botón “✕” en cada evento para eliminarlo.
- Colores automáticos en función del ramo.
- Sincronización en tiempo real con **Firestore**.

#### 🔗 Importación desde Google Calendar

- Conexión con **Google Calendar API** usando OAuth (Google Identity Services).
- Botón **“Importar Google Calendar”** en el calendario.
- Modal para elegir **rango de fechas**:
  - Fecha de inicio.
  - Fecha de término.
- Importación de todos los eventos del calendario `primary` en ese intervalo:
  - Soporte para eventos de día completo o con hora.
  - Guardado en Firestore con marca `source: "google"` y `gcalId` para evitar duplicados.
- Integrado con el semestre activo; los eventos importados aparecen en la vista **Propio** y se mezclan en la vista **Combinado**.

---

### 🔔 Recordatorios

- Sistema de **recordatorios personales** almacenados en `reminders` (Firestore).
- Funciones internas para listar recordatorios:
  - Por rango estándar: **hoy**, **semana**, **mes**.
  - Por **fechas específicas**, **meses**, **años** o **rangos arbitrarios**.
- Soporte para:
  - Recordatorios del usuario.
  - Recordatorios del **Duo** (`listPairReminders`) y vista combinada.
- Posibilidad de:
  - **Suspender** un recordatorio.
  - **Reanudar** un recordatorio suspendido.

*(La UI actual muestra principalmente los recordatorios del día en la vista combinada; el modelo de datos ya está preparado para extensiones futuras.)*

---

### 🗺️ Malla curricular

- Visualización de la **malla de la carrera** a partir de archivos CSV.
- Muestra:
  - Semestre recomendado.
  - Prerrequisitos.
  - Estado (aprobado, cursando, pendiente).
- Diseño en cuadrícula, optimizado para lectura por año/semestre.
- Opciones de **exportar** la malla (por ejemplo como imagen/PDF usando html2canvas + jsPDF).

---

### 📅 Horario

- Constructor de horario semanal:
  - Bloques por día y hora.
  - Diferenciación por color de ramo.
- Posibilidad de ver el **horario del Duo**.
- Simulador de paralelos con distribución automática de choques: izquierda/derecha y cuatro cuadrantes cuando se combinan mitades superior/inferior.
- Exportación del horario a **imagen o PDF**.

---

### 📋 Asistencia

- Registro de asistencia por ramo:
  - **Presente**, **Ausente**, **No hubo clase**.
- Resumen por ramo y por fecha.
- Integración con otras vistas (por ejemplo, semestres y progreso).

---

### 🎉 Party / Duo

- Sistema de emparejamiento (“Party”) para conectar estudiantes en un **Duo**:
  - Generación de un **ID único** para invitar a otra persona.
  - Aceptación y vinculación de cuentas.
- Funcionalidades compartidas:
  - Ver los **semestres, ramos y colores** del Duo.
  - Comparar **notas**, **malla**, **progreso**, **horario** y **calendario**.
  - Recordatorios combinados.
- Opción para **desvincular** el Duo o eliminar la Party.

---

### 🆘 Centro de Ayuda

- Pestaña con un **Centro de Ayuda interactivo**:
  - Secciones: Perfil, Semestres, Notas, Malla, Horario, Asistencia, Party, etc.
  - Cada sección dividida en:
    - **Usuario** → preguntas sobre ti.
    - **Duo** → preguntas sobre tu compañero.
    - **Acciones** → cosas que el bot puede hacer dentro de la app.
- Implementado con `<details>` y `<summary>` para una lectura cómoda.

---

## 🤖 Asistente inteligente (resumen)

El asistente se integra con la arquitectura de datos de PartyPlanner y permite:

- **Consultar información** de Perfil, Semestres, Ramos, Notas, Duo, etc.
- **Ejecutar acciones**:
  - Crear/eliminar/editar semestres.
  - Agregar/editar/eliminar ramos.
  - Cambiar el semestre activo.
  - (Extensible a otras acciones en módulos futuros).

Los comandos de ejemplo listados más arriba (Semestres, Duo, Acciones) forman parte del catálogo actual y de la base para futuras ampliaciones.

---

## 🔐 Datos y conectividad

PartyPlanner funciona siempre en línea. Los documentos privados de Firestore se mantienen únicamente en memoria mientras la pestaña está abierta; no se ofrece almacenamiento offline persistente. La caché normal de los archivos estáticos de la web permanece disponible para acelerar la carga.

---

## ⚙️ Tecnologías utilizadas

| Área | Tecnologías |
|------|-------------|
| **Frontend** | HTML5, CSS3 (gradientes, variables, animaciones), JavaScript ES6, Vite |
| **Estado / Router** | Módulos JS propios (state.js, router.js, etc.) |
| **Backend / API** | Node.js/Vercel en repositorio privado; integración IA reservada para una fase futura |
| **Autenticación & Base de datos** | Firebase Authentication, Firestore |
| **IA / NLU** | Arquitectura y backend privado conservados; integración desactivada hasta una fase futura |
| **Integraciones externas** | Google Calendar API (lectura, OAuth con Google Identity Services) |
| **Exportaciones** | html2canvas, jsPDF |
| **Control de versiones** | Git & GitHub |

---

## 🚧 Mejoras futuras (roadmap)

Prioridad aproximada:  
`★★★` alta – `★★` media – `★` baja.

- `★★★` **Permitir emparejamientos entre más de dos usuarios**  
  - Grupos de estudio con 3+ integrantes, comparación múltiple de notas y progreso.

- `★★★` **Permitir bloqueos de pestañas para ciertos usuarios**  
  - Control de acceso: por ejemplo, permitir solo lectura al Duo en algunas pestañas.

- `★★` **Implementar las mejoras del bot en todas las pestañas**  
  - Más acciones y consultas en Notas, Asistencia, Horario, Malla, Progreso, Recordatorios, etc.

- `★★` **Mejorar la experiencia en otros dispositivos**  
  - Ajustes de diseño para tablets y móviles (breakpoints, tamaños de fuente, grid responsive).

- `★★★` **Convertir PartyPlanner en una aplicación móvil**  
  - App (PWA o nativa) con **notificaciones push** para:
    - Clases.
    - Evaluaciones.
    - Recordatorios personalizados.

---

## 👥 Autor

Proyecto desarrollado por **Jean Alexandre Vergara**  
Universidad Técnica Federico Santa María  

📧 jean.vergara@usm.cl  

---

⭐ *Si te gustó el proyecto, considera dejar una estrella en GitHub.*  

# Contexto de la Aplicación: Gestor de Programas

## 📌 ¿Qué hace la aplicación?
El **Gestor de Programas** es una aplicación web diseñada para llevar un registro estructurado de software o aplicaciones. Permite a los usuarios administrar un catálogo de programas, facilitando la adición, edición, búsqueda y gestión de los mismos.

## ⚙️ ¿Cómo funciona?
La aplicación es una Single Page Application (SPA) construida con tecnologías web estándar (HTML, CSS, JavaScript) y estilizada utilizando Tailwind CSS para una interfaz moderna y responsiva.

### Características Principales:
1. **Gestión de Programas (CRUD)**:
   - **Añadir**: Ingresar nuevos programas con detalles como Nombre, Versión, Información de Uso y URL.
   - **Leer/Buscar**: Visualizar la lista de programas almacenados con un contador en tiempo real y filtrar programas mediante una barra de búsqueda.
   - **Actualizar**: Editar la información de un programa existente.
   - **Eliminar**: Vaciar la lista completa o gestionar duplicados.

2. **Gestión de Datos**:
   - **Cargar Datos**: Importar listas de programas desde archivos JSON con opciones de añadir, actualizar o reemplazar la lista actual.
   - **Descargar Datos**: Exportar el listado actual en formato JSON para guardar o compartir.
   - **Cargar Respaldo**: Recuperar información desde un archivo de respaldo (como `programas_bkup.json`).
   - **Limpieza de Datos**: Botones dedicados para eliminar duplicados y vaciar la lista de programas.

3. **Interfaz de Usuario**:
   - Sistema de modales para añadir/editar programas de forma no intrusiva.
   - Opciones de importación contextuales que se revelan al momento de cargar un archivo.
   - Diseño responsivo adaptado para funcionar correctamente tanto en computadoras de escritorio como en dispositivos móviles.

## 📝 Registro de Cambios (Changelog)

A continuación, se documentarán los cambios, actualizaciones y mejoras que vayamos realizando en la aplicación.

### 28/04/2026 - Corrección de Bugs y Rediseño Premium
- **Resolución de Crashes**: Se añadieron conversiones estrictas a `String()` en el buscador y en la función de ordenamiento alfabético para evitar que la aplicación falle silenciosamente al procesar campos vacíos en registros antiguos.
- **Búsqueda Avanzada**: El filtro de búsqueda ahora abarca los campos de Categoría y Plataforma. La barra de búsqueda se expandió a todo lo ancho de la vista.
- **Rediseño Premium y Modo Oscuro**: Se reescribió el HTML y el CSS (eliminando el código legacy) a favor de un diseño TailwindCSS Premium que incluye tipografía "Inter", soporte para **Modo Oscuro**, esquinas redondeadas tipo tarjetas, efectos de "Glassmorphism" y micro-animaciones en los botones.
- **Menú de Herramientas**: Para hacer la interfaz más minimalista, todos los botones de Respaldo y Carga de Archivos se ocultaron en un moderno submenú engranaje (Dropdown de Herramientas) ubicado en la barra superior.
- **Ocultamiento de Acciones**: Las opciones de "Editar" y "Eliminar" de cada programa se ocultaron en un menú de 3 puntos (⋮) tipo kebab en la esquina superior derecha de las tarjetas.
- **Nuevas Aplicaciones Agregadas**: Se importaron 11 nuevas aplicaciones de escritorio al catálogo (Everything, EaseUS Disk Copy, Revo Uninstaller, MiPony, DDU, HWiNFO 64, Nucleus CO-OP, Lively, QuickLook, NanaZip, Greenshot).
- **Fix de Eventos**: Cambio de `keyup` a `input` en la barra de búsqueda para mejorar la reactividad ante eventos del portapapeles.

### [Actualización - Soporte para Web Apps y Categorías]
- Se agregaron campos nuevos a los programas: `Plataforma` ("Aplicación de Escritorio" o "Web App") y `Categoría` (ej. Ofimática, Almacenamiento en la Nube, Inteligencia Artificial, Ocio, Gaming, etc.).
- Se actualizó el formulario modal para permitir el ingreso de esta información.
- Se agregaron etiquetas (badges) de colores a cada elemento de la lista para mostrar visualmente a qué plataforma y categoría pertenece.
- Se implementaron filtros desplegables en la interfaz principal que permiten filtrar rápidamente la lista por plataforma o por categoría, además de la barra de búsqueda existente.
- Se actualizó la base de datos de respaldo (`programas_bkup.json`) migrando las aplicaciones anteriores e integrando 25 nuevas herramientas (Google Suite, Gemini, CapCut Web, Xbox Cloud Gaming, entre otras).

### [Versión Inicial]
- Estructura base del proyecto (HTML, CSS, JavaScript).
- Implementación de Tailwind CSS vía CDN para estilos.
- Funcionalidad de agregar, editar, buscar y exportar programas en JSON.
- Opciones de importación con estrategias de sobrescritura o adición.
- Creación de este archivo de contexto (`CONTEXTO_APLICACION.md`).

---
*Nota: Este archivo debe ser actualizado cada vez que se implemente una nueva funcionalidad o se realice un cambio significativo en la lógica o diseño de la aplicación.*

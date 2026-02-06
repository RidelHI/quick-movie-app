# Arquitectura base (Quick Movie App)

Objetivo: construir una app profesional y escalable con Angular 21, enfocada en Home + Detail primero, usando una arquitectura feature-first, señales y stores con @ngrx/signals.

## Principios

- Feature-first con capas claras y limites de responsabilidad.
- Store por feature con estado explicito y efectos para side effects.
- Separacion estricta entre DTOs de la API y modelos de dominio.
- UI desacoplada del estado, con componentes presentacionales reutilizables.
- Configuracion global centralizada para evitar repeticion.
- Preparado para escalar y para incorporar features experimentales sin contaminar lo estable.

## Estructura de carpetas

- src/app/app.config.ts: providers globales, http, router, interceptors.
- src/app/app.routes.ts: routing principal y lazy loading de features.
- src/app/core: autenticacion (incluye UI de auth), interceptors, error handling, logging.
- src/app/shared: UI reutilizable, pipes, directivas, utilidades puras y configuracion compartida.
- src/app/features: features aisladas por dominio funcional.

## Estructura por feature

- data-access: llamadas a la API y adaptadores.
- domain: DTOs, modelos y mappers del feature.
- state: store y estado del feature.
- ui: pages y componentes presentacionales.

## Data access y TMDB

- Un cliente TMDB centralizado en core/http.
- DTOs de TMDB en domain y mappers para modelos internos.
- Carga de configuracion base (imagenes, idiomas) en el arranque si aplica.
- Estrategia de cache simple para evitar peticiones duplicadas por pagina.

## State management (@ngrx/signals)

- Un store por feature con estado claro.
- HomeStore: items, page, totalPages, loading, error, filters, query.
- DetailStore: movie, credits, loading, error.
- Computed selectors para derived state como canLoadMore e isEmpty.
- Efectos para llamadas a la API y paginacion.

## UI y experiencia

- Grid responsivo con breakpoints y columnas adaptativas.
- Infinite scroll con umbral, bloqueo por loading y control de totalPages.
- Skeletons durante carga y estados vacios bien definidos.
- Navegacion clara desde lista a detalle y back behavior predecible.

## Convenciones

- Nombres claros y consistentes por dominio.
- Servicios sin logica de UI.
- Componentes UI sin acceso directo a API ni stores.
- Logs y manejo de error centralizados.

## Testing (base)

- Unit tests para mappers y stores.
- Tests basicos de UI para estados de carga, vacio y error.

## Alcance inicial

- Home con listas de peliculas y infinite scroll.
- Detail con informacion principal y secciones basicas.

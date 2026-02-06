# AI Context - Quick Movie App

## Objetivo

SPA profesional con Angular 21 para consumir TMDB y practicar el Angular way moderno.

## Alcance actual

- Autenticacion de usuario TMDB v4 (request_token -> approval -> access_token).
- Listado simple de 10 peliculas recientes (now_playing) y luego evolucionar a Home + Detail.
- Sin backend.

## Arquitectura

- Feature-first: core, shared, features.
- DTOs por feature en `domain/dto`.
- Modelos por feature en `domain/models`.
- Mappers puros por feature en `domain/mappers`.
- Data-access separado de UI y state por feature.
- Auth UI y servicios de autenticacion viven en core/auth.

## Estado y datos

- Stores por feature.
- Signals para estado local.
- Evitar logica de red en componentes UI.

## UI

- Standalone components.
- Routing lazy en features.
- Estado de carga, error y vacio visibles.

## Preferencias de desarrollo

- Enfoque guiado: explicar por que y buenas practicas, pero el usuario codifica la mayor parte.
- Si se implementa codigo, que sea minimo, claro y alineado a Angular way.

## Seguridad y limites

- Token de TMDB se mantiene en sessionStorage para la demo.
- Sin manejo de secretos del lado servidor.

## Estilo

- Nombres en ingles para carpetas/archivos.
- Comentarios solo cuando agregan claridad.

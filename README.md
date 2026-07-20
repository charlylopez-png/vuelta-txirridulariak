# LA VUELTA TXIRRIDULARIAK 2026

App de porra fantasy para La Vuelta a España 2026 (22 ago – 13 sep, 21 etapas).
Misma arquitectura que TOUR-2026, adaptada:
- Sin crono por equipos (La Vuelta 2026 solo tiene 2 CRI individuales, etapas 1 y 18)
- Tema visual rojo de La Vuelta + detalle bandera de España
- Maillots: rojo (general), verde (puntos/regularidad), lunares (montaña)

## Archivos

- `index.html` — dashboard público
- `admin.html` — panel privado (introducir resultados, participantes, baremo, publicar)
- `motor-puntos.js` — motor de cálculo de clasificaciones
- `maestros.js` — corredores y equipos con precio (**pendiente de rellenar**)
- `estilo.css` — estilo visual La Vuelta
- `data.json` — calendario de las 21 etapas + resultados + participantes (vacío hasta que arranque)
- `img/logo-vuelta.png` — logo oficial subido

## Pasos para poner en marcha

1. **Crear repositorio nuevo en GitHub** (público, con GitHub Pages activado desde `main` / raíz).
2. Subir estos 7 archivos + la carpeta `img/`.
3. En `admin.html`, sección "Configuración GitHub": introducir owner, nombre del repo, rama y un **Fine-Grained Personal Access Token** con permiso `Contents: Read & Write` sobre ese repo.
4. Cuando tengas la lista oficial de corredores/equipos de La Vuelta 2026 (normalmente se confirma 1-2 semanas antes de la salida), rellenar `maestros.js` con id/nombre/equipo/precio de cada corredor, y los 3 equipos con precio.
5. Revisar y ajustar `BAREMO_DEFECTO` en `motor-puntos.js` (o directamente desde la pestaña "Puntuación" del admin) con los valores reales de tu Excel — los que hay ahora son **provisionales**.
6. Importar participantes desde el admin (formato `Nombre; corredor1,...,corredor9; equipo1,equipo2,equipo3`).
7. Cada etapa: introducir resultados desde el admin y pulsar "Publicar cambios en GitHub".

## Pendiente / próximas fases

- Corredores y equipos oficiales de La Vuelta 2026 (`maestros.js`)
- Baremo de puntuación definitivo
- Réplica de las funcionalidades avanzadas del Tour (Equipo ideal, Rentabilidad, VAR, ¿Quién tiene a...?, exportación PNG) — se pueden ir añadiendo etapa a etapa, igual que se hizo en TOUR-2026
- Verificar filename al descargar `index.html` (el navegador a veces lo guarda como `index (1).html`; hay que renombrarlo antes de subirlo)

© Datos de recorrido: La Vuelta / A.S.O.

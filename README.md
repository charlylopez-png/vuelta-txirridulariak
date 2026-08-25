# LA VUELTA TXIRRINDULARIAK 2026

App de porra fantasy para La Vuelta a España 2026 (22 ago – 13 sep, 21 etapas).

Esta versión reutiliza el **código real y probado de TOUR-2026** (misma lógica de
`motor-puntos.js`, mismo panel admin, misma UI), con:

- Rebranding visual completo a La Vuelta (rojo `#C5291A` en vez de amarillo, logo,
  textos, enlaces a lavuelta.es en vez de letour.fr)
- Calendario real de las 21 etapas de La Vuelta 2026 ya cargado
- **Datos de prueba**: los 41 participantes, corredores y equipos son los del
  Tour, puestos ahí solo para poder ver la app funcionando con datos reales
  mientras no están los de La Vuelta. Hay que sustituirlos antes de arrancar
  de verdad (ver "Pendiente" más abajo).
- Sin contrarreloj por equipos activa (La Vuelta 2026 no tiene esa etapa), aunque
  el código que la soporta sigue ahí por si algún año se necesitara — simplemente
  no se activa porque ninguna etapa del calendario es de tipo `contrarreloj_equipos`.

## Archivos

- `index.html` — dashboard público
- `admin.html` — panel privado (contraseña de acceso: `vuelta2026`, cámbiala en
  la constante `PASSWORD_ADMIN` antes de compartir el enlace)
- `motor-puntos.js` — motor de cálculo de clasificaciones (idéntico al del Tour)
- `maestros.js` — corredores y equipos con precio (**ahora mismo son los del Tour, de prueba**)
- `estilo.css` — estilo visual La Vuelta
- `data.json` — calendario de las 21 etapas + participantes de prueba (del Tour) + resultados vacíos
- `assets/vuelta-logo.png` y `assets/favicon.png` — logo oficial subido

## Configuración del panel admin

El admin guarda la config de GitHub en localStorage con claves `porra_vuelta_*`
(distintas de las `porra_*` que usa TOUR-2026), para que puedas tener las dos
apps abiertas en el mismo navegador sin que se pisen la configuración
(ambas viven bajo el mismo dominio `charlylopez-png.github.io`).

## Pasos para poner en marcha de verdad

1. Cuando tengas la lista oficial de corredores/equipos de La Vuelta 2026,
   sustituir en `maestros.js` el array `CORREDORES_MAESTRO`, `PRECIOS` y el
   listado de equipos por los reales.
2. Rehacer `data.json` → `participantes` con las selecciones reales de tus ~30-35
   amigos (mismo formato que ahora, solo cambian los IDs de corredor/equipo).
3. Revisar el baremo de puntuación en `motor-puntos.js` (`TABLA_PUNTOS_DEFECTO`)
   — ahora mismo es el mismo que en el Tour; contrastar con tu Excel por si La
   Vuelta usa otros valores.
4. Cambiar la contraseña del admin (`PASSWORD_ADMIN` en `admin.html`).
5. (Opcional) Añadir las imágenes de perfil oficial de cada etapa en
   `PERFILES_ETAPAS` dentro de `maestros.js` (están vacías por ahora).
6. Vaciar `resultados` en `data.json` si aún tiene algo de prueba, y empezar a
   cargar etapa a etapa desde el admin.

## Pendiente / próximas fases

- Corredores, equipos y participantes reales de La Vuelta 2026
- Imágenes de perfil oficial de etapa
- Verificar filename al descargar (a veces el navegador guarda `index (1).html`; hay que renombrarlo antes de subirlo)

© Datos de recorrido: La Vuelta / A.S.O.

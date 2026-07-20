/* =========================================================
   LA VUELTA TXIRRIDULARIAK — Maestros (corredores y equipos)
   PENDIENTE: rellenar cuando se confirmen los equipos/corredores
   de La Vuelta 2026 (normalmente 1-2 semanas antes de la salida,
   22/08/2026). Estructura idéntica a la usada en TOUR-2026 para
   que el motor de puntos y el resto de la app funcionen igual.
   ========================================================= */

const MAESTROS = {

  // Un corredor por línea cuando los tengamos:
  // { id: "APELLIDO_NOMBRE", nombre: "Nombre Apellido", equipo: "SIGLAS_EQUIPO", precio: 120 }
  corredores: [
    // EJEMPLO (borrar al cargar los reales):
    // { id: "EVENEPOEL_REMCO", nombre: "Remco Evenepoel", equipo: "SOQ", precio: 230 },
  ],

  // Un equipo por línea. "precio" es el coste para elegirlo en la
  // clasificación por equipos (3 equipos por participante).
  equipos: [
    // EJEMPLO (borrar al cargar los reales):
    // { id: "SOQ", nombre: "Soudal Quick-Step", precio: 180 },
  ],

  // Presupuesto total disponible por participante para fichar
  // 9 corredores + 3 equipos (mismo criterio que TOUR-2026,
  // ajustar si La Vuelta usa otro tope).
  presupuesto: 2000
};

if (typeof module !== "undefined") module.exports = MAESTROS;

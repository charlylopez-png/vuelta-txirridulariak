/* =========================================================
   LA VUELTA TXIRRIDULARIAK — Motor de puntos
   Adaptado de TOUR-2026, simplificado: no existe crono por
   equipos en La Vuelta 2026 (solo 2 CRI individuales,
   etapas 1 y 18), así que no hay campo "etapaEquipos".

   Categorías puntuables cada etapa:
     - etapa      -> resultado de la etapa del día
     - general    -> clasificación general (maillot rojo) tras la etapa
     - puntos     -> clasificación por puntos (regularidad, maillot verde)
     - montana    -> clasificación de la montaña (maillot lunares)
     - equipos    -> clasificación por equipos tras la etapa

   BAREMO: valores de partida (PLACEHOLDER). Sustituir por los
   definitivos del Excel de Carlos, o los mismos que TOUR-2026
   si el reglamento es idéntico. Editable también desde el panel
   de administración (pestaña Puntuación) y persistido en data.json.
   ========================================================= */

const BAREMO_DEFECTO = {
  etapa:    [50, 40, 32, 26, 22, 18, 15, 13, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  general:  [12, 10, 8, 6, 5, 4, 3, 2, 1],
  puntos:   [12, 10, 8, 6, 5, 4, 3, 2, 1],
  montana:  [12, 10, 8, 6, 5, 4, 3, 2, 1],
  equipos:  [10, 7, 5, 4, 3, 2, 1],
  bonus_final: {
    general:  [200, 150, 120, 90, 70, 50, 40, 30, 20, 10],
    puntos:   [80, 60, 40, 20, 10],
    montana:  [80, 60, 40, 20, 10],
    equipos:  [60, 40, 20]
  }
};

function obtenerBaremo(data) {
  return (data && data.baremo) ? data.baremo : BAREMO_DEFECTO;
}

// Devuelve { riderId: participanteNombre } a partir del roster de cada participante
function mapaCorredorAParticipante(participantes) {
  const mapa = {};
  Object.entries(participantes || {}).forEach(([nombre, ficha]) => {
    (ficha.corredores || []).forEach(id => { mapa[id] = nombre; });
  });
  return mapa;
}

function mapaEquipoAParticipante(participantes) {
  const mapa = {};
  Object.entries(participantes || {}).forEach(([nombre, ficha]) => {
    (ficha.equipos || []).forEach(id => {
      if (!mapa[id]) mapa[id] = [];
      mapa[id].push(nombre);
    });
  });
  return mapa;
}

/**
 * Calcula puntos acumulados por participante hasta (e incluyendo) una etapa dada.
 * @param {object} data - data.json completo
 * @param {number} hastaEtapa - número de etapa límite (inclusive). Si se omite, todas.
 */
function calcularPuntosTotales(data, hastaEtapa) {
  const baremo = obtenerBaremo(data);
  const corredorAPart = mapaCorredorAParticipante(data.participantes);
  const equipoAPart = mapaEquipoAParticipante(data.participantes);

  const totales = {}; // nombre -> { etapa, general, puntos, montana, equipos, total }
  Object.keys(data.participantes || {}).forEach(nombre => {
    totales[nombre] = { etapa: 0, general: 0, puntos: 0, montana: 0, equipos: 0, total: 0 };
  });

  const etapasOrdenadas = Object.keys(data.resultados || {})
    .map(Number)
    .filter(n => hastaEtapa === undefined || n <= hastaEtapa)
    .sort((a, b) => a - b);

  etapasOrdenadas.forEach(numEtapa => {
    const resultado = data.resultados[numEtapa];
    if (!resultado) return;

    ["etapa", "general", "puntos", "montana"].forEach(categoria => {
      const ranking = resultado[categoria]; // { "1": riderId, "2": riderId, ... }
      const tabla = baremo[categoria] || [];
      if (!ranking) return;
      Object.entries(ranking).forEach(([puesto, riderId]) => {
        const pts = tabla[Number(puesto) - 1];
        if (!pts) return;
        const nombre = corredorAPart[riderId];
        if (nombre && totales[nombre]) totales[nombre][categoria] += pts;
      });
    });

    // Equipos: cada puesto puede beneficiar a varios participantes (comparten equipo)
    const rankingEquipos = resultado.equipos;
    if (rankingEquipos) {
      const tabla = baremo.equipos || [];
      Object.entries(rankingEquipos).forEach(([puesto, equipoId]) => {
        const pts = tabla[Number(puesto) - 1];
        if (!pts) return;
        (equipoAPart[equipoId] || []).forEach(nombre => {
          if (totales[nombre]) totales[nombre].equipos += pts;
        });
      });
    }
  });

  // Bonus de clasificación final (solo si se ha cargado el resultado especial "final")
  const final = (data.resultados || {}).final;
  if (final && (hastaEtapa === undefined || hastaEtapa >= 21)) {
    ["general", "puntos", "montana"].forEach(categoria => {
      const ranking = final[categoria];
      const tabla = (baremo.bonus_final || {})[categoria] || [];
      if (!ranking) return;
      Object.entries(ranking).forEach(([puesto, riderId]) => {
        const pts = tabla[Number(puesto) - 1];
        if (!pts) return;
        const nombre = corredorAPart[riderId];
        if (nombre && totales[nombre]) totales[nombre][categoria] += pts;
      });
    });
    const rankingEquiposFinal = final.equipos;
    if (rankingEquiposFinal) {
      const tabla = (baremo.bonus_final || {}).equipos || [];
      Object.entries(rankingEquiposFinal).forEach(([puesto, equipoId]) => {
        const pts = tabla[Number(puesto) - 1];
        if (!pts) return;
        (equipoAPart[equipoId] || []).forEach(nombre => {
          if (totales[nombre]) totales[nombre].equipos += pts;
        });
      });
    }
  }

  Object.values(totales).forEach(t => {
    t.total = t.etapa + t.general + t.puntos + t.montana + t.equipos;
  });

  return totales;
}

function clasificacionGeneral(data, hastaEtapa) {
  const totales = calcularPuntosTotales(data, hastaEtapa);
  return Object.entries(totales)
    .map(([nombre, detalle]) => ({ nombre, ...detalle }))
    .sort((a, b) => b.total - a.total);
}

// Ranking del día (solo puntos de la última etapa, para la vista "Última etapa")
function clasificacionEtapa(data, numEtapa) {
  const anterior = calcularPuntosTotales(data, numEtapa - 1);
  const actual = calcularPuntosTotales(data, numEtapa);
  return Object.keys(actual).map(nombre => ({
    nombre,
    puntosDia: actual[nombre].total - (anterior[nombre] ? anterior[nombre].total : 0)
  })).sort((a, b) => b.puntosDia - a.puntosDia);
}

// Flechas de posición respecto a la etapa anterior
function posicionesConVariacion(data, numEtapa) {
  const hoy = clasificacionGeneral(data, numEtapa).map(p => p.nombre);
  const ayer = clasificacionGeneral(data, numEtapa - 1).map(p => p.nombre);
  return hoy.map((nombre, i) => {
    const posAyer = ayer.indexOf(nombre);
    let variacion = 0;
    if (posAyer !== -1) variacion = posAyer - i;
    return { nombre, posicion: i + 1, variacion };
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    BAREMO_DEFECTO,
    calcularPuntosTotales,
    clasificacionGeneral,
    clasificacionEtapa,
    posicionesConVariacion
  };
}

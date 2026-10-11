const LEVELS = {
  green: { label: 'Carga manejable' },
  yellow: { label: 'Alerta preventiva' },
  red: { label: 'Sobrecarga crítica' },
};

function carePoints(hours) {
  if (hours > 6) return 3;
  if (hours >= 4) return 2;
  return 0;
}

function travelPoints(minutes) {
  if (minutes > 45) return 2;
  if (minutes >= 30) return 1;
  return 0;
}

function transportPoints(transport) {
  return transport === 'available' ? 0 : 1;
}

function supportPoints(support) {
  return support === 'none' ? 2 : support === 'partial' ? 1 : 0;
}

function restPoints(rest, selfCare) {
  return rest === 'insufficient' || selfCare === 'none' ? 1 : 0;
}

function schedulePoints(scheduleConflict) {
  return scheduleConflict === 'high' ? 1 : 0;
}

export function calculateScore(answers) {
  const care = carePoints(Number(answers.careHours));
  const travel = travelPoints(Number(answers.travelMinutes));
  const transport = transportPoints(answers.transport);
  const support = supportPoints(answers.support);
  const rest = restPoints(answers.rest, answers.selfCare);
  const schedule = schedulePoints(answers.scheduleConflict);
  const score = care + travel + transport + support + rest + schedule;

  const critical =
    Number(answers.careHours) > 6 ||
    (Number(answers.travelMinutes) > 45 && answers.transport === 'irregular') ||
    (answers.support === 'none' && (answers.rest === 'insufficient' || answers.selfCare === 'none'));

  const level = critical || score >= 7 ? 'red' : score >= 4 ? 'yellow' : 'green';
  const factors = [];

  if (care > 0) factors.push('La carga diaria de cuidado y tareas supera las tres horas.');
  if (travel > 0) factors.push('El desplazamiento hasta el punto de formación consume tiempo adicional.');
  if (transport > 0) factors.push('El transporte es irregular o difícil de anticipar.');
  if (support > 0) factors.push('La red de relevo en el hogar es parcial o insuficiente.');
  if (rest > 0) factors.push('El descanso y la recuperación son insuficientes.');
  if (schedule > 0) factors.push('Las clases se cruzan con labores obligatorias.');

  return { score, level, label: LEVELS[level].label, critical, factors };
}

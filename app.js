import { calculateScore } from './src/score.js';

const form = document.querySelector('#load-form');
const steps = [...document.querySelectorAll('.form-step')];
const nextButton = document.querySelector('#next-button');
const backButton = document.querySelector('#back-button');
const restartButton = document.querySelector('#restart-button');
const errorMessage = document.querySelector('#form-error');
const progressBar = document.querySelector('#progress-bar');
const stepCount = document.querySelector('#step-count');
const progressPercent = document.querySelector('#progress-percent');
const resultScreen = document.querySelector('#result-screen');
const formCard = document.querySelector('.form-card');
const resultCard = document.querySelector('#result-card');
const signalLight = document.querySelector('#signal-light');
const resultLevel = document.querySelector('#result-level');
const resultScore = document.querySelector('#result-score');
const resultWarning = document.querySelector('#result-warning');
const resultSummary = document.querySelector('#result-summary');
const factorList = document.querySelector('#factor-list');
const recommendationText = document.querySelector('#recommendation-text');

const state = {
  currentStep: 0,
  answers: {},
};

const resultCopy = {
  green: {
    summary: 'Tus respuestas muestran una disponibilidad relativamente estable para participar en la ruta formativa.',
    warning: 'Tu carga parece manejable hoy. Aun así, reconocer tus tiempos ayuda a cuidar el equilibrio que has construido.',
    recommendation: 'Mantén cerca a las personas que te apoyan y avisa si cambia tu rutina de cuidado, descanso o traslado.',
  },
  yellow: {
    summary: 'Tu tiempo está bastante ajustado y puede hacer más difícil llegar con regularidad a las clases.',
    warning: 'Hay una alerta preventiva. Algunas adaptaciones pueden ayudarte a continuar sin sumar más presión a tu día.',
    recommendation: 'Conversa con el equipo de Yarú sobre flexibilidad de llegada, guías para estudiar en casa o una tutoría cercana.',
  },
  red: {
    summary: 'Tus respuestas muestran una sobrecarga importante de tiempo, desplazamiento, cuidado o descanso.',
    warning: 'Hay señales de sobrecarga crítica. Tu asistencia necesita acompañamiento y acuerdos que reconozcan lo que sostienes cada día.',
    recommendation: 'El equipo de Yarú puede activar un contacto empático, revisar tu horario y ofrecer guías o tutoría veredal para que no tengas que resolverlo sola.',
  },
};

function readStepAnswers() {
  const activeStep = steps[state.currentStep];
  const inputs = [...activeStep.querySelectorAll('input')];
  const questionNames = [...new Set(inputs.map((input) => input.name))];

  questionNames.forEach((name) => {
    const selected = inputs.filter((input) => input.name === name && input.checked);
    if (inputs.some((input) => input.type === 'checkbox' && input.name === name)) {
      state.answers[name] = selected.map((input) => input.value);
    } else if (selected[0]) {
      state.answers[name] = selected[0].value;
    }
  });
}

function isStepValid() {
  const activeStep = steps[state.currentStep];
  const requiredRadio = activeStep.querySelector('input[type="radio"]');
  if (!requiredRadio) return true;
  return Boolean(activeStep.querySelector('input[type="radio"]:checked'));
}

function updateProgress() {
  const current = state.currentStep + 1;
  const percent = Math.round((current / steps.length) * 100);
  stepCount.textContent = `Pregunta ${current} de ${steps.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${(current / steps.length) * 100}%`;
  backButton.hidden = state.currentStep === 0;
  nextButton.innerHTML = state.currentStep === steps.length - 1
    ? 'Ver mi resultado <span aria-hidden="true">→</span>'
    : 'Continuar <span aria-hidden="true">→</span>';
}

function setStep(nextStep) {
  state.currentStep = nextStep;
  steps.forEach((step, index) => step.classList.toggle('is-active', index === state.currentStep));
  errorMessage.hidden = true;
  updateProgress();
  const legend = steps[state.currentStep].querySelector('legend');
  legend?.focus?.();
  window.scrollTo({ top: formCard.offsetTop - 24, behavior: 'smooth' });
}

function showError() {
  errorMessage.hidden = false;
  const firstInput = steps[state.currentStep].querySelector('input');
  firstInput?.focus();
}

function buildFactorList(factors) {
  factorList.replaceChildren();
  if (!factors.length) {
    const item = document.createElement('li');
    item.textContent = 'No aparecen barreras relevantes en tus respuestas de hoy.';
    factorList.append(item);
    return;
  }
  factors.forEach((factor) => {
    const item = document.createElement('li');
    item.textContent = factor;
    factorList.append(item);
  });
}

function showResult() {
  const result = calculateScore(state.answers);
  const copy = resultCopy[result.level];
  resultScreen.hidden = false;
  formCard.hidden = true;
  resultCard.dataset.level = result.level;
  signalLight.dataset.level = result.level;
  resultLevel.textContent = result.label;
  resultScore.textContent = `${result.score}/10`;
  resultSummary.textContent = copy.summary;
  resultWarning.textContent = copy.warning;
  recommendationText.textContent = copy.recommendation;
  buildFactorList(result.factors);
  resultScreen.focus?.();
  window.scrollTo({ top: resultScreen.offsetTop - 24, behavior: 'smooth' });
}

function resetForm() {
  state.currentStep = 0;
  state.answers = {};
  form.reset();
  resultScreen.hidden = true;
  formCard.hidden = false;
  steps.forEach((step, index) => step.classList.toggle('is-active', index === 0));
  signalLight.removeAttribute('data-level');
  resultCard.removeAttribute('data-level');
  updateProgress();
  errorMessage.hidden = true;
  window.scrollTo({ top: formCard.offsetTop - 24, behavior: 'smooth' });
}

nextButton.addEventListener('click', () => {
  readStepAnswers();
  if (!isStepValid()) {
    showError();
    return;
  }
  if (state.currentStep === steps.length - 1) {
    showResult();
    return;
  }
  setStep(state.currentStep + 1);
});

backButton.addEventListener('click', () => {
  readStepAnswers();
  setStep(Math.max(0, state.currentStep - 1));
});

restartButton.addEventListener('click', resetForm);

form.addEventListener('change', () => {
  errorMessage.hidden = true;
});

updateProgress();

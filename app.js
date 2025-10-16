import {
  createRoutineState,
  createExerciseInstance,
  addExercise,
  updateExercise,
  removeExercise,
  buildTimeline,
} from './scripts/routineState.js';

const exerciseLibrary = [
  {
    slug: 'sentadilla-barra',
    name: 'Sentadilla con barra',
    focus: 'Piernas y glúteos',
    icon: '🏋️',
    accent: 'linear-gradient(135deg, rgba(59,130,246,0.45), rgba(14,116,144,0.85))',
  },
  {
    slug: 'press-plano',
    name: 'Press de pecho plano',
    focus: 'Pectoral y tríceps',
    icon: '💪',
    accent: 'linear-gradient(135deg, rgba(244,114,182,0.45), rgba(251,191,36,0.75))',
  },
  {
    slug: 'remo-mancuerna',
    name: 'Remo con mancuerna',
    focus: 'Espalda y core',
    icon: '🏹',
    accent: 'linear-gradient(135deg, rgba(147,197,253,0.45), rgba(59,130,246,0.9))',
  },
  {
    slug: 'zancadas',
    name: 'Zancadas caminando',
    focus: 'Piernas y estabilidad',
    icon: '🚶',
    accent: 'linear-gradient(135deg, rgba(45,212,191,0.4), rgba(16,185,129,0.85))',
  },
  {
    slug: 'press-militar',
    name: 'Press militar de pie',
    focus: 'Hombros',
    icon: '🎯',
    accent: 'linear-gradient(135deg, rgba(244,63,94,0.4), rgba(251,113,133,0.85))',
  },
  {
    slug: 'dominadas',
    name: 'Dominadas con agarre prono',
    focus: 'Espalda y bíceps',
    icon: '🧗',
    accent: 'linear-gradient(135deg, rgba(165,180,252,0.45), rgba(99,102,241,0.85))',
  },
  {
    slug: 'plancha',
    name: 'Plancha frontal',
    focus: 'Core',
    icon: '🧘',
    accent: 'linear-gradient(135deg, rgba(96,165,250,0.35), rgba(56,189,248,0.7))',
  },
  {
    slug: 'hip-thrust',
    name: 'Hip thrust',
    focus: 'Glúteos',
    icon: '🔥',
    accent: 'linear-gradient(135deg, rgba(251,146,60,0.45), rgba(249,115,22,0.85))',
  },
];

const elements = {
  launch: document.getElementById('launch-screen'),
  app: document.getElementById('app'),
  library: document.getElementById('exercise-library'),
  thumbnails: document.getElementById('routine-thumbnails'),
  emptyStrip: document.getElementById('empty-strip'),
  viewRoutine: document.getElementById('view-routine'),
  thumbnailCount: document.getElementById('thumbnail-count'),
  editorOverlay: document.getElementById('editor-overlay'),
  editorTitle: document.getElementById('editor-title'),
  editorSubtitle: document.getElementById('editor-subtitle'),
  editorForm: document.getElementById('editor-form'),
  editorInputs: {
    sets: document.getElementById('editor-sets'),
    reps: document.getElementById('editor-reps'),
    weight: document.getElementById('editor-weight'),
    rest: document.getElementById('editor-rest'),
  },
  closeEditor: document.getElementById('close-editor'),
  cancelEditor: document.getElementById('cancel-editor'),
  timelineOverlay: document.getElementById('timeline-overlay'),
  timelineList: document.getElementById('timeline-list'),
  closeTimeline: document.getElementById('close-timeline'),
  saveRoutine: document.getElementById('save-routine'),
  confirmationOverlay: document.getElementById('confirmation-overlay'),
  closeConfirmation: document.getElementById('close-confirmation'),
  linkRoutine: document.getElementById('link-routine'),
  startRoutine: document.getElementById('start-routine'),
};

let state = createRoutineState();
let exerciseCounter = 1;
let editingExerciseId = null;

function hideLaunchScreen() {
  elements.launch?.classList.add('hidden');
  elements.app?.classList.remove('hidden');
}

function showOverlay(overlay) {
  overlay?.classList.add('is-visible');
  overlay?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function hideOverlay(overlay) {
  overlay?.classList.remove('is-visible');
  overlay?.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.overlay.is-visible')) {
    document.body.classList.remove('modal-open');
  }
}

function renderLibrary() {
  if (!elements.library) return;

  const fragment = document.createDocumentFragment();

  exerciseLibrary.forEach((exercise) => {
    const card = document.createElement('article');
    card.className = 'library-card';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="library-visual" style="background:${exercise.accent};">${exercise.icon}</div>
      <div>
        <h3>${exercise.name}</h3>
        <p>${exercise.focus}</p>
      </div>
      <footer>
        <span class="chip">${exercise.focus}</span>
        <button class="btn" data-action="add-exercise" data-slug="${exercise.slug}" type="button">Añadir</button>
      </footer>
    `;
    fragment.appendChild(card);
  });

  elements.library.innerHTML = '';
  elements.library.appendChild(fragment);
}

function renderThumbnails() {
  if (!elements.thumbnails) return;

  const hasExercises = state.exercises.length > 0;
  elements.emptyStrip?.classList.toggle('hidden', hasExercises);
  if (elements.viewRoutine) {
    elements.viewRoutine.disabled = !hasExercises;
  }
  if (elements.thumbnailCount) {
    elements.thumbnailCount.textContent = hasExercises
    ? `${state.exercises.length} ejercicio${state.exercises.length === 1 ? '' : 's'} listos`
    : 'Sin ejercicios aún';
  }

  if (!hasExercises) {
    elements.thumbnails.innerHTML = '';
    return;
  }

  const fragment = document.createDocumentFragment();

  state.exercises.forEach((exercise) => {
    const card = document.createElement('article');
    card.className = 'thumbnail-card';
    card.setAttribute('role', 'listitem');
    card.dataset.instanceId = exercise.instanceId;
    card.innerHTML = `
      <div class="thumbnail-actions">
        <button type="button" data-action="edit" title="Editar ejercicio">✎</button>
        <button type="button" data-action="delete" title="Eliminar ejercicio">✕</button>
      </div>
      <div class="thumbnail-visual" style="background:${exercise.accent};">${exercise.icon || '🏋️'}</div>
      <div class="thumbnail-info">
        <h3>${exercise.name}</h3>
        <p>${exercise.sets}×${exercise.reps} • ${exercise.weight > 0 ? `${exercise.weight} kg` : 'Peso libre'} • ${exercise.rest > 0 ? `${exercise.rest}s` : 'Sin descanso'}</p>
      </div>
    `;
    fragment.appendChild(card);
  });

  elements.thumbnails.innerHTML = '';
  elements.thumbnails.appendChild(fragment);
}

function openEditor(instanceId) {
  const exercise = state.exercises.find((item) => item.instanceId === instanceId);
  if (!exercise) return;

  editingExerciseId = instanceId;
  elements.editorTitle.textContent = exercise.name;
  elements.editorSubtitle.textContent = `${exercise.focus} · Configura cómo lo ejecutarás`;
  elements.editorInputs.sets.value = exercise.sets;
  elements.editorInputs.reps.value = exercise.reps;
  elements.editorInputs.weight.value = exercise.weight;
  elements.editorInputs.rest.value = exercise.rest;
  showOverlay(elements.editorOverlay);
  elements.editorInputs.sets.focus();
}

function closeEditor() {
  editingExerciseId = null;
  hideOverlay(elements.editorOverlay);
  elements.editorForm.reset();
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function handleEditorSubmit(event) {
  event.preventDefault();
  if (!editingExerciseId) return;

  const updates = {
    sets: Math.max(1, Math.round(normalizeNumber(elements.editorInputs.sets.value, 3))),
    reps: Math.max(1, Math.round(normalizeNumber(elements.editorInputs.reps.value, 12))),
    weight: Math.max(0, normalizeNumber(elements.editorInputs.weight.value, 0)),
    rest: Math.max(0, Math.round(normalizeNumber(elements.editorInputs.rest.value, 60))),
  };

  state = updateExercise(state, editingExerciseId, updates);
  renderThumbnails();
  closeEditor();
}

function handleAddExercise(slug) {
  const base = exerciseLibrary.find((exercise) => exercise.slug === slug);
  if (!base) return;

  const instanceId = `ex-${Date.now()}-${exerciseCounter++}`;
  const newExercise = createExerciseInstance(base, instanceId);
  state = addExercise(state, newExercise);
  renderThumbnails();
  openEditor(instanceId);
}

function handleDeleteExercise(instanceId) {
  state = removeExercise(state, instanceId);
  renderThumbnails();
}

function renderTimeline() {
  const timeline = buildTimeline(state.exercises);
  elements.timelineList.innerHTML = '';

  if (!timeline.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Añade ejercicios para ver la línea de tiempo.';
    empty.style.color = 'var(--text-muted)';
    elements.timelineList.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  timeline.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'timeline-item';
    row.dataset.step = item.order;
    row.innerHTML = `
      <strong>${item.name}</strong>
      <span>${item.focus}</span>
      <span>${item.summary}</span>
    `;
    fragment.appendChild(row);
  });

  elements.timelineList.appendChild(fragment);
}

function openTimeline() {
  renderTimeline();
  showOverlay(elements.timelineOverlay);
}

function closeTimeline() {
  hideOverlay(elements.timelineOverlay);
}

function openConfirmation() {
  hideOverlay(elements.timelineOverlay);
  showOverlay(elements.confirmationOverlay);
}

function closeConfirmation() {
  hideOverlay(elements.confirmationOverlay);
}

function handleLinkOrStart(action) {
  const message = action === 'link'
    ? 'Puedes vincular esta rutina desde tu panel principal.'
    : '¡Listo para comenzar! Lleva tu rutina contigo.';
  alert(message); // Feedback simple antes de cerrar el diálogo.
  closeConfirmation();
}

function attachEventListeners() {
  elements.library?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="add-exercise"]');
    if (!button) return;
    handleAddExercise(button.dataset.slug);
  });

  elements.thumbnails?.addEventListener('click', (event) => {
    const target = event.target;
    const card = target.closest('.thumbnail-card');
    if (!card) return;
    const instanceId = card.dataset.instanceId;

    const actionButton = target.closest('button[data-action]');
    if (actionButton) {
      const action = actionButton.dataset.action;
      if (action === 'edit') {
        openEditor(instanceId);
      } else if (action === 'delete') {
        handleDeleteExercise(instanceId);
      }
      return;
    }

    openEditor(instanceId);
  });

  elements.editorForm?.addEventListener('submit', handleEditorSubmit);
  elements.closeEditor?.addEventListener('click', closeEditor);
  elements.cancelEditor?.addEventListener('click', closeEditor);

  elements.viewRoutine?.addEventListener('click', () => {
    if (!state.exercises.length) return;
    openTimeline();
  });

  elements.closeTimeline?.addEventListener('click', closeTimeline);
  elements.saveRoutine?.addEventListener('click', () => {
    if (!state.exercises.length) return;
    openConfirmation();
  });

  elements.closeConfirmation?.addEventListener('click', closeConfirmation);
  elements.linkRoutine?.addEventListener('click', () => handleLinkOrStart('link'));
  elements.startRoutine?.addEventListener('click', () => handleLinkOrStart('start'));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (elements.confirmationOverlay.classList.contains('is-visible')) {
        closeConfirmation();
      } else if (elements.timelineOverlay.classList.contains('is-visible')) {
        closeTimeline();
      } else if (elements.editorOverlay.classList.contains('is-visible')) {
        closeEditor();
      }
    }
  });
}

function init() {
  renderLibrary();
  renderThumbnails();
  attachEventListeners();
  setTimeout(() => hideLaunchScreen(), 450);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

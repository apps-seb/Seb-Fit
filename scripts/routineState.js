export function createRoutineState() {
  return { exercises: [] };
}

export function createExerciseInstance(baseExercise, instanceId, overrides = {}) {
  if (!baseExercise || !instanceId) {
    throw new Error('Base exercise data and instance id are required');
  }

  const {
    slug,
    name,
    focus,
    icon,
    accent = '#22d3ee',
  } = baseExercise;

  return {
    instanceId,
    slug,
    name,
    focus,
    icon,
    accent,
    sets: 3,
    reps: 12,
    weight: 0,
    rest: 60,
    ...overrides,
  };
}

export function addExercise(state, exercise) {
  if (!state || !Array.isArray(state.exercises)) {
    throw new Error('State must contain an exercises array');
  }
  if (!exercise || !exercise.instanceId) {
    throw new Error('Exercise must include an instanceId');
  }

  const exists = state.exercises.some((item) => item.instanceId === exercise.instanceId);
  if (exists) {
    throw new Error(`Exercise with id ${exercise.instanceId} already exists`);
  }

  return {
    ...state,
    exercises: [...state.exercises, exercise],
  };
}

export function updateExercise(state, instanceId, updates) {
  if (!state || !Array.isArray(state.exercises)) {
    throw new Error('State must contain an exercises array');
  }
  if (!instanceId) {
    throw new Error('instanceId is required');
  }
  if (typeof updates !== 'object' || updates === null) {
    throw new Error('updates must be an object');
  }

  return {
    ...state,
    exercises: state.exercises.map((exercise) =>
      exercise.instanceId === instanceId ? { ...exercise, ...updates } : exercise
    ),
  };
}

export function removeExercise(state, instanceId) {
  if (!state || !Array.isArray(state.exercises)) {
    throw new Error('State must contain an exercises array');
  }
  if (!instanceId) {
    throw new Error('instanceId is required');
  }

  return {
    ...state,
    exercises: state.exercises.filter((exercise) => exercise.instanceId !== instanceId),
  };
}

export function buildTimeline(exercises) {
  if (!Array.isArray(exercises)) {
    throw new Error('exercises must be an array');
  }

  return exercises.map((exercise, index) => {
    const sets = Number.isFinite(exercise.sets) && exercise.sets > 0 ? exercise.sets : 1;
    const reps = Number.isFinite(exercise.reps) && exercise.reps > 0 ? exercise.reps : 1;
    const weight = Number.isFinite(exercise.weight) && exercise.weight > 0 ? exercise.weight : 0;
    const rest = Number.isFinite(exercise.rest) && exercise.rest >= 0 ? exercise.rest : 0;

    const weightLabel = weight > 0 ? `${weight.toFixed(weight % 1 === 0 ? 0 : 1)} kg` : 'Peso libre';
    const restLabel = rest > 0 ? `${rest}s descanso` : 'Sin descanso';

    return {
      order: index + 1,
      name: exercise.name,
      focus: exercise.focus,
      summary: `${sets}×${reps} • ${weightLabel} • ${restLabel}`,
    };
  });
}

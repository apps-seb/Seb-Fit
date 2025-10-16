import assert from 'node:assert/strict';
import {
  createRoutineState,
  createExerciseInstance,
  addExercise,
  updateExercise,
  removeExercise,
  buildTimeline,
} from '../scripts/routineState.js';

const baseExercise = {
  slug: 'sentadilla-barra',
  name: 'Sentadilla con barra',
  focus: 'Piernas y glúteos',
  icon: '🏋️',
  accent: 'linear-gradient(135deg, rgba(59,130,246,0.45), rgba(14,116,144,0.85))',
};

(function testCreateExerciseInstance() {
  const instance = createExerciseInstance(baseExercise, 'ex-1');
  assert.equal(instance.instanceId, 'ex-1');
  assert.equal(instance.name, baseExercise.name);
  assert.equal(instance.sets, 3);
  assert.equal(instance.rest, 60);
})();

(function testAddExercise() {
  const initial = createRoutineState();
  const exercise = createExerciseInstance(baseExercise, 'ex-1');
  const updated = addExercise(initial, exercise);
  assert.equal(initial.exercises.length, 0, 'initial state should remain immutable');
  assert.equal(updated.exercises.length, 1);
  assert.equal(updated.exercises[0].name, baseExercise.name);
})();

(function testUpdateExercise() {
  const exercise = createExerciseInstance(baseExercise, 'ex-1');
  const initial = addExercise(createRoutineState(), exercise);
  const updated = updateExercise(initial, 'ex-1', { sets: 4, rest: 75 });
  assert.equal(updated.exercises[0].sets, 4);
  assert.equal(updated.exercises[0].rest, 75);
  assert.equal(initial.exercises[0].sets, 3, 'update should not mutate previous state');
})();

(function testRemoveExercise() {
  const exerciseA = createExerciseInstance(baseExercise, 'ex-1');
  const exerciseB = createExerciseInstance({ ...baseExercise, slug: 'press', name: 'Press' }, 'ex-2');
  const withExercises = addExercise(addExercise(createRoutineState(), exerciseA), exerciseB);
  const result = removeExercise(withExercises, 'ex-1');
  assert.equal(result.exercises.length, 1);
  assert.equal(result.exercises[0].instanceId, 'ex-2');
})();

(function testBuildTimeline() {
  const exercise = createExerciseInstance(baseExercise, 'ex-1', { sets: 4, reps: 10, weight: 40, rest: 90 });
  const timeline = buildTimeline([exercise]);
  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].order, 1);
  assert.ok(timeline[0].summary.includes('4×10'));
  assert.ok(timeline[0].summary.includes('40 kg'));
  assert.ok(timeline[0].summary.includes('90s'));
})();

console.log('All routine builder tests passed ✅');

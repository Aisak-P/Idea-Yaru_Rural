import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore } from '../src/score.js';

const base = {
  careHours: 2,
  travelMinutes: 10,
  transport: 'available',
  support: 'reliable',
  rest: 'good',
  selfCare: 'enough',
  scheduleConflict: 'low',
  activities: ['alimentacion'],
};

test('classifies a manageable load as green', () => {
  const result = calculateScore(base);
  assert.equal(result.score, 0);
  assert.equal(result.level, 'green');
  assert.equal(result.critical, false);
});

test('classifies a moderate load between four and six points as yellow', () => {
  const result = calculateScore({
    ...base,
    careHours: 5,
    travelMinutes: 35,
    transport: 'occasional',
  });
  assert.equal(result.score, 4);
  assert.equal(result.level, 'yellow');
});

test('classifies seven points as red', () => {
  const result = calculateScore({
    ...base,
    careHours: 8,
    travelMinutes: 60,
    transport: 'irregular',
    support: 'none',
    rest: 'insufficient',
    scheduleConflict: 'high',
  });
  assert.equal(result.score, 10);
  assert.equal(result.level, 'red');
});

test('uses more than six care hours as a critical red condition', () => {
  const result = calculateScore({ ...base, careHours: 7 });
  assert.equal(result.level, 'red');
  assert.equal(result.critical, true);
});

test('uses long travel with irregular transport as a critical red condition', () => {
  const result = calculateScore({
    ...base,
    travelMinutes: 50,
    transport: 'irregular',
  });
  assert.equal(result.level, 'red');
  assert.equal(result.critical, true);
});

test('uses no support with insufficient rest as a critical red condition', () => {
  const result = calculateScore({
    ...base,
    support: 'none',
    rest: 'insufficient',
  });
  assert.equal(result.level, 'red');
  assert.equal(result.critical, true);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatAwardDateChip } from '../src/utils/award-date.mjs';

test('formatAwardDateChip abbreviates English month and year', () => {
  assert.equal(formatAwardDateChip('October', 2025), 'Oct. 2025');
  assert.equal(formatAwardDateChip('January', 2024), 'Jan. 2024');
  assert.equal(formatAwardDateChip('May', 2024), 'May 2024');
});

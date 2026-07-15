import { describe, expect, it } from 'vitest';
import {
  buildTaskCompletionFields,
  isCalendarTaskCompleted,
  updateCompletedOccurrences,
} from '../../src/calendarTasks.js';

describe('tareas del calendario', () => {
  it('marca y desmarca una tarea simple', () => {
    expect(isCalendarTaskCompleted({ isTask: true, completed: true })).toBe(true);
    expect(isCalendarTaskCompleted({ isTask: true, completed: false })).toBe(false);
    expect(isCalendarTaskCompleted({ isTask: false, completed: true })).toBe(false);
  });

  it('mantiene el estado por fecha para tareas repetidas', () => {
    const event = {
      isTask: true,
      repeat: { every: 'day' },
      completedOccurrences: ['2026-07-11'],
    };

    expect(isCalendarTaskCompleted(event, '2026-07-11')).toBe(true);
    expect(isCalendarTaskCompleted(event, '2026-07-12')).toBe(false);
    expect(updateCompletedOccurrences(event.completedOccurrences, '2026-07-12', true))
      .toEqual(['2026-07-11', '2026-07-12']);
  });

  it('limpia los estados cuando el evento deja de ser tarea', () => {
    expect(buildTaskCompletionFields({
      existingEvent: { completed: true, completedOccurrences: ['2026-07-11'] },
      isTask: false,
    })).toEqual({
      isTask: false,
      completed: false,
      completedOccurrences: [],
    });
  });
});

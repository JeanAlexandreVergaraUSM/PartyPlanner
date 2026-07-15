function uniqueSortedDates(values){
  return [...new Set((Array.isArray(values) ? values : [])
    .map(value => String(value || '').trim())
    .filter(Boolean))]
    .sort();
}

export function isCalendarTaskCompleted(event, occurrenceDate = event?.date){
  if (!event?.isTask) return false;

  if (event.repeat?.every) {
    const date = String(occurrenceDate || '').trim();
    return !!date && uniqueSortedDates(event.completedOccurrences).includes(date);
  }

  return event.completed === true;
}

export function updateCompletedOccurrences(values, occurrenceDate, completed){
  const dates = new Set(uniqueSortedDates(values));
  const date = String(occurrenceDate || '').trim();

  if (!date) return [...dates].sort();
  if (completed) dates.add(date);
  else dates.delete(date);

  return [...dates].sort();
}

export function buildTaskCompletionFields({
  existingEvent = null,
  occurrenceDate = '',
  isTask = false,
  completed = false,
  repeatEvery = '',
} = {}){
  if (!isTask) {
    return {
      isTask: false,
      completed: false,
      completedOccurrences: [],
    };
  }

  if (repeatEvery) {
    return {
      isTask: true,
      completed: false,
      completedOccurrences: updateCompletedOccurrences(
        existingEvent?.completedOccurrences,
        occurrenceDate,
        completed,
      ),
    };
  }

  return {
    isTask: true,
    completed: completed === true,
    completedOccurrences: [],
  };
}

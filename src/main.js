// js/main.js
import './styles.css';
import './firebase.js';
import { initAuth } from './auth.js';
import { initRouter } from './router.js';
import { initPair } from './pair.js';
import { initSemesters } from './semesters.js';

window.addEventListener('DOMContentLoaded', async () => {
  // 🚀 Inicializa todo en paralelo para que nada bloquee
  await Promise.all([
    initAuth(),
    initRouter(),
    initPair(),
    
    initSemesters()
  ]);

  // ✅ Si el usuario recargó estando en una pestaña específica, precárgala de inmediato
  const current = location.hash;

  if (current.startsWith('#/malla')) {
    import('./malla.js').then(m => m.initMallaOnRoute?.());
  } 
  else if (current.startsWith('#/notas')) {
    import('./grades.js').then(m => m.initGrades?.());
  } 
  else if (current.startsWith('#/asistencia')) {
    import('./attendance.js').then(m => m.initAttendance?.());
  } 
  else if (current.startsWith('#/horario')) {
    import('./schedule.js').then(m => m.initSchedule?.());
  } 
  else if (current.startsWith('#/calendario')) {
    import('./calendar.js').then(m => m.initCalendar?.());
  } 
  else if (current.startsWith('#/progreso')) {
    import('./progreso.js').then(m => m.initProgreso?.());
  }

  // 🔹 Lazy load: cuando se navega a una nueva ruta
  document.addEventListener('route:change', async (e) => {
    const route = e.detail.route;

    if (route.startsWith('#/notas')) {
      const m = await import('./grades.js');
      m.initGrades?.();
    } 
    else if (route.startsWith('#/malla')) {
      const m = await import('./malla.js');
      m.initMallaOnRoute?.();
    } 
    else if (route.startsWith('#/asistencia')) {
      const m = await import('./attendance.js');
      m.initAttendance?.();
    } 
    else if (route.startsWith('#/horario')) {
      const m = await import('./schedule.js');
      m.initSchedule?.();
    } 
    else if (route.startsWith('#/calendario')) {
      const m = await import('./calendar.js');
      m.initCalendar?.();
    } 
    else if (route.startsWith('#/progreso')) {
      const m = await import('./progreso.js');
      m.initProgreso?.();
    }
  });
});


// ✅ Mantén estas funciones al final para sincronizar los módulos
import { onActiveSemesterChanged as gradesOnSem, onCoursesChanged as gradesOnCourses } from './grades.js';
import { onActiveSemesterChanged as calOnSem, onCoursesChanged as calOnCourses } from './calendar.js';
import { onActiveSemesterChanged as schedOnSem } from './schedule.js';
import { refreshProgreso } from './progreso.js';

export function notifyActiveSemesterChangedAll() {
  schedOnSem?.();
  gradesOnSem?.();
  calOnSem?.();
  refreshProgreso?.();
}

export function notifyCoursesChangedAll() {
  gradesOnCourses?.();
  calOnCourses?.();
  refreshProgreso?.();
}


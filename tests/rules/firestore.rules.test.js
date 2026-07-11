// @vitest-environment node
import fs from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-partyplanner';
let testEnv;

function emulatorConfig() {
  const hostPort = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085';
  const [host, portRaw] = hostPort.split(':');
  return { host, port: Number(portRaw) };
}

async function seedSameParty({ blocked = {} } = {}) {
  await testEnv.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'users/owner'), {
      currentPartyId: 'party-1',
      name: 'Owner',
    });
    await setDoc(doc(db, 'users/viewer'), {
      currentPartyId: 'party-1',
      name: 'Viewer',
    });
    await setDoc(doc(db, 'pairs/party-1'), {
      members: ['owner', 'viewer'],
      createdAt: 1,
    });
    await setDoc(doc(db, 'users/owner/privacy/partyAccess/viewers/viewer'), {
      notas: !!blocked.notas,
      horario: !!blocked.horario,
      calendario: !!blocked.calendario,
      malla: !!blocked.malla,
    });
    await setDoc(doc(db, 'users/owner/profile/profile'), {
      name: 'Owner Profile',
    });
    await setDoc(doc(db, 'users/owner/semesters/2026-1'), {
      label: '2026-1',
    });
    await setDoc(doc(db, 'users/owner/semesters/2026-1/courses/course-1'), {
      name: 'Programación',
      color: '#ffaa00',
    });
    await setDoc(doc(db, 'users/owner/semesters/2026-1/courses/course-1/grading/meta'), {
      finalExpression: 'C1',
    });
    await setDoc(doc(db, 'users/owner/semesters/2026-1/schedule/main'), {
      items: [],
    });
    await setDoc(doc(db, 'users/owner/semesters/2026-1/calendar/event-1'), {
      title: 'Prueba',
    });
    await setDoc(doc(db, 'users/owner/malla/current'), {
      selected: [],
    });
  });
}

beforeAll(async () => {
  const { host, port } = emulatorConfig();
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host,
      port,
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv?.cleanup();
});

describe('Firestore Rules - aislamiento de usuario', () => {
  it('rechaza lecturas sin autenticación', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'users/owner')));
    await assertFails(getDoc(doc(db, 'pairs/party-1')));
  });

  it('permite al usuario administrar sus propios datos académicos', async () => {
    const db = testEnv.authenticatedContext('owner').firestore();
    await assertSucceeds(setDoc(doc(db, 'users/owner'), { currentPartyId: null }));
    await assertSucceeds(setDoc(
      doc(db, 'users/owner/semesters/2026-1/calendar/event-1'),
      { title: 'Control 1' },
    ));
  });

  it('impide que otro usuario escriba los datos del propietario', async () => {
    await seedSameParty();
    const db = testEnv.authenticatedContext('viewer').firestore();
    await assertFails(setDoc(doc(db, 'users/owner/profile/profile'), { name: 'Hack' }));
    await assertFails(setDoc(
      doc(db, 'users/owner/semesters/2026-1/calendar/hacked'),
      { title: 'Hack' },
    ));
  });
});

describe('Firestore Rules - Party y privacidad por zona', () => {
  it('permite leer perfil entre miembros reales de la misma Party', async () => {
    await seedSameParty();
    const db = testEnv.authenticatedContext('viewer').firestore();
    await assertSucceeds(getDoc(doc(db, 'users/owner/profile/profile')));
  });

  it('deniega datos de otro usuario cuando no comparten Party', async () => {
    await testEnv.withSecurityRulesDisabled(async context => {
      const db = context.firestore();
      await setDoc(doc(db, 'users/owner'), { currentPartyId: null });
      await setDoc(doc(db, 'users/stranger'), { currentPartyId: null });
      await setDoc(doc(db, 'users/owner/profile/profile'), { name: 'Owner' });
    });
    const db = testEnv.authenticatedContext('stranger').firestore();
    await assertFails(getDoc(doc(db, 'users/owner/profile/profile')));
  });

  it('bloquea solo la zona Notas y mantiene Horario permitido', async () => {
    await seedSameParty({ blocked: { notas: true, horario: false } });
    const db = testEnv.authenticatedContext('viewer').firestore();

    await assertFails(getDoc(
      doc(db, 'users/owner/semesters/2026-1/courses/course-1/grading/meta'),
    ));
    await assertSucceeds(getDoc(
      doc(db, 'users/owner/semesters/2026-1/schedule/main'),
    ));
  });

  it('respeta los bloqueos independientes de Calendario y Malla', async () => {
    await seedSameParty({ blocked: { calendario: true, malla: true } });
    const db = testEnv.authenticatedContext('viewer').firestore();

    await assertFails(getDoc(
      doc(db, 'users/owner/semesters/2026-1/calendar/event-1'),
    ));
    await assertFails(getDoc(doc(db, 'users/owner/malla/current')));
  });
});

describe('Firestore Rules - ciclo de vida de Party', () => {
  it('solo permite crear una Party con el creador como único miembro inicial', async () => {
    const ownerDb = testEnv.authenticatedContext('owner').firestore();
    await assertSucceeds(setDoc(doc(ownerDb, 'pairs/valid'), {
      members: ['owner'],
      createdAt: 1,
    }));

    await assertFails(setDoc(doc(ownerDb, 'pairs/invalid'), {
      members: ['owner', 'viewer'],
      createdAt: 1,
    }));
  });

  it('permite auto-unirse y auto-salirse, pero no expulsar a otro siendo no-host', async () => {
    await testEnv.withSecurityRulesDisabled(async context => {
      const db = context.firestore();
      await setDoc(doc(db, 'pairs/party-1'), { members: ['owner'], createdAt: 1 });
    });

    const viewerDb = testEnv.authenticatedContext('viewer').firestore();
    await assertSucceeds(updateDoc(doc(viewerDb, 'pairs/party-1'), {
      members: ['owner', 'viewer'],
    }));
    await assertSucceeds(updateDoc(doc(viewerDb, 'pairs/party-1'), {
      members: ['owner'],
    }));

    await testEnv.withSecurityRulesDisabled(async context => {
      await setDoc(doc(context.firestore(), 'pairs/party-2'), {
        members: ['owner', 'viewer'],
        createdAt: 1,
      });
    });
    await assertFails(updateDoc(doc(viewerDb, 'pairs/party-2'), {
      members: ['viewer'],
    }));
  });

  it('permite al host expulsar y transferir la posición de host', async () => {
    await testEnv.withSecurityRulesDisabled(async context => {
      await setDoc(doc(context.firestore(), 'pairs/party-1'), {
        members: ['owner', 'viewer'],
        createdAt: 1,
      });
    });

    const ownerDb = testEnv.authenticatedContext('owner').firestore();
    await assertSucceeds(updateDoc(doc(ownerDb, 'pairs/party-1'), {
      members: ['viewer', 'owner'],
    }));

    await testEnv.withSecurityRulesDisabled(async context => {
      await updateDoc(doc(context.firestore(), 'pairs/party-1'), {
        members: ['owner', 'viewer'],
      });
    });
    await assertSucceeds(updateDoc(doc(ownerDb, 'pairs/party-1'), {
      members: ['owner'],
    }));
  });

  it('permite listar solo mediante consulta compatible con membership', async () => {
    await testEnv.withSecurityRulesDisabled(async context => {
      const db = context.firestore();
      await setDoc(doc(db, 'pairs/p1'), { members: ['viewer'], createdAt: 1 });
      await setDoc(doc(db, 'pairs/p2'), { members: ['owner'], createdAt: 1 });
    });

    const viewerDb = testEnv.authenticatedContext('viewer').firestore();

    const membershipQuery = query(
      collection(viewerDb, 'pairs'),
      where('members', 'array-contains', 'viewer'),
    );
    await assertSucceeds(getDocs(membershipQuery));

    // Una consulta sin el filtro de membresía podría devolver parties ajenas.
    await assertFails(getDocs(collection(viewerDb, 'pairs')));
  });
});

describe('Firestore Rules - rutas backend-only', () => {
  it('impide que el cliente escriba usage y mallaImports', async () => {
    const db = testEnv.authenticatedContext('owner').firestore();
    await assertFails(setDoc(doc(db, 'users/owner/usage/day-1'), { used: 999 }));
    await assertFails(setDoc(doc(db, 'users/owner/mallaImports/import-1'), { status: 'approved' }));
  });
});

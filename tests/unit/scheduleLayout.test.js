import { describe, expect, it } from 'vitest';
import {
  packScheduleLanes,
  resolveHorizontalPlacement,
} from '../../src/scheduleLayout.js';

describe('distribución de bloques del horario', () => {
  it('coloca dos bloques que chocan uno a la izquierda y otro a la derecha', () => {
    const packed = packScheduleLanes([
      { id: 'a', pos: 'full', hpos: 'single' },
      { id: 'b', pos: 'full', hpos: 'single' },
    ]);

    expect(packed.laneCount).toBe(2);
    expect(resolveHorizontalPlacement(packed.blocks[0], packed.laneCount))
      .toMatchObject({ left: 0, width: 50, effectiveHpos: 'left', automatic: true });
    expect(resolveHorizontalPlacement(packed.blocks[1], packed.laneCount))
      .toMatchObject({ left: 50, width: 50, effectiveHpos: 'right', automatic: true });
  });

  it('reutiliza las dos columnas para formar cuatro espacios arriba/abajo', () => {
    const packed = packScheduleLanes([
      { id: 'top-a', pos: 'top', hpos: 'single' },
      { id: 'top-b', pos: 'top', hpos: 'single' },
      { id: 'bottom-a', pos: 'bottom', hpos: 'single' },
      { id: 'bottom-b', pos: 'bottom', hpos: 'single' },
    ]);

    expect(packed.laneCount).toBe(2);
    const placements = packed.blocks.map(block => ({
      id: block.id,
      lane: block._lane,
      ...resolveHorizontalPlacement(block, packed.laneCount),
    }));

    expect(placements.find(item => item.id === 'top-a').lane).toBe(0);
    expect(placements.find(item => item.id === 'top-b').lane).toBe(1);
    expect(placements.find(item => item.id === 'bottom-a').lane).toBe(0);
    expect(placements.find(item => item.id === 'bottom-b').lane).toBe(1);
  });

  it('respeta una posición horizontal elegida manualmente', () => {
    expect(resolveHorizontalPlacement({ hpos: 'right', _lane: 0 }, 3))
      .toMatchObject({ left: 50, width: 50, effectiveHpos: 'right', automatic: false });
  });
});

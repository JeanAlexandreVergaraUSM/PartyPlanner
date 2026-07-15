export function verticalRangeFromPosition(position){
  const pos = position || 'full';
  if (pos === 'top') return { start: 0, end: 0.5 };
  if (pos === 'bottom') return { start: 0.5, end: 1 };
  return { start: 0, end: 1 };
}

export function verticalRangesOverlap(a, b){
  return a.start < b.end && b.start < a.end;
}

export function packScheduleLanes(blocks = []){
  const positionOrder = { top: 0, full: 1, bottom: 2 };
  const packed = blocks.map((block, index) => ({
    ...block,
    _sourceIndex: index,
    _verticalRange: verticalRangeFromPosition(block.pos),
  }));

  packed.sort((left, right) => {
    const leftPos = positionOrder[left.pos || 'full'] ?? 1;
    const rightPos = positionOrder[right.pos || 'full'] ?? 1;
    if (leftPos !== rightPos) return leftPos - rightPos;
    return left._sourceIndex - right._sourceIndex;
  });

  const lanes = [];

  for (const block of packed) {
    let laneIndex = lanes.findIndex(lane =>
      lane.every(existing =>
        !verticalRangesOverlap(block._verticalRange, existing._verticalRange),
      ),
    );

    if (laneIndex < 0) {
      laneIndex = lanes.length;
      lanes.push([]);
    }

    block._lane = laneIndex;
    lanes[laneIndex].push(block);
  }

  return {
    blocks: packed,
    laneCount: Math.max(1, lanes.length),
  };
}

export function resolveHorizontalPlacement(block, laneCount = 1){
  const requested = block?.hpos || 'single';

  if (requested === 'left') {
    return { left: 0, width: 50, effectiveHpos: 'left', automatic: false };
  }

  if (requested === 'right') {
    return { left: 50, width: 50, effectiveHpos: 'right', automatic: false };
  }

  const safeLaneCount = Math.max(1, Number(laneCount) || 1);
  if (safeLaneCount === 1) {
    return { left: 0, width: 100, effectiveHpos: 'single', automatic: false };
  }

  const lane = Math.min(
    Math.max(0, Number(block?._lane) || 0),
    safeLaneCount - 1,
  );
  const width = 100 / safeLaneCount;
  const effectiveHpos = safeLaneCount === 2
    ? (lane === 0 ? 'left' : 'right')
    : `lane-${lane + 1}`;

  return {
    left: lane * width,
    width,
    effectiveHpos,
    automatic: true,
  };
}

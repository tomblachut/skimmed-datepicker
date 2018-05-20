export function range(from: number, to: number): Array<number> {
  return Array.from(new Array(1 + to - from), (x, i) => i + from);
}

// kudos to @michel4ngel0
export function createEaseOut(panRatio: number): (x: number) => number {
  const a = (panRatio - 2) / panRatio ** 3;
  const b = (3 - 2 * panRatio) / panRatio ** 2;

  return function easeOut(x: number) {
    return (x >= panRatio) ? 1 : ((a * x + b) * x + 1) * x;
  };
}

export function noop() {
}

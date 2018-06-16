export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

export function startOfDay(date: Date | number): Date {
  const d = new Date(date as number);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfMonth(date: Date | number): Date {
  const d = new Date(date as number);
  d.setHours(0, 0, 0, 0);
  d.setDate(1);
  return d;
}

export function startOfYear(date: Date | number): Date {
  const d = new Date(date as number);
  d.setHours(0, 0, 0, 0);
  d.setMonth(0, 1);
  return d;
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

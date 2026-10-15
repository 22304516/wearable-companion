export type Reading = { label: string; value: number; unit: string };

// Synthetic readings for interface development only. This is not a BLE connection.
export function makeSyntheticReadings(now = Date.now()): Reading[] {
  const wobble = (n: number, spread: number) => Math.round(n + (Math.sin(now / 12000) * spread));
  return [
    { label: 'Heart rate', value: wobble(72, 6), unit: 'bpm' },
    { label: 'Steps today', value: wobble(3840, 180), unit: 'steps' },
    { label: 'Skin temperature', value: 36.4, unit: '°C' },
  ];
}

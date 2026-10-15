export type Reading = { label: string; value: number; unit: string };

// Synthetic readings for interface development only. This is not a BLE connection.
export function makeSyntheticReadings(now = Date.now()): Reading[] {
  const localDate = new Date(now);
  const startOfLocalDay = new Date(localDate);
  startOfLocalDay.setHours(0, 0, 0, 0);
  const elapsedSeconds = Math.max(0, (now - startOfLocalDay.getTime()) / 1000);

  const heartRate = Math.round(72 + 5 * Math.sin(now / 12000) + 2 * Math.sin(now / 33000));
  const steps = Math.min(10000, 300 + Math.floor(elapsedSeconds * 0.12));
  const temperature = Math.round((36.5 + 0.1 * Math.sin(now / 90000)) * 10) / 10;

  return [
    { label: 'Heart rate', value: heartRate, unit: 'bpm' },
    { label: 'Steps today', value: steps, unit: 'steps' },
    { label: 'Skin temperature', value: temperature, unit: '°C' },
  ];
}

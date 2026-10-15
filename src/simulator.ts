export type Reading = { label: string; value: number; unit: string };

export const SIMULATED_DEVICES = [
  { id: 'demo-band', name: 'Demo fitness band', type: 'Fitness band' },
  { id: 'demo-watch', name: 'Demo smartwatch', type: 'Smartwatch' },
] as const;

export type SimulatedDevice = typeof SIMULATED_DEVICES[number];

// Synthetic readings for interface development only. This is not a BLE connection.
export function makeSyntheticReadings(now = Date.now(), deviceId: string = SIMULATED_DEVICES[0].id): Reading[] {
  const localDate = new Date(now);
  const startOfLocalDay = new Date(localDate);
  startOfLocalDay.setHours(0, 0, 0, 0);
  const elapsedSeconds = Math.max(0, (now - startOfLocalDay.getTime()) / 1000);

  const secondProfile = deviceId === SIMULATED_DEVICES[1].id;
  const phase = secondProfile ? 5000 : 0;

  const heartRate = Math.round((secondProfile ? 80 : 72) + 5 * Math.sin((now + phase) / 12000) + 2 * Math.sin((now + phase) / 33000));
  const steps = Math.min(10000, (secondProfile ? 500 : 300) + Math.floor(elapsedSeconds * 0.12));
  const temperature = Math.round((36.5 + (secondProfile ? 0.4 : 0) + 0.1 * Math.sin((now + phase) / 90000)) * 10) / 10;

  return [
    { label: 'Heart rate', value: heartRate, unit: 'bpm' },
    { label: 'Steps today', value: steps, unit: 'steps' },
    { label: 'Skin temperature', value: temperature, unit: '°C' },
  ];
}

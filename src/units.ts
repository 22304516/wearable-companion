import type { Reading } from './simulator';

export type TemperatureUnit = 'C' | 'F';

export function toDisplayReading(reading: Reading, temperatureUnit: TemperatureUnit): Reading {
  if (reading.label !== 'Skin temperature' || temperatureUnit === 'C') return reading;

  return {
    ...reading,
    value: Math.round((reading.value * 9 / 5 + 32) * 10) / 10,
    unit: '°F',
  };
}

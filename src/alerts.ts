import { Reading } from './simulator';

export type AlertSettings = {
  heartRateEnabled: boolean;
  heartRateAbove: number;
};

export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  heartRateEnabled: false,
  heartRateAbove: 120,
};

export function sanitizeAlertSettings(value: unknown): AlertSettings | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.heartRateEnabled !== 'boolean' || typeof candidate.heartRateAbove !== 'number') {
    return null;
  }
  if (!Number.isFinite(candidate.heartRateAbove)) return null;
  return {
    heartRateEnabled: candidate.heartRateEnabled,
    heartRateAbove: Math.min(220, Math.max(50, Math.round(candidate.heartRateAbove))),
  };
}

export function getTriggeredDemoAlerts(readings: Reading[], settings: AlertSettings): string[] {
  if (!settings.heartRateEnabled) return [];
  const heartRate = readings.find(reading => reading.label === 'Heart rate');
  if (!heartRate || heartRate.value < settings.heartRateAbove) return [];
  return [`Synthetic heart rate is ${heartRate.value} bpm, at or above your demo threshold of ${settings.heartRateAbove} bpm.`];
}

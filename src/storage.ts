import type { Reading } from './simulator';

export type HistoryEntry = {
  id: string;
  recordedAt: string;
  readings: Reading[];
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
};

function isReading(value: unknown): value is Reading {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.label === 'string' && candidate.label.trim().length > 0 &&
    typeof candidate.value === 'number' && Number.isFinite(candidate.value) &&
    typeof candidate.unit === 'string' && candidate.unit.trim().length > 0
  );
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' && candidate.id.length > 0 &&
    typeof candidate.recordedAt === 'string' && Number.isFinite(Date.parse(candidate.recordedAt)) &&
    Array.isArray(candidate.readings) && candidate.readings.length > 0 && candidate.readings.every(isReading) &&
    (candidate.deviceId === undefined || (typeof candidate.deviceId === 'string' && candidate.deviceId.length > 0)) &&
    (candidate.deviceName === undefined || (typeof candidate.deviceName === 'string' && candidate.deviceName.length > 0)) &&
    (candidate.deviceType === undefined || (typeof candidate.deviceType === 'string' && candidate.deviceType.length > 0))
  );
}

export function sanitizeHistory(value: unknown, limit: number): HistoryEntry[] {
  if (!Array.isArray(value)) return [];

  const uniqueEntries = new Map<string, HistoryEntry>();
  for (const item of value) {
    if (isHistoryEntry(item) && !uniqueEntries.has(item.id)) {
      uniqueEntries.set(item.id, item);
    }
  }

  return [...uniqueEntries.values()]
    .sort((left, right) => Date.parse(right.recordedAt) - Date.parse(left.recordedAt))
    .slice(0, Math.max(0, limit));
}

export function sanitizeVisibleMetrics(value: unknown, allowedMetrics: string[]): string[] | undefined {
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) return undefined;
  return allowedMetrics.filter(metric => value.includes(metric));
}

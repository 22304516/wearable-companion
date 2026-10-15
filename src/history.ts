import { HistoryEntry } from './storage';

export type HistoryRange = '24h' | '7d' | 'all';

export type MetricSummary = {
  count: number;
  minimum: number;
  maximum: number;
  average: number;
  latest: number;
};

const RANGE_MS: Record<Exclude<HistoryRange, 'all'>, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};

export function filterHistoryByRange(
  entries: HistoryEntry[],
  range: HistoryRange,
  now = Date.now(),
): HistoryEntry[] {
  if (range === 'all') return entries;

  const cutoff = now - RANGE_MS[range];
  return entries.filter(entry => {
    const timestamp = Date.parse(entry.recordedAt);
    return Number.isFinite(timestamp) && timestamp >= cutoff && timestamp <= now;
  });
}

export function summarizeMetric(
  entries: HistoryEntry[],
  label: string,
): MetricSummary | null {
  const samples = entries
    .flatMap(entry => {
      const timestamp = Date.parse(entry.recordedAt);
      const reading = entry.readings.find(item => item.label === label);
      return reading && Number.isFinite(timestamp) && Number.isFinite(reading.value)
        ? [{ timestamp, value: reading.value }]
        : [];
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  if (samples.length === 0) return null;

  const values = samples.map(sample => sample.value);
  return {
    count: samples.length,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    latest: samples[0].value,
  };
}

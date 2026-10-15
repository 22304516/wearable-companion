import { DEFAULT_ALERT_SETTINGS, getTriggeredDemoAlerts, sanitizeAlertSettings } from '../src/alerts';
import { makeCsvFileName, toSyntheticCsv } from '../src/csv';
import { filterHistoryByRange, summarizeMetric } from '../src/history';
import { makeSyntheticReadings, SIMULATED_DEVICES } from '../src/simulator';
import { HistoryEntry, sanitizeHistory, sanitizeVisibleMetrics } from '../src/storage';
import { toDisplayReading } from '../src/units';

function entry(id: string, recordedAt: string, value: number, label = 'Heart rate'): HistoryEntry {
  return {
    id,
    recordedAt,
    deviceId: 'demo-band',
    deviceName: 'Demo fitness band',
    deviceType: 'Fitness band',
    readings: [{ label, value, unit: label === 'Heart rate' ? 'bpm' : '°C' }],
  };
}

describe('history helpers', () => {
  const now = Date.parse('2026-10-15T12:00:00.000Z');
  const items = [
    entry('now', new Date(now).toISOString(), 80),
    entry('day', new Date(now - 24 * 60 * 60 * 1000).toISOString(), 70),
    entry('older', new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), 60),
    entry('future', new Date(now + 1000).toISOString(), 90),
  ];

  test('filters rolling ranges inclusively at the cutoff and excludes future records', () => {
    expect(filterHistoryByRange(items, '24h', now).map(item => item.id)).toEqual(['now', 'day']);
    expect(filterHistoryByRange(items, '7d', now).map(item => item.id)).toEqual(['now', 'day']);
  });

  test('returns all samples without changing order for the all range', () => {
    expect(filterHistoryByRange(items, 'all', now)).toBe(items);
  });

  test('summarizes only finite readings and uses the newest timestamp as latest', () => {
    const summary = summarizeMetric([items[2], items[0], entry('other', new Date(now - 500).toISOString(), 75)], 'Heart rate');
    expect(summary).toEqual({ count: 3, minimum: 60, maximum: 80, average: 215 / 3, latest: 80 });
    expect(summarizeMetric([], 'Heart rate')).toBeNull();
    expect(summarizeMetric(items, 'Missing metric')).toBeNull();
  });
});

describe('persisted data validation', () => {
  test('drops malformed entries, deduplicates ids, sorts newest first, and applies the cap', () => {
    const valid = entry('same', '2026-10-14T10:00:00.000Z', 70);
    const newer = entry('newer', '2026-10-15T10:00:00.000Z', 80);
    const malformed = { ...entry('bad', 'not-a-date', 90) };
    expect(sanitizeHistory([valid, newer, { ...valid, readings: [] }, malformed, entry('same', '2026-10-15T11:00:00.000Z', 99)], 1))
      .toEqual([newer]);
  });

  test('filters saved dashboard preferences to the allowed metric list', () => {
    expect(sanitizeVisibleMetrics(['Steps today', 'Unknown', 'Steps today'], ['Heart rate', 'Steps today']))
      .toEqual(['Steps today']);
    expect(sanitizeVisibleMetrics('Heart rate', ['Heart rate'])).toBeUndefined();
  });
});

describe('display and CSV helpers', () => {
  test('converts only skin temperature to Fahrenheit and preserves the stored value', () => {
    const stored = { label: 'Skin temperature', value: 36.6, unit: '°C' };
    expect(toDisplayReading(stored, 'F')).toEqual({ label: 'Skin temperature', value: 97.9, unit: '°F' });
    expect(toDisplayReading(stored, 'C')).toBe(stored);
    expect(toDisplayReading({ label: 'Heart rate', value: 80, unit: 'bpm' }, 'F').value).toBe(80);
  });

  test('quotes CSV cells, escapes quotes, and neutralizes formula-like text', () => {
    const csv = toSyntheticCsv([{
      ...entry('csv', '2026-10-15T12:00:00.000Z', 80, '=SUM(A1:A2)'),
      deviceName: 'Band, "one"',
    }]);
    expect(csv.split('\r\n')[0]).toBe('"recorded_at","device_id","device_name","device_type","metric","value","unit","is_synthetic"');
    expect(csv).toContain('"Band, ""one"""');
    expect(csv).toContain('"\'=SUM(A1:A2)"');
    expect(csv).toContain('"true"');
  });

  test('generates a deterministic timestamped CSV filename', () => {
    expect(makeCsvFileName(new Date('2026-10-15T12:34:56.789Z')))
      .toBe('wearable-companion-synthetic-history-2026-10-15T12-34-56-789Z.csv');
  });
});

describe('simulator and demo alerts', () => {
  test('returns stable readings for the selected synthetic profile and timestamp', () => {
    const now = Date.parse('2026-10-15T12:00:00.000Z');
    expect(makeSyntheticReadings(now, SIMULATED_DEVICES[0].id)).toEqual(makeSyntheticReadings(now, SIMULATED_DEVICES[0].id));
    expect(makeSyntheticReadings(now, SIMULATED_DEVICES[0].id)).not.toEqual(makeSyntheticReadings(now, SIMULATED_DEVICES[1].id));
  });

  test('validates threshold settings and triggers only enabled synthetic heart-rate alerts', () => {
    const reading = [{ label: 'Heart rate', value: 83, unit: 'bpm' }];
    expect(sanitizeAlertSettings(DEFAULT_ALERT_SETTINGS)).toEqual(DEFAULT_ALERT_SETTINGS);
    expect(sanitizeAlertSettings({ heartRateEnabled: true, heartRateAbove: 999 }))
      .toEqual({ heartRateEnabled: true, heartRateAbove: 220 });
    expect(sanitizeAlertSettings({ heartRateEnabled: 'yes', heartRateAbove: 80 })).toBeNull();
    expect(getTriggeredDemoAlerts(reading, DEFAULT_ALERT_SETTINGS)).toEqual([]);
    expect(getTriggeredDemoAlerts(reading, { heartRateEnabled: true, heartRateAbove: 83 })).toHaveLength(1);
    expect(getTriggeredDemoAlerts(reading, { heartRateEnabled: true, heartRateAbove: 84 })).toEqual([]);
  });
});

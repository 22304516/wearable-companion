import type { HistoryEntry } from './storage';
import { TemperatureUnit, toDisplayReading } from './units';

function escapeCell(value: string | number): string {
  let text = String(value);
  // Prefix spreadsheet formula-like text so exported labels stay inert if opened in a spreadsheet.
  if (/^[=+@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toSyntheticCsv(entries: HistoryEntry[], temperatureUnit: TemperatureUnit = 'C'): string {
  const rows = [['recorded_at', 'device_id', 'device_name', 'device_type', 'metric', 'value', 'unit', 'is_synthetic']];
  for (const entry of entries) {
    for (const storedReading of entry.readings) {
      const reading = toDisplayReading(storedReading, temperatureUnit);
      rows.push([
        entry.recordedAt,
        entry.deviceId ?? 'legacy-demo-wearable',
        entry.deviceName ?? 'Legacy demo wearable',
        entry.deviceType ?? 'Unknown simulator profile',
        reading.label,
        String(reading.value),
        reading.unit,
        'true',
      ]);
    }
  }
  return rows.map(row => row.map(escapeCell).join(',')).join('\r\n');
}

export function makeCsvFileName(now = new Date()): string {
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  return `wearable-companion-synthetic-history-${timestamp}.csv`;
}

import type { HistoryEntry } from './storage';

function escapeCell(value: string | number): string {
  let text = String(value);
  // Prefix spreadsheet formula-like text so exported labels stay inert if opened in a spreadsheet.
  if (/^[=+@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toSyntheticCsv(entries: HistoryEntry[]): string {
  const rows = [['recorded_at', 'metric', 'value', 'unit', 'is_synthetic']];
  for (const entry of entries) {
    for (const reading of entry.readings) {
      rows.push([
        entry.recordedAt,
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

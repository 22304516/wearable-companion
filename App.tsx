import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { makeSyntheticReadings, Reading } from './src/simulator';
import { HistoryEntry, sanitizeHistory, sanitizeVisibleMetrics } from './src/storage';
import { makeCsvFileName, toSyntheticCsv } from './src/csv';
import { exportCsv } from './src/exportCsv';
import { filterHistoryByRange, HistoryRange, summarizeMetric } from './src/history';

const HISTORY_KEY = 'wearable-companion.synthetic-history.v1';
const PREFERENCES_KEY = 'wearable-companion.visible-metrics.v1';
const MAX_HISTORY_ITEMS = 200;
const REFRESH_INTERVAL_MS = 3000;
const AVAILABLE_METRICS = ['Heart rate', 'Steps today', 'Skin temperature'];

function makeHistoryEntry(readings: Reading[]): HistoryEntry {
  const recordedAt = new Date().toISOString();
  return { id: recordedAt, recordedAt, readings };
}

function Metric({ reading }: { reading: Reading }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{reading.label}</Text>
      <Text style={styles.metricValue}>
        {reading.value} <Text style={styles.unit}>{reading.unit}</Text>
      </Text>
    </View>
  );
}

function NavigationButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.navButton, selected && styles.navButtonSelected]}
    >
      <Text style={[styles.navText, selected && styles.navTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function PreferenceRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.preferenceRow}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.preferenceLabel}>{label}</Text>
      <Text style={styles.preferenceState}>{selected ? 'Shown' : 'Hidden'}</Text>
    </Pressable>
  );
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const date = new Date(entry.recordedAt);
  const timeLabel = Number.isNaN(date.getTime())
    ? 'Unknown time'
    : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <View style={styles.historyCard}>
      <Text style={styles.historyTime}>{timeLabel}</Text>
      {entry.readings.map(reading => (
        <View key={reading.label} style={styles.historyMetric}>
          <Text style={styles.historyLabel}>{reading.label}</Text>
          <Text style={styles.historyValue}>
            {reading.value} {reading.unit}
          </Text>
        </View>
      ))}
    </View>
  );
}

function TrendCard({
  label,
  unit,
  entries,
}: {
  label: string;
  unit: string;
  entries: HistoryEntry[];
}) {
  const points = entries
    .slice(0, 20)
    .reverse()
    .flatMap(entry => {
      const reading = entry.readings.find(item => item.label === label);
      return reading ? [{ value: reading.value, recordedAt: entry.recordedAt }] : [];
    });

  if (points.length === 0) return null;

  const values = points.map(point => point.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const latest = points[points.length - 1].value;
  const firstTime = new Date(points[0].recordedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const lastTime = new Date(points[points.length - 1].recordedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const accessibilitySummary = `${label}. ${points.length} recent synthetic samples. Low ${minimum} ${unit}, high ${maximum} ${unit}, latest ${latest} ${unit}.`;

  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>{label}</Text>
        <Text style={styles.trendLatest}>{latest} {unit}</Text>
      </View>
      <View accessible accessibilityRole="image" accessibilityLabel={accessibilitySummary} style={styles.chart}>
        {points.map((point, index) => {
          const height = maximum === minimum
            ? 28
            : 8 + ((point.value - minimum) / (maximum - minimum)) * 42;
          return (
            <View
              key={`${point.recordedAt}-${index}`}
              style={styles.chartColumn}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <View style={[styles.chartBar, { height }]} />
            </View>
          );
        })}
      </View>
      <View style={styles.trendFooter}>
        <Text style={styles.trendRange}>Low {minimum} · High {maximum} {unit}</Text>
        <Text style={styles.trendTime}>{firstTime}–{lastTime}</Text>
      </View>
    </View>
  );
}

function HistoryRangeButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.rangeButton, selected && styles.rangeButtonSelected]}
    >
      <Text style={[styles.rangeButtonText, selected && styles.rangeButtonTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function SummaryCard({
  label,
  unit,
  entries,
}: {
  label: string;
  unit: string;
  entries: HistoryEntry[];
}) {
  const summary = summarizeMetric(entries, label);
  if (!summary) return null;

  const average = Number.isInteger(summary.average)
    ? summary.average
    : summary.average.toFixed(1);

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{label}</Text>
      <View style={styles.summaryGrid}>
        <Text style={styles.summaryItem}>Average  {average} {unit}</Text>
        <Text style={styles.summaryItem}>Low  {summary.minimum} {unit}</Text>
        <Text style={styles.summaryItem}>High  {summary.maximum} {unit}</Text>
        <Text style={styles.summaryItem}>Latest  {summary.latest} {unit}</Text>
      </View>
      <Text style={styles.summaryCount}>{summary.count} synthetic samples in this range</Text>
    </View>
  );
}

export default function App() {
  const [readings, setReadings] = useState(makeSyntheticReadings());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [screen, setScreen] = useState<'today' | 'history' | 'devices' | 'settings'>('today');
  const [simulatorRunning, setSimulatorRunning] = useState(true);
  const [visibleMetrics, setVisibleMetrics] = useState(AVAILABLE_METRICS);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [preferencesError, setPreferencesError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [historyRange, setHistoryRange] = useState<HistoryRange>('24h');
  const historyRef = useRef<HistoryEntry[]>([]);
  const preferencesRef = useRef<string[]>(AVAILABLE_METRICS);
  const preferenceWriteRef = useRef<Promise<void>>(Promise.resolve());
  const visibleHistory = filterHistoryByRange(history, historyRange);

  useEffect(() => {
    let active = true;

    async function restorePreferences() {
      try {
        const saved = await AsyncStorage.getItem(PREFERENCES_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          const restored = sanitizeVisibleMetrics(parsed, AVAILABLE_METRICS);
          if (restored) {
            preferencesRef.current = restored;
            if (active) setVisibleMetrics(restored);
          }
        }
      } catch {
        if (active) setPreferencesError(true);
      } finally {
        if (active) setPreferencesLoaded(true);
      }
    }

    void restorePreferences();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreHistory() {
      try {
        const saved = await AsyncStorage.getItem(HISTORY_KEY);
        let restored: HistoryEntry[] = [];
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          restored = sanitizeHistory(parsed, MAX_HISTORY_ITEMS);
        }

        if (!active) return;
        historyRef.current = restored.slice(0, MAX_HISTORY_ITEMS);
        setHistory(historyRef.current);
        setHistoryLoaded(true);

        if (historyRef.current.length === 0) {
          const firstReadings = makeSyntheticReadings();
          const firstEntry = makeHistoryEntry(firstReadings);
          historyRef.current = [firstEntry];
          setReadings(firstReadings);
          setHistory(historyRef.current);
          await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(historyRef.current));
        }
      } catch {
        if (!active) return;
        setStorageError(true);
        setHistoryLoaded(true);
      }
    }

    void restoreHistory();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!historyLoaded || !simulatorRunning) return;

    const timer = setInterval(() => {
      const nextReadings = makeSyntheticReadings();
      const nextEntry = makeHistoryEntry(nextReadings);
      const nextHistory = [nextEntry, ...historyRef.current].slice(0, MAX_HISTORY_ITEMS);
      historyRef.current = nextHistory;
      setReadings(nextReadings);
      setHistory(nextHistory);

      void AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory)).catch(() => {
        setStorageError(true);
      });
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [historyLoaded, simulatorRunning]);

  async function clearHistory() {
    historyRef.current = [];
    setHistory([]);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function saveVisibleMetrics(next: string[]) {
    preferencesRef.current = next;
    setVisibleMetrics(next);
    preferenceWriteRef.current = preferenceWriteRef.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(next)))
      .then(() => setPreferencesError(false))
      .catch(() => setPreferencesError(true));
  }

  function toggleMetric(metric: string) {
    const next = preferencesRef.current.includes(metric)
      ? preferencesRef.current.filter(item => item !== metric)
      : AVAILABLE_METRICS.filter(item => preferencesRef.current.includes(item) || item === metric);
    saveVisibleMetrics(next);
  }

  function resetMetricPreferences() {
    saveVisibleMetrics([...AVAILABLE_METRICS]);
  }

  async function exportHistory() {
    if (visibleHistory.length === 0 || exporting) return;
    setExporting(true);
    setExportMessage('');
    try {
      await exportCsv(toSyntheticCsv(visibleHistory), makeCsvFileName());
      setExportMessage(`CSV export is ready with ${visibleHistory.length} synthetic samples from this range.`);
    } catch {
      setExportMessage('The CSV export could not be created. Please try again.');
    } finally {
      setExporting(false);
    }
  }

  function selectHistoryRange(range: HistoryRange) {
    setHistoryRange(range);
    setExportMessage('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>2026-CSE3CAP · PROTOTYPE</Text>
        <Text style={styles.title}>Wearable Companion</Text>
        <Text style={styles.subtitle}>A simple place to review wearable data.</Text>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            {simulatorRunning ? 'Simulator running' : 'Simulator paused'}
          </Text>
          <Text style={styles.noticeText}>
            These are synthetic sample readings. No wearable is connected and no health data is being collected.
          </Text>
        </View>

        {storageError && (
          <View style={styles.errorNotice} accessibilityRole="alert">
            <Text style={styles.errorText}>
              History could not be saved on this device. Current readings are still simulated.
            </Text>
          </View>
        )}
        {preferencesError && (
          <View style={styles.errorNotice} accessibilityRole="alert">
            <Text style={styles.errorText}>Display preferences could not be saved on this device.</Text>
          </View>
        )}

        <View style={styles.navigation} accessibilityRole="tablist">
          <NavigationButton label="Today" selected={screen === 'today'} onPress={() => setScreen('today')} />
          <NavigationButton label="History" selected={screen === 'history'} onPress={() => setScreen('history')} />
          <NavigationButton label="Devices" selected={screen === 'devices'} onPress={() => setScreen('devices')} />
          <NavigationButton label="Settings" selected={screen === 'settings'} onPress={() => setScreen('settings')} />
        </View>

        {screen === 'today' ? (
          <>
            <Text style={styles.section}>Today</Text>
            {readings.filter(item => visibleMetrics.includes(item.label)).map(item => (
              <Metric key={item.label} reading={item} />
            ))}
            {visibleMetrics.length === 0 && (
              <Text style={styles.emptyText}>No metrics are selected. Choose readings to show in Settings.</Text>
            )}
            <Text style={styles.section}>Device</Text>
            <View style={styles.device}>
              <Text style={styles.deviceName}>Demo wearable</Text>
              <Text style={styles.deviceStatus}>Simulated · not connected to hardware</Text>
            </View>
            <Text style={styles.footer}>Synthetic readings refresh every 3 seconds and are saved locally.</Text>
          </>
        ) : screen === 'history' ? (
          <>
            <View style={styles.historyHeading}>
              <View style={styles.historyHeadingCopy}>
                <Text style={styles.section}>Reading history</Text>
                <Text style={styles.historyCaption}>Synthetic sample readings · newest first</Text>
              </View>
              <View style={styles.historyActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Export synthetic reading history for the selected time range as CSV"
                  accessibilityState={{ disabled: visibleHistory.length === 0 || exporting }}
                  disabled={visibleHistory.length === 0 || exporting}
                  onPress={() => void exportHistory()}
                  style={[styles.clearButton, (visibleHistory.length === 0 || exporting) && styles.actionDisabled]}
                >
                  <Text style={styles.clearButtonText}>{exporting ? 'Exporting…' : 'Export CSV'}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear synthetic reading history"
                  onPress={() => void clearHistory()}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>
            </View>
            {exportMessage.length > 0 && (
              <Text style={styles.exportMessage} accessibilityRole="alert">{exportMessage}</Text>
            )}
            <View style={styles.rangeSelector} accessibilityRole="radiogroup" accessibilityLabel="History time range">
              <HistoryRangeButton label="24 hours" selected={historyRange === '24h'} onPress={() => selectHistoryRange('24h')} />
              <HistoryRangeButton label="7 days" selected={historyRange === '7d'} onPress={() => selectHistoryRange('7d')} />
              <HistoryRangeButton label="All" selected={historyRange === 'all'} onPress={() => selectHistoryRange('all')} />
            </View>
            {!historyLoaded ? (
              <Text style={styles.emptyText}>Loading saved history…</Text>
            ) : visibleHistory.length === 0 ? (
              <Text style={styles.emptyText}>No saved readings in this range. Choose a wider range or wait for new samples.</Text>
            ) : (
              <>
                <Text style={styles.trendsHeading}>Range summary</Text>
                <Text style={styles.trendsCaption}>
                  {historyRange === 'all' ? 'All saved samples' : `Samples from the last ${historyRange === '24h' ? '24 hours' : '7 days'}`} · synthetic demonstration data
                </Text>
                {readings.map(reading => (
                  <SummaryCard
                    key={reading.label}
                    label={reading.label}
                    unit={reading.unit}
                    entries={visibleHistory}
                  />
                ))}
                <Text style={styles.trendsHeading}>Recent trends</Text>
                <Text style={styles.trendsCaption}>Latest {Math.min(visibleHistory.length, 20)} samples in this range · each chart scales to its own range</Text>
                {readings.map(reading => (
                  <TrendCard
                    key={reading.label}
                    label={reading.label}
                    unit={reading.unit}
                    entries={visibleHistory}
                  />
                ))}
                <Text style={styles.trendsHeading}>Saved readings</Text>
                {visibleHistory.map(entry => <HistoryCard key={entry.id} entry={entry} />)}
              </>
            )}
            <Text style={styles.footer}>
              Up to {MAX_HISTORY_ITEMS} samples are kept on this device; at a 3-second capture interval that is about 10 minutes of continuous history.
            </Text>
          </>
        ) : screen === 'devices' ? (
          <>
            <Text style={styles.section}>Device simulator</Text>
            <View style={styles.deviceCard}>
              <Text style={styles.deviceName}>Demo wearable</Text>
              <Text style={styles.deviceStatus}>Simulator only · no hardware connection</Text>
              <View style={styles.deviceDivider} />
              <Text style={styles.controlLabel}>Sample generation</Text>
              <Text style={styles.controlValue}>
                {simulatorRunning ? 'Running · new sample every 3 seconds' : 'Paused · no new samples are being recorded'}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={simulatorRunning ? 'Pause synthetic sample generation' : 'Resume synthetic sample generation'}
                onPress={() => setSimulatorRunning(running => !running)}
                style={[styles.simulatorButton, simulatorRunning && styles.pauseButton]}
              >
                <Text style={styles.simulatorButtonText}>
                  {simulatorRunning ? 'Pause sample generation' : 'Resume sample generation'}
                </Text>
              </Pressable>
            </View>
            <View style={styles.deviceNote}>
              <Text style={styles.deviceNoteTitle}>What this control does</Text>
              <Text style={styles.deviceNoteText}>
                It pauses or resumes synthetic samples in this app. It does not scan for, pair with, or send commands to a real wearable.
              </Text>
            </View>
            <Text style={styles.footer}>Sample history remains saved when generation is paused.</Text>
          </>
        ) : (
          <>
            <Text style={styles.section}>Display preferences</Text>
            <Text style={styles.settingsIntro}>
              Choose which synthetic readings appear on the Today dashboard. All readings continue to be saved in History while the simulator is running.
            </Text>
            {!preferencesLoaded ? (
              <Text style={styles.emptyText}>Loading saved preferences…</Text>
            ) : (
              <>
                <View style={styles.preferenceList}>
                  {AVAILABLE_METRICS.map(metric => (
                    <PreferenceRow
                      key={metric}
                      label={metric}
                      selected={visibleMetrics.includes(metric)}
                      onPress={() => toggleMetric(metric)}
                    />
                  ))}
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={resetMetricPreferences}
                  style={styles.resetButton}
                >
                  <Text style={styles.resetButtonText}>Show all readings</Text>
                </Pressable>
              </>
            )}
            <View style={styles.deviceNote}>
              <Text style={styles.deviceNoteTitle}>Saved on this device</Text>
              <Text style={styles.deviceNoteText}>
                These display preferences are stored locally and do not require an account.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6fa' },
  container: { padding: 22, paddingTop: 30, maxWidth: 720, width: '100%', alignSelf: 'center' },
  eyebrow: { color: '#5263a7', fontSize: 12, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: '#17213b', fontSize: 30, fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#69748c', fontSize: 15, marginTop: 7, marginBottom: 22 },
  notice: { backgroundColor: '#fff4d8', borderColor: '#efd18a', borderWidth: 1, borderRadius: 14, padding: 15, marginBottom: 16 },
  noticeTitle: { color: '#72540d', fontWeight: '700', marginBottom: 5 },
  noticeText: { color: '#72540d', lineHeight: 20 },
  errorNotice: { backgroundColor: '#fff0ef', borderColor: '#efc4c0', borderWidth: 1, borderRadius: 12, padding: 13, marginBottom: 16 },
  errorText: { color: '#87352d', lineHeight: 19 },
  navigation: { flexDirection: 'row', gap: 8, backgroundColor: '#e8ebf3', borderRadius: 13, padding: 4, marginBottom: 23 },
  navButton: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 10 },
  navButtonSelected: { backgroundColor: 'white' },
  navText: { color: '#69748c', fontSize: 14, fontWeight: '600' },
  navTextSelected: { color: '#303f80' },
  section: { color: '#17213b', fontSize: 19, fontWeight: '700', marginBottom: 11, marginTop: 3 },
  metric: { backgroundColor: 'white', borderRadius: 14, padding: 17, marginBottom: 10 },
  metricLabel: { color: '#69748c', fontSize: 14 },
  metricValue: { color: '#17213b', fontSize: 26, fontWeight: '700', marginTop: 7 },
  unit: { color: '#69748c', fontSize: 15, fontWeight: '500' },
  device: { backgroundColor: 'white', borderRadius: 14, padding: 17 },
  deviceCard: { backgroundColor: 'white', borderRadius: 14, padding: 18 },
  deviceName: { color: '#17213b', fontSize: 16, fontWeight: '700' },
  deviceStatus: { color: '#69748c', marginTop: 5 },
  deviceDivider: { height: 1, backgroundColor: '#e8ebf3', marginVertical: 17 },
  controlLabel: { color: '#69748c', fontSize: 13, fontWeight: '600' },
  controlValue: { color: '#17213b', fontSize: 15, lineHeight: 21, marginTop: 5 },
  simulatorButton: { alignItems: 'center', backgroundColor: '#5263a7', borderRadius: 11, padding: 13, marginTop: 17 },
  pauseButton: { backgroundColor: '#4d5a82' },
  simulatorButtonText: { color: 'white', fontSize: 14, fontWeight: '700' },
  deviceNote: { backgroundColor: '#eef1fa', borderRadius: 13, padding: 15, marginTop: 14 },
  deviceNoteTitle: { color: '#303f80', fontSize: 14, fontWeight: '700', marginBottom: 5 },
  deviceNoteText: { color: '#495577', fontSize: 13, lineHeight: 19 },
  settingsIntro: { color: '#69748c', fontSize: 14, lineHeight: 21, marginBottom: 14 },
  preferenceList: { backgroundColor: 'white', borderRadius: 14, paddingHorizontal: 15 },
  preferenceRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#edf0f5' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#a7afc2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxSelected: { borderColor: '#5263a7', backgroundColor: '#5263a7' },
  checkmark: { color: 'white', fontSize: 15, fontWeight: '700', lineHeight: 18 },
  preferenceLabel: { flex: 1, color: '#17213b', fontSize: 14, fontWeight: '600' },
  preferenceState: { color: '#69748c', fontSize: 12 },
  resetButton: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: '#e6e9f2', marginTop: 13 },
  resetButtonText: { color: '#303f80', fontSize: 13, fontWeight: '700' },
  historyHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  historyHeadingCopy: { flex: 1 },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rangeSelector: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  rangeButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: '#e8ebf3' },
  rangeButtonSelected: { backgroundColor: '#5263a7' },
  rangeButtonText: { color: '#495577', fontSize: 13, fontWeight: '600' },
  rangeButtonTextSelected: { color: 'white' },
  historyCaption: { color: '#69748c', fontSize: 13, marginTop: -5 },
  clearButton: { paddingHorizontal: 10, paddingVertical: 9, borderRadius: 10, backgroundColor: '#e6e9f2' },
  clearButtonText: { color: '#303f80', fontSize: 13, fontWeight: '700' },
  actionDisabled: { opacity: 0.45 },
  exportMessage: { color: '#495577', backgroundColor: '#eef1fa', borderRadius: 10, padding: 12, marginBottom: 12, lineHeight: 18 },
  historyCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 10 },
  historyTime: { color: '#303f80', fontSize: 13, fontWeight: '700', marginBottom: 10 },
  historyMetric: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  historyLabel: { color: '#69748c', fontSize: 14 },
  historyValue: { color: '#17213b', fontSize: 14, fontWeight: '600' },
  trendsHeading: { color: '#17213b', fontSize: 17, fontWeight: '700', marginTop: 8, marginBottom: 5 },
  trendsCaption: { color: '#69748c', fontSize: 13, lineHeight: 19, marginBottom: 11 },
  summaryCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 10 },
  summaryTitle: { color: '#17213b', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  summaryItem: { width: '50%', color: '#495577', fontSize: 13 },
  summaryCount: { color: '#818ba0', fontSize: 12, marginTop: 10 },
  trendCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 10 },
  trendHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trendTitle: { color: '#69748c', fontSize: 14, fontWeight: '600' },
  trendLatest: { color: '#17213b', fontSize: 17, fontWeight: '700' },
  chart: { height: 62, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, borderBottomWidth: 1, borderBottomColor: '#e8ebf3' },
  chartColumn: { flex: 1, height: 54, justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 1 },
  chartBar: { width: '58%', minWidth: 3, maxWidth: 12, backgroundColor: '#7182ce', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  trendFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  trendRange: { color: '#69748c', fontSize: 12 },
  trendTime: { color: '#818ba0', fontSize: 12 },
  emptyText: { color: '#69748c', backgroundColor: 'white', borderRadius: 14, padding: 18, lineHeight: 21 },
  footer: { color: '#818ba0', fontSize: 12, marginTop: 20, marginBottom: 10, textAlign: 'center' },
});

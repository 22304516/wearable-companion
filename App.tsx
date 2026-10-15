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

const HISTORY_KEY = 'wearable-companion.synthetic-history.v1';
const MAX_HISTORY_ITEMS = 200;
const REFRESH_INTERVAL_MS = 3000;

type HistoryEntry = {
  id: string;
  recordedAt: string;
  readings: Reading[];
};

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

export default function App() {
  const [readings, setReadings] = useState(makeSyntheticReadings());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [screen, setScreen] = useState<'today' | 'history' | 'devices'>('today');
  const [simulatorRunning, setSimulatorRunning] = useState(true);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const historyRef = useRef<HistoryEntry[]>([]);

  useEffect(() => {
    let active = true;

    async function restoreHistory() {
      try {
        const saved = await AsyncStorage.getItem(HISTORY_KEY);
        let restored: HistoryEntry[] = [];
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            restored = parsed.filter(
              (item): item is HistoryEntry =>
                typeof item?.id === 'string' &&
                typeof item?.recordedAt === 'string' &&
                Array.isArray(item?.readings),
            );
          }
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

        <View style={styles.navigation} accessibilityRole="tablist">
          <NavigationButton label="Today" selected={screen === 'today'} onPress={() => setScreen('today')} />
          <NavigationButton label="History" selected={screen === 'history'} onPress={() => setScreen('history')} />
          <NavigationButton label="Devices" selected={screen === 'devices'} onPress={() => setScreen('devices')} />
        </View>

        {screen === 'today' ? (
          <>
            <Text style={styles.section}>Today</Text>
            {readings.map(item => <Metric key={item.label} reading={item} />)}
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear synthetic reading history"
                onPress={() => void clearHistory()}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>
            {!historyLoaded ? (
              <Text style={styles.emptyText}>Loading saved history…</Text>
            ) : history.length === 0 ? (
              <Text style={styles.emptyText}>No saved readings yet. New samples will appear here.</Text>
            ) : (
              <>
                <Text style={styles.trendsHeading}>Recent trends</Text>
                <Text style={styles.trendsCaption}>
                  Latest {Math.min(history.length, 20)} samples · each chart scales to its own range
                </Text>
                {readings.map(reading => (
                  <TrendCard
                    key={reading.label}
                    label={reading.label}
                    unit={reading.unit}
                    entries={history}
                  />
                ))}
                <Text style={styles.trendsHeading}>Saved readings</Text>
                {history.map(entry => <HistoryCard key={entry.id} entry={entry} />)}
              </>
            )}
            <Text style={styles.footer}>Up to {MAX_HISTORY_ITEMS} samples are kept on this device.</Text>
          </>
        ) : (
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
  historyHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  historyHeadingCopy: { flex: 1 },
  historyCaption: { color: '#69748c', fontSize: 13, marginTop: -5 },
  clearButton: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 10, backgroundColor: '#e6e9f2', marginLeft: 12 },
  clearButtonText: { color: '#303f80', fontSize: 13, fontWeight: '700' },
  historyCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 10 },
  historyTime: { color: '#303f80', fontSize: 13, fontWeight: '700', marginBottom: 10 },
  historyMetric: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  historyLabel: { color: '#69748c', fontSize: 14 },
  historyValue: { color: '#17213b', fontSize: 14, fontWeight: '600' },
  trendsHeading: { color: '#17213b', fontSize: 17, fontWeight: '700', marginTop: 8, marginBottom: 5 },
  trendsCaption: { color: '#69748c', fontSize: 13, lineHeight: 19, marginBottom: 11 },
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

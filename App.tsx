import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { makeSyntheticReadings, Reading } from './src/simulator';

function Metric({ reading }: { reading: Reading }) {
  return <View style={styles.metric}>
    <Text style={styles.metricLabel}>{reading.label}</Text>
    <Text style={styles.metricValue}>{reading.value} <Text style={styles.unit}>{reading.unit}</Text></Text>
  </View>;
}

export default function App() {
  const [readings, setReadings] = useState(makeSyntheticReadings());
  useEffect(() => {
    const timer = setInterval(() => setReadings(makeSyntheticReadings()), 3000);
    return () => clearInterval(timer);
  }, []);

  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>2026-CSE3CAP · PROTOTYPE</Text>
      <Text style={styles.title}>Wearable Companion</Text>
      <Text style={styles.subtitle}>A simple place to review wearable data.</Text>
      <View style={styles.notice}><Text style={styles.noticeTitle}>Simulator active</Text>
        <Text style={styles.noticeText}>These are synthetic sample readings. No wearable is connected and no health data is being collected.</Text>
      </View>
      <Text style={styles.section}>Today</Text>
      {readings.map(item => <Metric key={item.label} reading={item} />)}
      <Text style={styles.section}>Device</Text>
      <View style={styles.device}><Text style={styles.deviceName}>Demo wearable</Text><Text style={styles.deviceStatus}>Simulated · not connected to hardware</Text></View>
      <Text style={styles.footer}>Prototype foundation · data refreshes every 3 seconds</Text>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6fa' },
  container: { padding: 22, paddingTop: 30 },
  eyebrow: { color: '#5263a7', fontSize: 12, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: '#17213b', fontSize: 30, fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#69748c', fontSize: 15, marginTop: 7, marginBottom: 22 },
  notice: { backgroundColor: '#fff4d8', borderColor: '#efd18a', borderWidth: 1, borderRadius: 14, padding: 15, marginBottom: 25 },
  noticeTitle: { color: '#72540d', fontWeight: '700', marginBottom: 5 },
  noticeText: { color: '#72540d', lineHeight: 20 },
  section: { color: '#17213b', fontSize: 19, fontWeight: '700', marginBottom: 11, marginTop: 3 },
  metric: { backgroundColor: 'white', borderRadius: 14, padding: 17, marginBottom: 10 },
  metricLabel: { color: '#69748c', fontSize: 14 },
  metricValue: { color: '#17213b', fontSize: 26, fontWeight: '700', marginTop: 7 },
  unit: { color: '#69748c', fontSize: 15, fontWeight: '500' },
  device: { backgroundColor: 'white', borderRadius: 14, padding: 17 },
  deviceName: { color: '#17213b', fontSize: 16, fontWeight: '700' },
  deviceStatus: { color: '#69748c', marginTop: 5 },
  footer: { color: '#818ba0', fontSize: 12, marginTop: 25, textAlign: 'center' },
});

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from './authClient';

type AuthMode = 'sign-in' | 'sign-up';

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit() {
    if (!supabase || busy) return;
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      setMessage('');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setMessage('');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (mode === 'sign-up') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage('Account created. Check your email to confirm your address, then sign in.');
          setMode('sign-in');
          setPassword('');
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (authError) throw authError;
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const signingUp = mode === 'sign-up';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <View style={styles.card}>
          <Text style={styles.eyebrow}>2026-CSE3CAP</Text>
          <Text style={styles.title}>Wearable Companion</Text>
          <Text style={styles.subtitle}>
            {signingUp ? 'Create an account to continue.' : 'Sign in to continue to your account.'}
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            returnKeyType="next"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            accessibilityLabel="Password"
            autoCapitalize="none"
            autoComplete={signingUp ? 'new-password' : 'current-password'}
            onChangeText={setPassword}
            onSubmitEditing={() => void submit()}
            placeholder="At least 8 characters"
            returnKeyType="done"
            secureTextEntry
            style={styles.input}
            textContentType={signingUp ? 'newPassword' : 'password'}
            value={password}
          />

          {error.length > 0 && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          {message.length > 0 && <Text accessibilityRole="alert" style={styles.message}>{message}</Text>}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: busy }}
            disabled={busy}
            onPress={() => void submit()}
            style={[styles.primaryButton, busy && styles.disabled]}
          >
            <Text style={styles.primaryButtonText}>
              {busy ? 'Please wait…' : signingUp ? 'Create account' : 'Sign in'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => {
              setMode(signingUp ? 'sign-in' : 'sign-up');
              setError('');
              setMessage('');
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              {signingUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
            </Text>
          </Pressable>

          <Text style={styles.privacyNote}>
            This prototype stores synthetic sample history on this device. Do not enter real health data.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6fa', justifyContent: 'center' },
  keyboard: { justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: 'white', borderRadius: 18, padding: 24 },
  eyebrow: { color: '#5263a7', fontSize: 12, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: '#17213b', fontSize: 28, fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#69748c', fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 22 },
  label: { color: '#303f80', fontSize: 14, fontWeight: '700', marginBottom: 7, marginTop: 12 },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#c8cedb', borderRadius: 10, color: '#17213b', paddingHorizontal: 13, fontSize: 16 },
  primaryButton: { alignItems: 'center', justifyContent: 'center', minHeight: 48, backgroundColor: '#5263a7', borderRadius: 11, marginTop: 20, padding: 12 },
  primaryButtonText: { color: 'white', fontSize: 15, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', padding: 14, marginTop: 4 },
  secondaryButtonText: { color: '#303f80', fontSize: 14, fontWeight: '600' },
  disabled: { opacity: 0.55 },
  error: { color: '#87352d', backgroundColor: '#fff0ef', borderRadius: 9, padding: 11, lineHeight: 19, marginTop: 13 },
  message: { color: '#375a38', backgroundColor: '#eaf5e9', borderRadius: 9, padding: 11, lineHeight: 19, marginTop: 13 },
  privacyNote: { color: '#69748c', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 14 },
});

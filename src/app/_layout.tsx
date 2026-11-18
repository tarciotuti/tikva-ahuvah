import React, { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from '../services/database';
import { ActivityIndicator, View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { COLORS } from '../constants/theme';
import { getSecurityConfig, SecurityConfig } from '../services/security';
import { SecurityLockScreen } from '../components/SecurityLockScreen';

export default function RootLayout() {
  const [isReady] = useState(() => {
    try {
      initDatabase();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  });

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => {
    try {
      initDatabase();
      return getSecurityConfig();
    } catch {
      return { isLockEnabled: false, pin: '', useBiometrics: true };
    }
  });

  const [isLocked, setIsLocked] = useState(() => securityConfig.isLockEnabled);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        (appState.current || '').match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const latestConfig = getSecurityConfig();
        setSecurityConfig(latestConfig);
        if (latestConfig.isLockEnabled) {
          setIsLocked(true);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="memory/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="note/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="capsule/[id]"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="new-note"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="new-memory"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>

      {/* Tela de Bloqueio se a Segurança estiver ativa */}
      {isLocked && securityConfig.isLockEnabled && (
        <SecurityLockScreen
          storedPin={securityConfig.pin}
          useBiometrics={securityConfig.useBiometrics}
          onUnlock={() => setIsLocked(false)}
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

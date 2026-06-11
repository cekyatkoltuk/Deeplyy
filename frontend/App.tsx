import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/authStore';
import { Colors } from './src/utils/theme';
import { 
  useFonts,
  Archivo_700Bold 
} from '@expo-google-fonts/archivo';
import {
  MuseoModerno_300Light_Italic
} from '@expo-google-fonts/museomoderno';
import {
  Karla_700Bold_Italic
} from '@expo-google-fonts/karla';
import {
  MontserratAlternates_800ExtraBold
} from '@expo-google-fonts/montserrat-alternates';

const AppContent = () => {
  const { loadToken } = useAuthStore();
  const [ready, setReady] = React.useState(false);
  
  const [fontsLoaded] = useFonts({
    Archivo_700Bold,
    MuseoModerno_300Light_Italic,
    Karla_700Bold_Italic,
    MontserratAlternates_800ExtraBold,
  });

  useEffect(() => {
    loadToken().finally(() => setReady(true));
  }, []);

  if (!ready || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <RootNavigator />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <AppContent />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});

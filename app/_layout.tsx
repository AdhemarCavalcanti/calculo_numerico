import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerBackTitle: 'Voltar', // Texto do botão de voltar no cabeçalho
        }}
      >
        {/* Tela inicial sem cabeçalho */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Modal com título e botão voltar com texto personalizado */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
            // headerBackTitle: 'Voltar' // já definido globalmente acima
          }}
        />
        {/* Adicione aqui outras telas com opções padrão, terão botão voltar com texto "Voltar" */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

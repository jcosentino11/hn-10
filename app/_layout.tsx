import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { HackerNewsProvider } from '@/components/HackerNewsProvider';
import { SettingsProvider } from '@/components/SettingsProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SettingsProvider>
      <HackerNewsProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="detail"/>
          </Stack>
        </ThemeProvider>
      </HackerNewsProvider>
    </SettingsProvider>
  );
}
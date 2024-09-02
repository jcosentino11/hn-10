import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { LoginProvider } from '@/components/LoginProvider';
import { SettingsProvider } from '@/components/SettingsProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SettingsProvider>
      <LoginProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="detail"/>
          </Stack>
        </ThemeProvider>
      </LoginProvider>
    </SettingsProvider>
  );
}
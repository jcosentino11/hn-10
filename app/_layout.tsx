import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { LoginProvider } from '@/components/LoginProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <LoginProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="detail"/>
        </Stack>
      </ThemeProvider>
    </LoginProvider>
  );
}
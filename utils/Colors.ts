// utils/Colors.ts
import { useColorScheme } from 'react-native';

type ColorName = 'background' | 'text' | 'border' | 'tint' | 'subtitle' | 'card' | 'shadow';

const lightColors: Record<ColorName, string> = {
  background: '#F0F4F8',
  text: '#1A202C',
  border: '#E2E8F0',
  tint: '#3182CE',
  subtitle: '#718096',
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkColors: Record<ColorName, string> = {
  background: '#1A202C',
  text: '#F7FAFC',
  border: '#2D3748',
  tint: '#63B3ED',
  subtitle: '#A0AEC0',
  card: '#2D3748',
  shadow: 'rgba(255, 255, 255, 0.1)',
};

export const useThemeColor = (
  colorScheme: ReturnType<typeof useColorScheme>,
  colorName: ColorName
): string => {
  const theme = colorScheme === 'dark' ? darkColors : lightColors;
  return theme[colorName];
};
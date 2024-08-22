export const Colors = {
  light: {
    white: "#ffffff",
    black: "#000000",
    grey: "#555555",
    lightGrey: "#dddddd",
    offWhite: "#f6f6f6",
  },
  dark: {
    white: "#121212",
    black: "#ffffff",
    grey: "#888888",
    lightGrey: "#444444",
    offWhite: "#1d1d1d",
  },
};

export function useThemeColor(
  theme: "light" | "dark" | null | undefined,
  color: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  return Colors[theme ?? 'light'][color];
}

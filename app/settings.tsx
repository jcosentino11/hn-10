import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, SafeAreaView, StatusBar, Appearance } from 'react-native';
import { useColorScheme } from 'react-native';
import { useThemeColor } from "@/utils/Colors";
import { Feather } from '@expo/vector-icons';
import Header from '@/components/Header';

export default function SettingsPage() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [selectedBrowser, setSelectedBrowser] = useState('in-app');

  const backgroundColor = useThemeColor(colorScheme, 'background');
  const textColor = useThemeColor(colorScheme, 'text');
  const cardColor = useThemeColor(colorScheme, 'card');
  const tintColor = useThemeColor(colorScheme, 'tint');

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    Appearance.setColorScheme(newMode ? 'dark' : 'light');
  };

  const changeBrowser = (browser) => {
    setSelectedBrowser(browser);
    // Implement logic to change default browser
  };

  const handleTip = () => {
    Alert.alert(
      "Support the Developer",
      "Thank you for considering a tip! This will open the in-app purchase flow.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed", onPress: () => {
          // Implement in-app purchase logic here
          console.log("Initiate in-app purchase");
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor  }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header 
        title='Settings' 
        showLoginIcon={false} 
        showOptionsIcon={false} 
        showBackIcon={true} 
        details={undefined} />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
          <View style={styles.setting}>
            <Text style={[styles.settingText, { color: textColor }]}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Browser</Text>
          {['in-app', 'google', 'safari'].map((browser) => (
            <TouchableOpacity 
              key={browser} 
              style={styles.setting} 
              onPress={() => changeBrowser(browser)}
            >
              <Text style={[styles.settingText, { color: textColor }]}>{browser}</Text>
              {selectedBrowser === browser && <Feather name="check" size={24} color={tintColor} />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.tipButton, { backgroundColor: tintColor }]} onPress={handleTip}>
          <Text style={styles.tipButtonText}>Buy Me a Coffee</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingText: {
    fontSize: 16,
  },
  tipButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
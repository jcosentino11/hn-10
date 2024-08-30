import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, useColorScheme } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export default function HackerNewsPageDetail() {
  const { url, story, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const theme = {
    background: isDarkMode ? '#1C1C1E' : '#F2F2F7',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    border: isDarkMode ? '#38383A' : '#E5E5EA',
    tint: isDarkMode ? '#0A84FF' : '#007AFF',
    grey: isDarkMode ? '#8E8E93' : '#8E8E93',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.tint }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Story {story}</Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <Text style={[styles.footerText, { color: theme.grey }]}>HN-10</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 16,
  },
  webview: {
    flex: 1,
    borderRadius: 10,
    margin: 16,
    overflow: 'hidden',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
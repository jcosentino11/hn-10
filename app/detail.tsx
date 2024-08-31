import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, useColorScheme, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const darkReaderScript = `
  (function() {
    var darkReaderScript = document.createElement('script');
    darkReaderScript.src = 'https://cdn.jsdelivr.net/npm/darkreader@4.9.58/darkreader.min.js';
    darkReaderScript.onload = function() {
      DarkReader.setFetchMethod(window.fetch);
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10
      });
    };
    document.head.appendChild(darkReaderScript);
  })();
`;

export default function HackerNewsPageDetail() {
  const { url, story, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const webViewRef = useRef(null);

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

  const injectedJavaScript = isDarkMode ? darkReaderScript : '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.tint }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{story}.   {title}</Text>
      </View>
      <WebView
        ref={webViewRef}
        mediaPlaybackRequiresUserAction={true}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={false}
        source={{ uri: url }}
        style={styles.webview}
        injectedJavaScript={injectedJavaScript}
        javaScriptCanOpenWindowsAutomatically={false}
        onMessage={(event) => {}}
      />
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
    paddingRight: 80
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
});
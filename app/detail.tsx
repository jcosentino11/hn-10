import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useThemeColor } from "@/utils/Colors";
import { Feather } from '@expo/vector-icons';

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

  const backgroundColor = useThemeColor(colorScheme, 'background');
  const textColor = useThemeColor(colorScheme, 'text');
  const borderColor = useThemeColor(colorScheme, 'border');
  const tintColor = useThemeColor(colorScheme, 'tint');
  const cardColor = useThemeColor(colorScheme, 'card');
  const subtitleColor = useThemeColor(colorScheme, 'subtitle');


  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const injectedJavaScript = isDarkMode ? darkReaderScript : '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.header, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={tintColor} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerNumber, { color: tintColor }]}>{story}.</Text>
          <View>
            <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>{title}</Text>
          
            <Text style={[styles.headerSubtitle, { color: subtitleColor }]} numberOfLines={1}>{typeof url == 'string' ? new URL(url).hostname : ''}</Text>
          </View>
        </View>
      </View>
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webview}
          injectedJavaScript={injectedJavaScript}
          onMessage={() => {}}
          mediaPlaybackRequiresUserAction={true}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={false}
          javaScriptCanOpenWindowsAutomatically={false}
        />
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 30,
  },
  headerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
  },
  webViewContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  webview: {
    flex: 1,
  },
});
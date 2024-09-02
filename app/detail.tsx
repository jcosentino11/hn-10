import React, { useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, useColorScheme, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useThemeColor } from "@/utils/Colors";
import { Feather } from '@expo/vector-icons';
import LoginModal from '@/components/LoginModal';
import Header from '@/components/Header';
import { LoginContext } from '@/components/LoginProvider';

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
  const loginContext = useContext(LoginContext);
  const [isFavorited, setIsFavorited] = useState(false);

  const webViewRef = useRef(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const backgroundColor = useThemeColor(colorScheme, 'background');
  const tintColor = useThemeColor(colorScheme, 'tint');
  const subtitleColor = useThemeColor(colorScheme, 'subtitle');

  const toggleFavorite = () => {
    if (loginContext.isLoggedIn) {
      setIsFavorited(!isFavorited);
      // TODO
    } else {
      loginContext.showModal(true);
    }
  };

  const sharePost = async () => {
    try {
      await Share.share({
        message: `Check out this Hacker News post: ${title} - ${url}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const injectedJavaScript = isDarkMode ? darkReaderScript : '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {typeof url == 'string' && typeof story == 'string' && typeof title == 'string' && 
            <Header details={{url: new URL(url), story: story, title: title}} />
      }
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
      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleFavorite} style={styles.footerButton}>
          <Feather name={isFavorited ? "star" : "star"} size={24} color={tintColor} />
          <Text style={{ color: subtitleColor }}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sharePost} style={styles.footerButton}>
          <Feather name="share-2" size={24} color={tintColor} />
          <Text style={{ color: subtitleColor }}>Share</Text>
        </TouchableOpacity>
      </View>
      <LoginModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  footerButton: {
    alignItems: 'center',
  },
});
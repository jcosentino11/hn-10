import React, { useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, useColorScheme, Share, Linking, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useThemeColor } from "@/utils/Colors";
import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '@/components/Header';
import { LoginContext } from '@/components/LoginProvider';
import { SettingsContext } from '@/components/SettingsProvider';

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
  // TODO load favorite based on login
  const [isFavorited, setIsFavorited] = useState(false);

  const settingsContext = useContext(SettingsContext);
  const webViewRef = useRef(null);

  const searchParamAsString: ((param: string | string[]) => string | undefined) = 
    (param: string | string[]) => {
      if (Array.isArray(param)) {
        return undefined;
      }
      param = param.trim();
      if (param.length == 0 || param == 'undefined') {
        return undefined;
      }
      return param;
    };

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

  const renderContent = () => {
    const urlStr = searchParamAsString(url);
    if (!urlStr) {
      return (null);
    }

    if (settingsContext.selectedBrowser == 'In App') {
      return (
        <View style={styles.webViewContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: urlStr }}
            style={styles.webview}
            injectedJavaScript={injectedJavaScript}
            onMessage={() => {}}
            mediaPlaybackRequiresUserAction={true}
            allowsInlineMediaPlayback={true}
            allowsFullscreenVideo={false}
            javaScriptCanOpenWindowsAutomatically={false}
          />
      </View>
      );
    }
    if (settingsContext.selectedBrowser == 'Default') {
      return (
        <View style={[styles.webViewContainer, {paddingTop: '50%'}]}>
          <Button title="Open in Default Browser" onPress={() => Linking.openURL(urlStr)} />
        </View>
      );
    }
    return (null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header 
        title={undefined}
        showLoginIcon={false} 
        showOptionsIcon={false} 
        showBackIcon={true} 
        details={{
          url: searchParamAsString(url), 
          story: searchParamAsString(story), 
          title: searchParamAsString(title),
        }}
      />
      {renderContent()}
      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleFavorite} style={styles.footerButton}>
          {isFavorited ? 
            <FontAwesome name="star" size={24} color={tintColor} /> :
            <Feather name="star" size={24} color={tintColor} />
          }
          <Text style={{ color: subtitleColor }}>{isFavorited ? "Remove" : "Favorite"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sharePost} style={styles.footerButton}>
          <Feather name="share-2" size={24} color={tintColor} />
          <Text style={{ color: subtitleColor }}>Share</Text>
        </TouchableOpacity>
      </View>
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
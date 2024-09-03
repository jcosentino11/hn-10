import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, useColorScheme, Share, Linking, Button } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useThemeColor } from "@/utils/Colors";
import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '@/components/Header';
import { LoginContext } from '@/components/HackerNewsProvider';
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
  const { url, story, title, id } = useLocalSearchParams();
  const loginContext = useContext(LoginContext);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    loadIsFavorited();
  }, []);

  useFocusEffect(useCallback(() => {
    if (loginContext.isLoggedIn) {
      loadIsFavorited();
    } else {
      setIsFavorited(false);
    }
  }, [loginContext.isLoggedIn]));

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

  const toggleFavorite = useCallback(async () => {
    if (loginContext.isFavoriting) {
      return;
    }
    const postId = searchParamAsString(id);
    if (!postId) {
      return;
    }
    if (loginContext.isLoggedIn) {
      if (isFavorited) {
        setIsFavorited(false);
        loginContext.unfavorite(postId)
          .then(res => {
            if (res) {
              setIsFavorited(false);
            }
          })
          .catch(err => {
            setIsFavorited(true);
          });
      } else {
        setIsFavorited(true);
        loginContext.favorite(postId)
          .then(res => {
            if (res) {
              setIsFavorited(true);
            }
          })
          .catch(err => {
            setIsFavorited(false);
          });
      }
    } else {
      loginContext.showModal(true);
    }
  }, [isFavorited, loginContext.isFavoriting]);
  
  const loadIsFavorited = useCallback(async () => {
    const postId = searchParamAsString(id);
    if (postId) {
      setIsFavorited(await loginContext.checkFavorite(postId));
    }
  }, []);

  const sharePost = async () => {
    try {
      await Share.share({
        message: `${title} - ${url}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const injectedJavaScript = isDarkMode ? darkReaderScript : '';

  const renderContent = () => {
    const emptyContent = (
      <View style={[styles.contentContainer, { borderColor: subtitleColor}]}>
      </View>
    );

    const urlStr = searchParamAsString(url);
    if (!urlStr) {
      return emptyContent;
    }

    if (settingsContext.selectedBrowser == 'In App') {
      return (
        <View style={[styles.contentContainer, {borderColor: subtitleColor}]}>
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
        <View style={[styles.contentContainer, {paddingTop: '60%', borderColor: subtitleColor}]}>
          <Button title="Open in Default Browser" onPress={() => Linking.openURL(urlStr)} />
        </View>
      );
    }
    return emptyContent;
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
  contentContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    borderWidth: 2,
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
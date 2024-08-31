import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, useColorScheme, Dimensions, Share, Modal } from 'react-native';
import { useLocalSearchParams, useNavigation, Link } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useThemeColor } from "@/utils/Colors";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const webViewRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const colorScheme = useColorScheme();
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
    checkLoginStatus()
  }, [navigation]);

  const checkLoginStatus = async () => {
    const status = await AsyncStorage.getItem('isLoggedIn');
    setIsLoggedIn(status === 'true');
  };

  const handleLogin = async () => {
    // Implement login logic here
    await AsyncStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    setShowLoginModal(false);
  };

  const toggleFavorite = () => {
    if (isLoggedIn) {
      setIsFavorited(!isFavorited);
      // Implement favoriting logic here
    } else {
      setShowLoginModal(true);
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
        <TouchableOpacity onPress={() => setShowLoginModal(true)} style={styles.headerIcon}>
          <Feather name={isLoggedIn ? "user-check" : "user"} size={24} color={tintColor} />
        </TouchableOpacity>
        <Link href="/settings" asChild={true}>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="settings" size={24} color={tintColor} />
          </TouchableOpacity>
        </Link>
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
      <Modal
        visible={showLoginModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {isLoggedIn ? 'Account' : 'Login'}
            </Text>
            {isLoggedIn ? (
              <TouchableOpacity onPress={handleLogout} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: tintColor }]}>Log Out</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleLogin} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: tintColor }]}>Log In</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setShowLoginModal(false)} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: tintColor }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  footerButton: {
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
  },
});
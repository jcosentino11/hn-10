import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export default function HackerNewsPageDetail() {
  const { url, story, title } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Story {story}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Hacker News Reader</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
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
    color: '#1C1C1E',
  },
  webview: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    overflow: 'hidden',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  footerText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
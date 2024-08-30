import React, { useEffect } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export default function HackerNewsPageDetail() {
  const { url, story, title } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: `Story ${story}`,
    });
  }, [navigation, story]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <WebView source={{ uri: url }} style={styles.webview} />
      <Text style={styles.title}>Placeholder Footer</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },
  webview: {
    flex: 1,
    height: 600, // Adjust this as needed to fit the content
  },
});
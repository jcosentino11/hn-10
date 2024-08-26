import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, LayoutChangeEvent, ActivityIndicator } from 'react-native';
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";
import { HNClient } from '@/clients/HNClient';

interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
}

interface HackerNewsPageProps {
  numberOfStories: number;
  onDataFetched: () => void;
  client: HNClient;
}

const HackerNewsPage: React.FC<HackerNewsPageProps> = ({ numberOfStories, onDataFetched, client }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [itemHeight, setItemHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedStories = await client.fetchHackerNewsStories(
        numberOfStories
      );
      if (fetchedStories) {
        setStories(fetchedStories);
        onDataFetched();
      }
    } finally {
      setLoading(false);
    }
  }, [client, numberOfStories, onDataFetched]);

  useEffect(() => {
    fetchStories();
  }, [numberOfStories, client, onDataFetched]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setItemHeight(height);
  }, []);

  const calculatedItemHeight = itemHeight ? Math.max(50, itemHeight / numberOfStories) : 50;

  return (
    <View style={[styles.container, { backgroundColor: useThemeColor(scheme, 'offWhite') }]} onLayout={onLayout}>
      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={useThemeColor(scheme, 'black')} />
        </View>
      ) : stories.length > 0 ? (
        stories.map((item) => (
          <TouchableOpacity key={item.objectID} onPress={() => Linking.openURL(item.url)}>
            <View style={[styles.storyContainer, { borderBottomColor: useThemeColor(scheme, 'lightGrey'), height: calculatedItemHeight }]}>
              <Text style={[styles.storyTitle, { color: useThemeColor(scheme, 'black') }]} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.centeredContainer}>
          <Text style={[styles.loadingFailedText, { color: useThemeColor(scheme, 'black') }]}>Loading Failed</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    borderBottomWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingFailedText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HackerNewsPage;

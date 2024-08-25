import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, LayoutChangeEvent } from 'react-native';
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";
import HNClient from '@/clients/HNClient';

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
  const scheme = useColorScheme();

  const fetchStories = async () => {
    const fetchedStories = await client.fetchHackerNewsStories(numberOfStories);
    if (fetchedStories) {
      setStories(fetchedStories);
      onDataFetched();
    }
  };

  useEffect(() => {
    fetchStories();
  }, [numberOfStories, client, onDataFetched]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setItemHeight(height);
  }, []);

  const calculatedItemHeight = itemHeight ? Math.max(50, itemHeight / numberOfStories) : 50;

  return (
    <View style={[styles.container, {backgroundColor: useThemeColor(scheme, 'offWhite')}]} onLayout={onLayout}>
      {(
        stories.map((item) => (
          <TouchableOpacity key={item.objectID} onPress={() => Linking.openURL(item.url)}>
            <View style={[styles.storyContainer, { borderBottomColor: useThemeColor(scheme, 'lightGrey'), height: calculatedItemHeight }]}>
              <Text style={[styles.storyTitle, {color: useThemeColor(scheme, 'black')}]} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  storyInfo: {
    fontSize: 12,
  },
});

export default HackerNewsPage;

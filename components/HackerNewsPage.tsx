import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, LayoutChangeEvent } from 'react-native';
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";

interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
}

interface HackerNewsPageProps {
  numberOfStories: number;
  onDataFetched: () => void;
}

const HackerNewsPage: React.FC<HackerNewsPageProps> = ({ numberOfStories, onDataFetched }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemHeight, setItemHeight] = useState<number | null>(null);

  const fetchHackerNewsStories = async () => {
    try {
      const response = await fetch(`https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${numberOfStories}`);
      const data = await response.json();
      setStories(data.hits);
      onDataFetched();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const scheme = useColorScheme();

  useEffect(() => {
    fetchHackerNewsStories();
  }, [numberOfStories]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setItemHeight(height);
  }, []);

  const calculatedItemHeight = itemHeight ? Math.max(50, itemHeight / numberOfStories) : 50;

  return (
    <View style={[styles.container, {backgroundColor: useThemeColor(scheme, 'offWhite')}]} onLayout={onLayout}>
      {loading ? (
        // TODO remove
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        stories.map((item, index) => (
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

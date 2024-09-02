import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, LayoutChangeEvent, Button } from 'react-native';
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";
import { HNClient } from '@/clients/HNClient';

interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
}

const getHostname = (story: Story) => {
  if (story.url) {
    const { hostname } = new URL(story.url);
    return hostname;
  }
  return "";
};

export interface SelectedStory {
  story: number;
  url: string;
  title: string
}

interface HackerNewsPageProps {
  numberOfStories: number;
  onDataFetched: () => void;
  onStorySelected: (story: SelectedStory) => void;
  client: HNClient;
}

const HackerNewsPage: React.FC<HackerNewsPageProps> = ({ numberOfStories, onDataFetched, onStorySelected, client }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const scheme = useColorScheme();
  const backgroundColor = useThemeColor(scheme, 'background');
  const textColor = useThemeColor(scheme, 'text');
  const borderColor = useThemeColor(scheme, 'border');
  const tintColor = useThemeColor(scheme, 'tint');
  const subtitleColor = useThemeColor(scheme, 'subtitle');
  const cardColor = useThemeColor(scheme, 'card');
  const shadowColor = useThemeColor(scheme, 'shadow');


  const fetchStories = useCallback(async () => {
    const fetchedStories = await client.fetchHackerNewsStories(numberOfStories);
    if (fetchedStories) {
      setStories(fetchedStories);
      onDataFetched();
    }
    setInitialLoadComplete(true);
  }, [client, numberOfStories, onDataFetched]);

  useEffect(() => {
    onRefresh();
  }, [numberOfStories, client, onDataFetched]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchStories();
    } finally {
      setRefreshing(false);
    }
  }, [fetchStories, numberOfStories, client, onDataFetched]);

  const renderItem = ({ item, index }: { item: Story, index: number }) => (
    <TouchableOpacity 
      key={item.objectID} 
      onPress={() => onStorySelected({story:(index + 1), title:item.title, url:item.url})}
      style={[
        styles.storyContainer, 
        { 
          backgroundColor: cardColor,
          borderColor: borderColor,
          shadowColor: shadowColor,
        }
      ]}
    >
      <View style={styles.storyContent}>
        <Text style={[styles.storyNumber, { color: tintColor }]}>{index + 1}.</Text>
        <View style={styles.storyTextContainer}>
          <Text style={[styles.storyTitle, { color: textColor }]} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.storySubtitle, { color: subtitleColor }]}>{getHostname(item)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLoadingFailedItem = () => (
    <View style={[styles.centeredContainer, { backgroundColor: backgroundColor }]}>
      <Text style={[styles.loadingFailedText, { color: textColor }]}>Loading failed. Please try again later.</Text>
      <Button title="Reload" onPress={onRefresh} color={tintColor} />
    </View>
  );

  return (
    <FlatList
      data={stories}
      renderItem={renderItem}
      keyExtractor={(item) => item.objectID}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={initialLoadComplete ? renderLoadingFailedItem : null}
      contentContainerStyle={[styles.listContainer, { backgroundColor: backgroundColor }]}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  storyContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyContent: {
    flexDirection: 'row',
    padding: 15,
  },
  storyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
  },
  storyTextContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storySubtitle: {
    fontSize: 12,
  },
  loadingFailedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default HackerNewsPage;
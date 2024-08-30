import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Linking, LayoutChangeEvent, Button } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const scheme = useColorScheme();

  const fetchStories = useCallback(async () => {
    const fetchedStories = await client.fetchHackerNewsStories(
      numberOfStories
    );
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

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setItemHeight(height);
  }, []);

  const calculatedItemHeight = itemHeight ? Math.max(50, itemHeight / numberOfStories) : 50;

  const renderItem = ({ item, index }: { item: Story, index: number }) => (
    <TouchableOpacity key={item.objectID} onPress={() => Linking.openURL(item.url)}>
      <View style={[styles.storyContainer, { borderBottomColor: useThemeColor(scheme, 'lightGrey'), height: calculatedItemHeight }]}>
        <Text style={[styles.storyNumber, { color: useThemeColor(scheme, 'black') }]}>{index + 1}.</Text>
        <Text style={[styles.storyTitle, { color: useThemeColor(scheme, 'black') }]} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLoadingFailedItem = () => (
    <View style={styles.centeredContainer}>
      <Text style={[styles.loadingFailedText, {paddingTop: '50%'}]}>Loading failed. Please try again later.</Text>
      <Button title="Reload" onPress={onRefresh} />
    </View>
  );

  return (
    <FlatList
      data={stories}
      renderItem={renderItem}
      keyExtractor={(item) => item.objectID}
      onLayout={onLayout}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={initialLoadComplete ? renderLoadingFailedItem : null}
    />
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
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
    borderBottomWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  storyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  loadingFailedText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HackerNewsPage;

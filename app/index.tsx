import React, { useState, useEffect, useMemo, useCallback } from 'react';
import HackerNewsPage, { SelectedStory }  from "@/components/HackerNewsPage";
import { View, Text, StyleSheet } from "react-native";
import { formatDistanceToNow } from 'date-fns';
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";
import { DefaultHNClient } from '@/clients/HNClient';
import { useRouter } from 'expo-router';

export default function Index() {

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const handleDataFetched = useCallback(() => {
    setLastUpdated(new Date());
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setLastUpdated(new Date(lastUpdated));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const router = useRouter();
  const handleStorySelected = useCallback((story: SelectedStory) => {
    router.push(`/detail?url=${encodeURIComponent(story.url)}&story=${story.story}&title=${story.title}`);
  }, []);
  
  const scheme = useColorScheme();
  const client = useMemo(() => new DefaultHNClient(), []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HackerNewsPage numberOfStories={10} onDataFetched={handleDataFetched} onStorySelected={handleStorySelected} client={client} />
      </View>
      <View style={styles.bottomBar}>
        {lastUpdated && (
            <Text style={[styles.bottomBarText, {color: useThemeColor(scheme, "black")}]}>
              {`Last Updated: ${formatDistanceToNow(lastUpdated, { addSuffix: true })}`}
            </Text>
        )}      
      </View>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  bottomBarText: {
    fontSize: 10
  },
});
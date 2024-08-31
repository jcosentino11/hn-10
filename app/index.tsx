import React, { useMemo, useCallback } from 'react';
import HackerNewsPage, { SelectedStory } from "@/components/HackerNewsPage";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";
import { DefaultHNClient } from '@/clients/HNClient';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const handleStorySelected = useCallback((story: SelectedStory) => {
    router.push(`/detail?url=${encodeURIComponent(story.url)}&story=${story.story}&title=${story.title}`);
  }, []);

  const scheme = useColorScheme();
  const client = useMemo(() => new DefaultHNClient(), []);

  const theme = {
    background: useThemeColor(scheme, 'background'),
    text: useThemeColor(scheme, 'text'),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={scheme === 'dark' ? "light-content" : "dark-content"} />
      <View style={styles.content}>
        <HackerNewsPage numberOfStories={10} onDataFetched={() => {}} onStorySelected={handleStorySelected} client={client} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
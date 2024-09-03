import React, { useMemo, useCallback } from 'react';
import HackerNewsPage, { SelectedStory } from "@/components/HackerNewsPage";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";
import { DefaultAlgoliaClient } from '@/clients/AlgoliaClient';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

export default function Index() {
  const router = useRouter();
  const handleStorySelected = useCallback((story: SelectedStory) => {
    router.push(`/detail?url=${encodeURIComponent(story.url)}&story=${story.story}&title=${story.title}&id=${story.id}`);
  }, []);

  const scheme = useColorScheme();
  const client = useMemo(() => new DefaultAlgoliaClient(), []);

  const theme = {
    background: useThemeColor(scheme, 'background'),
    text: useThemeColor(scheme, 'text'),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={scheme === 'dark' ? "light-content" : "dark-content"} />
      <Header 
        title='HN-10' 
        showLoginIcon={true} 
        showOptionsIcon={true} 
        showBackIcon={false} 
        details={undefined} />
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
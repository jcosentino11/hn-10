import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';

interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
}

const HackerNewsPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHackerNewsStories = async () => {
    try {
      const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page');
      const data = await response.json();
      setStories(data.hits);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackerNewsStories();
  }, []);

  const renderItem = ({ item }: { item: Story }) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
      <View style={styles.storyContainer}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.storyInfo}>by {item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.objectID}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  storyContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storyInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default HackerNewsPage;

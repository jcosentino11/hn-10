import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';

interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
}

interface HackerNewsPageProps {
  numberOfStories: number;
}

const HackerNewsPage: React.FC<HackerNewsPageProps> = ({ numberOfStories }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHackerNewsStories = async () => {
    try {
      const response = await fetch(`https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${numberOfStories}`);
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
  }, [numberOfStories]);

  const { height } = Dimensions.get('window');
  const itemHeight = height / numberOfStories;
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        stories.map((item) => (
          <TouchableOpacity key={item.objectID} onPress={() => Linking.openURL(item.url)}>
            <View style={[styles.storyContainer, { height: itemHeight }]}>
              <Text style={styles.storyTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.storyInfo}>by {item.author}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  storyContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyInfo: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
});

export default HackerNewsPage;

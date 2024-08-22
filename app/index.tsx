import React, { useState, useEffect } from 'react';
import HackerNewsPage from "@/components/HackerNewsPage";
import { View, Text, StyleSheet } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { formatDistanceToNow } from 'date-fns';
import { useThemeColor } from "@/utils/Colors";
import { useColorScheme } from "react-native";

export default function Index() {

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const handleDataFetched = () => {
    SplashScreen.hideAsync();
    setLastUpdated(new Date());
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setLastUpdated(new Date(lastUpdated));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastUpdated]);
  const scheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HackerNewsPage numberOfStories={10} onDataFetched={handleDataFetched} />
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
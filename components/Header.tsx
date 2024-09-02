import React, { useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useNavigation, Link } from "expo-router";
import { useThemeColor } from "@/utils/Colors";
import { Feather } from "@expo/vector-icons";
import { LoginContext } from "./LoginProvider";
import LoginModal from "./LoginModal";

type Props = {
    isMainPage: boolean
    details: {
        url: string | undefined;
        story: string | undefined;
        title: string | undefined;
    } | undefined;
};

const Header: React.FC<Props> = (props) => {

  const loginContext = useContext(LoginContext);

  const colorScheme = useColorScheme();
  const textColor = useThemeColor(colorScheme, 'text');
  const borderColor = useThemeColor(colorScheme, 'border');
  const tintColor = useThemeColor(colorScheme, 'tint');
  const cardColor = useThemeColor(colorScheme, 'card');
  const subtitleColor = useThemeColor(colorScheme, 'subtitle');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderBackButton = () =>
    props.isMainPage ? null : (
        <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Feather name="arrow-left" size={24} color={tintColor} />
      </TouchableOpacity>
    );

  const renderStoryNumber = () => {
    if (props.details && props.details.story && props.details.story.trim()) {
      return (
        <Text style={[styles.headerNumber, { color: tintColor }]}>
          {props.details.story}.
        </Text>
      )
    } else {
      return (null);
    }
  }

  const renderTitle = () => {
    if (props.details && props.details.title && props.details.title.trim()) {
      return (
        <Text
            style={[styles.headerTitle, { color: textColor }]}
            numberOfLines={1}
          >
            {props.details.title}
          </Text>
      )
    } else {
      return (null);
    }
  }

  const renderSubtitle = () => {
    if (props.details && props.details.url && props.details.url.trim()) {
      return (
        <Text
          style={[styles.headerSubtitle, { color: subtitleColor }]}
          numberOfLines={1}
        >
          {new URL(props.details.url).hostname}
        </Text>
      )
    } else {
      return (null);
    }
  }

  const renderHeaderText = () =>
    props.isMainPage ? (
        <View style={styles.headerTextContainer}>
            <Text
                style={[styles.headerTitle, { color: textColor }]}
                numberOfLines={1}
            >
                HN-10
            </Text>
        </View>    
    ) : (
      <View style={styles.headerTextContainer}>
        {renderStoryNumber()}
        <View>
          {renderTitle()}
          {renderSubtitle()}
        </View>
      </View>
    );

  return (
    <View>
      <View
        style={[
          styles.header,
          { backgroundColor: cardColor, borderBottomColor: borderColor },
        ]}
      >
        {renderBackButton()}
        {renderHeaderText()}
        <TouchableOpacity
          onPress={() => loginContext.showModal(true)}
          style={styles.headerIcon}
        >
          <Feather
            name={loginContext.isLoggedIn ? "user-check" : "user"}
            size={24}
            color={tintColor}
          />
        </TouchableOpacity>
        <Link href="/settings" asChild={true}>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="settings" size={24} color={tintColor} />
          </TouchableOpacity>
        </Link>
      </View>
      <LoginModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    marginRight: 30,
  },
  headerNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
});

export default Header;

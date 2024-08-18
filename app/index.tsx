import HackerNewsPage from "@/components/HackerNewsPage";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HackerNewsPage />
    </View>
  );
}

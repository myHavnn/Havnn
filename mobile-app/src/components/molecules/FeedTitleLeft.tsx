import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const FeedTitleLeft = () => {
  return (
    <View className="flex flex-row justify-center items-center pl-4">
      <Feather name="book-open" size={38} color="white" />
      <Text className="font-bold text-lg ml-2">Feed Stories</Text>
    </View>
  );
};

export default FeedTitleLeft;

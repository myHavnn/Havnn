import { View, Text } from "react-native";
import ResourceCard from "../components/molecules/ResourceCard";
import { FlashList } from "@shopify/flash-list";
import fonts from "../utils/fonts";
import { linkCommonParams } from "../utils";

const HeartbreakScreen = ({ navigation }) => {
  return (
    <View
      className="flex-1 bg-white"
      style={{
        paddingTop: 0,
      }}
    >
      <Text
        className="text-center text-[15px] mb-1"
        style={{
          fontFamily: fonts.fontBold,
        }}
      >
        Resources
      </Text>
      <FlashList
        data={[
          {
            title: "Music",
            desc: '"Heal your heart with these uplifting playlists—press play and start your journey to feeling whole again."',
            image: require("../../assets/resources/music_1.png"),
            image2: require("../../assets/resources/music_2.png"),
            statusColor: "rgba(251, 176, 171, 1)",
            onPress: () =>
              navigation.navigate("Extra", {
                screen: "Link",
                params: {
                  ...linkCommonParams.music,
                  type: "heartbreak",
                },
              }),
          },
          {
            title: "Videos",
            image: require("../../assets/resources/videos.png"),
            image2: require("../../assets/resources/videos_2.png"),
            desc: '"Feeling lost? These videos are here to guide you through heartbreak and onto a brighter path. Start watching now."',
            statusColor: "rgba(38, 45, 48, 1)",
            onPress: () =>
              navigation.navigate("Extra", {
                screen: "Link",
                params: {
                  ...linkCommonParams.videos,
                  type: "heartbreak",
                },
              }),
          },
          {
            title: "Blogs",
            image: require("../../assets/resources/blogs.png"),
            image2: require("../../assets/resources/blogs_2.png"),
            desc: '"These blogs are your roadmap to turning heartbreak into growth start reading and reclaim your happiness."',
            statusColor: "rgba(236, 194, 115, 1)",
            onPress: () =>
              navigation.navigate("Extra", {
                screen: "Link",
                params: {
                  ...linkCommonParams.blogs,
                  type: "heartbreak",
                },
              }),
          },
        ]}
        renderItem={({ item }) => <ResourceCard {...{ item, navigation }} />}
        estimatedItemSize={70}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      />
    </View>
  );
};

export default HeartbreakScreen;

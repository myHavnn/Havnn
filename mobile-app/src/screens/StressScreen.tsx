import { View, Text } from "react-native";
import ResourceCard from "../components/molecules/ResourceCard";
import { FlashList } from "@shopify/flash-list";
import fonts from "../utils/fonts";
import { linkCommonParams } from "../utils";

const StressScreen = ({ navigation }) => {
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
            desc: '"Unwind your mind—listen to these soothing songs and find your inner calm."',
            image: require("../../assets/resources/music_1.png"),
            image2: require("../../assets/resources/music_2.png"),
            statusColor: "rgba(251, 176, 171, 1)",
            onPress: () =>
              navigation.navigate("Extra", {
                screen: "Link",
                params: {
                  ...linkCommonParams.music,
                  type: "stress",
                },
              }),
          },
          {
            title: "Videos",
            image: require("../../assets/resources/videos.png"),
            image2: require("../../assets/resources/videos_2.png"),
            desc: '"Take a break from the chaos, watch these videos for simple techniques to manage your stress."',
            statusColor: "rgba(38, 45, 48, 1)",
            onPress: () =>
              navigation.navigate("Extra", {
                screen: "Link",
                params: { ...linkCommonParams.videos, type: "stress" },
              }),
          },
          {
            title: "Blogs",
            statusColor: "rgba(236, 194, 115, 1)",
            image: require("../../assets/resources/blogs.png"),
            image2: require("../../assets/resources/blogs_2.png"),
            desc: '"Beat stress with practical tips from these blogs—read now and take back your peace of mind."',
            onPress: () =>
              navigation.navigate("Extra", {
                screen: "Link",
                params: { ...linkCommonParams.blogs, type: "stress" },
              }),
          },
        ]}
        renderItem={({ item }) => <ResourceCard {...{ item, navigation }} />}
        estimatedItemSize={343}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      />
    </View>
  );
};

export default StressScreen;

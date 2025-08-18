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
        padding: 20,
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
            desc: "Music is a potent tool for stress reduction offering emotional release, distraction from worries, and physiological relaxation responses",
            image: require("../../assets/resources/music_1.png"),
            image2: require("../../assets/resources/music_2.png"),
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
            desc: "Engaging with visually pleasing or emotionally uplifting content can help individuals shift their focus away from stressors and promote a sense of calmness and well-being.",
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
            desc: "Reading blogs that focus on relaxation techniques, mindfulness practices, or personal experiences can offer readers practical strategies for managing stress and improving overall well-being.",
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

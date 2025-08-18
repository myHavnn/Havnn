import { FlashList } from "@shopify/flash-list";
import { View, Text, Image } from "react-native";

const Render = ({ item, iItem }) => {
  return <Text>{item?.title}</Text>;
};

const LinksScreen = ({ navigation, route }) => {
  const {
    params: { item },
  } = route;

  return (
    <View className="p-5 flex-1">
      <View
        className="h-[400px] rounded-b-[30px] bg-white"
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        }}
      >
        <Image
          className="rounded-b-[30px] z-10"
          //   resizeMode="stretch"
          source={item?.image2}
          style={{ width: "100%", height: "78%" }}
        />

        <View
          className="rounded-b-[30px] -mt-5 -z-10 justify-center items-center pt-3"
          style={{
            height: "27%",
            backgroundColor: "rgba(126, 228, 155, 0.74)",
          }}
        >
          <View>
            <Text className="text-white font-medium text-lg">
              Find and Listen
              <Text className="text-black"> Your</Text>
            </Text>
            <Text className="font-medium text-lg">
              Favorite Inspiring Musics
            </Text>
          </View>
        </View>
      </View>

      <FlashList
        ListHeaderComponent={
          <Text className="mt-5 font-bold text-lg">{item?.title} links</Text>
        }
        data={[{}]}
        renderItem={({ item: iItem }) => <Render item={item} iItem={iItem} />}
        estimatedItemSize={100}
      />
    </View>
  );
};

export default LinksScreen;

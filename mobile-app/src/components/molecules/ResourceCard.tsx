import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import fonts from "../../utils/fonts";

const ResourceCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={item?.onPress}
      className="h-[400px] rounded-2xl w-full overflow-hidden mb-5 bg-white"
      style={{}}
    >
      <View className="bg-white h-[70%] overflow-hidden w-full">
        <ImageBackground
          // className="rounded-b-xl"
          resizeMode="cover"
          source={item?.image}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View
        className="w-full h-[30%] justify-center px-5"
        style={{
          backgroundColor: "rgba(126, 228, 203, 1)",
        }}
      >
        <Text
          className="font-bold text-[20px]"
          style={{
            fontFamily: fonts.fontExtraBold,
          }}
        >
          {item?.title}
        </Text>
        <Text
          className="text-[13px] border-green-500"
          style={{
            fontFamily: fonts.fontRegular,
          }}
        >
          {item?.desc}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ResourceCard;

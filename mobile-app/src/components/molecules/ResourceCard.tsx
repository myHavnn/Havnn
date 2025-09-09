import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import fonts from "../../utils/fonts";

interface ResourceCardProps {
  item: {
    title: string;
    desc: string;
    image: any;
    onPress?: () => void;
    backgroundColor?: string;
    statusColor?: string;
    hasOverlay?: boolean;
  };
  navigation?: any;
}

const ResourceCard = ({ item, navigation }: ResourceCardProps) => {
  return (
    <View className="p-4 py-0 my-2">
      <TouchableOpacity
        onPress={item?.onPress}
        className="rounded-2xl w-full mb-5"
        style={{
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 30, // Increase height for bottom shadow only
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Header with title and status indicator */}
        <View className="flex-row justify-between items-center px-6 pt-6 pb-4 rounded-t-2xl overflow-hidden">
          <Text
            className="text-black text-2xl font-bold"
            style={{
              fontFamily: fonts.fontExtraBold,
            }}
          >
            {item?.title}
          </Text>
          <View
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: item?.statusColor,
            }}
          />
        </View>

        {/* Main image section */}
        <View className="px-6 pb-4">
          <View className="rounded-xl overflow-hidden" style={{ height: 200 }}>
            <ImageBackground
              resizeMode="cover"
              source={item?.image}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Optional overlay for better text readability */}
              {item?.hasOverlay && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
              )}
            </ImageBackground>
          </View>
        </View>

        {/* Description and arrow section */}
        <View className="flex-row justify-between items-center px-6 pb-6">
          <View className="flex-1 pr-4">
            <Text
              className="text-black text-base leading-5"
              style={{
                fontFamily: fonts.fontRegular,
              }}
            >
              {item?.desc}
            </Text>
          </View>
          <TouchableOpacity
            onPress={item?.onPress}
            className="w-8 h-8 bg-black rounded-lg justify-center items-center"
          >
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ResourceCard;

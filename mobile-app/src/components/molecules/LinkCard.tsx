import { Image, Linking, Pressable, Text, View } from "react-native";
import fonts from "../../utils/fonts";

const LinkCard = ({ title, link, imageURL }) => {
  return (
    <Pressable
      className="w-full rounded-2xl h-[87px] p-2 mb-3"
      onPress={() => {
        Linking.openURL(link);
      }}
      style={{
        backgroundColor: "rgba(126, 228, 203, 0.25)",
      }}
    >
      <Pressable
        className="flex flex-row items-center"
        onPress={() => {
          Linking.openURL(link);
        }}
      >
        <Image
          className="w-[90px] h-[72px] rounded-2xl overflow-hidden mr-2"
          resizeMode="cover"
          source={{ uri: imageURL }}
        />
        <Pressable
          className="h-full justify-center w-[95%]"
          onPress={() => {
            Linking.openURL(link);
          }}
        >
          <Text
            numberOfLines={2}
            className="text-[14px] w-[75%]"
            style={{
              fontFamily: fonts.fontBold,
            }}
          >
            {title}
          </Text>
          <Pressable
            onPress={() => {
              Linking.openURL(link);
            }}
            style={{
              width: "95%",
            }}
          >
            <Text
              numberOfLines={2}
              className="text-[11px] mt-1 w-[80%]"
              style={{
                color: "rgba(0, 0, 0, 0.7)",
              }}
            >
              {link}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

export default LinkCard;

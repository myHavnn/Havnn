import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import fonts from "../utils/fonts";
import { FlashList } from "@shopify/flash-list";
import LinkCard from "../components/molecules/LinkCard";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../config/firebase";

const LinkScreen = ({ route, navigation }) => {
  const dimensions = Dimensions.get("screen");
  const { params } = route;
  const { type, category, source, header1, header2, linkImage } = params;

  const [categoryData = [], categoryDataLoading] = useCollectionData(
    firestore().collection("links").doc(type).collection(category),
  );

  if (categoryDataLoading) {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <ActivityIndicator color={"blue"} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView className="flex-1 w-full">
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexGrow: 1,
        }}
        style={{}}
        scrollEnabled
        keyboardShouldPersistTaps="always"
      >
        <View
          className="w-full h-[238px] rounded-[30px] bg-appMain justify-center p-5 relative"
          style={{}}
        >
          <Text
            className="text-[24px] text-white w-1/3"
            style={{ fontFamily: fonts.fontBold }}
          >
            {header1}
          </Text>
          <View className="">
            <Text
              className="text-[24px] w-1/2"
              style={{ fontFamily: fonts.fontBold }}
            >
              {header2}
            </Text>
            <ImageBackground
              className="w-[150px] h-[150px] absolute -bottom-[30px] -right-[0px]"
              resizeMode="cover"
              source={source}
            />
          </View>
        </View>

        <FlashList
          ListEmptyComponent={
            <View
              className="flex-1 justify-center items-center"
              // style={{ height: dimensions.height - 200 }}
            >
              <Text
                className="text-[16px] text-center"
                style={{
                  fontFamily: fonts.fontBold,
                }}
              >
                No links
              </Text>
            </View>
          }
          data={categoryData}
          renderItem={({ item }) => {
            return (
              <LinkCard
                {...{
                  ...item,
                  navigation,
                }}
              />
            );
          }}
          estimatedItemSize={99}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 60,
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LinkScreen;

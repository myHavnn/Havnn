import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import fonts from "../utils/fonts";
import { GetStartedData } from "../models";
import { useApp } from "../context/AppContext";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore, getCurrentUser, newAuth } from "../config/firebase";
import { useRef } from "react";
import { signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const RenderItem = ({ item }: { item: GetStartedData }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        item?.onPress && item?.onPress(navigation);
      }}
      className="h-[280px] mr-3 w-[188px] bg-white rounded-2xl"
      style={{ backgroundColor: "rgba(126, 228, 203, 1)" }}
    >
      <View
        className="h-[58%] w-full overflow-hidden justify-center items-center rounded-2xl"
        style={{ backgroundColor: item?.bgColor }}
      >
        <Image
          resizeMode="contain"
          className="items-end w-full"
          source={item?.source}
        />
      </View>
      <View className="p-3 justify-between h-[42%]">
        <View>
          <Text
            className="text-black text-[16px]"
            style={{ fontFamily: fonts.fontBold }}
          >
            {item.title}
          </Text>
          <Text
            className="text-[12px] w-[90%]"
            style={{ fontFamily: fonts.fontRegular }}
          >
            {item.text}
          </Text>
        </View>
        <View className="bg-white rounded-2xl w-[90px] p-1 mt-1">
          <Text
            className="text-[12px] text-center"
            style={{ fontFamily: fonts.fontRegular }}
          >
            View more
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DATA = ({
  changeFeedSelected,
}: {
  changeFeedSelected: (selected: string) => void;
}) => [
  {
    title: "Feed",
    text: "Check the post and update that others share on the main feed page.",
    icon: <Feather name="book-open" size={60} color="white" />,
    bgColor: "rgba(126, 228, 203, 1)",
    source: require("../../assets/resources/feed.png"),
    onPress: (navigation: NavigationProp<ReactNavigation.RootParamList>) => {
      changeFeedSelected("Most Commented");
      navigation.navigate("Main", { screen: "Feed" });
    },
  },
  {
    title: "Stressed",
    text: "Stress among youths is a growing concern.",
    icon: (
      <MaterialCommunityIcons name="human-handsup" size={60} color="white" />
    ),
    bgColor: "rgba(126, 228, 203, 1)",
    source: require("../../assets/resources/stressed.png"),
    onPress: (navigation: NavigationProp<ReactNavigation.RootParamList>) =>
      navigation.navigate("Main", { screen: "Stress" }),
  },
  {
    title: "Heartbreak",
    text: "Check the post and update that others share on the main feed page.",
    icon: <Feather name="book-open" size={60} color="white" />,
    bgColor: "rgba(126, 228, 203, 1)",
    source: require("../../assets/resources/feed.png"),
    onPress: (navigation: NavigationProp<ReactNavigation.RootParamList>) =>
      navigation.navigate("Main", { screen: "Heartbreak" }),
  },
  {
    title: "Reproductive health",
    text: "Stress among youths is a growing concern.",
    icon: (
      <MaterialCommunityIcons name="human-handsup" size={60} color="white" />
    ),
    bgColor: "rgba(126, 228, 203, 1)",
    source: require("../../assets/resources/stressed.png"),
    onPress: (navigation: NavigationProp<ReactNavigation.RootParamList>) =>
      navigation.navigate("Main", { screen: "Reproductive" }),
  },
];
const GetStarted = ({ navigation }) => {
  const { changeFeedSelected } = useApp();
  const currentUser = getCurrentUser();
  const [user] = useDocumentData(
    firestore().collection("users").doc(currentUser.uid),
  );
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView ref={scrollViewRef} className="flex-1 p-5">
      <View className="w-full flex flex-row justify-between items-center mb-4">
        <Text className="" style={{ fontFamily: fonts.fontRegular }}>
          {`Hello, ${user?.displayName ? `@${user?.displayName}` : "there"} 👋`}
        </Text>
        <View className="flex-row items-center justify-center gap-x-2">
          <Pressable
            className="relative"
            onPress={() => {
              navigation.navigate("Extra", { screen: "Account" });
            }}
          >
            <MaterialIcons name="account-circle" size={30} color="black" />
          </Pressable>
          {/* <Pressable
            className="relative"
            onPress={() => {
              firestore()
                .collection("users")
                .doc(user.uid)
                .update({ hasNewNotification: false });
              navigation.navigate("Extra", { screen: "Notifications" });
            }}
          >
            <MaterialCommunityIcons name="bell" size={30} color="black" />
            {user?.hasNewNotification && (
              <View className="w-4 h-4 bg-white rounded-full p-1 absolute right-0 top-0 justify-center items-center">
                <View className="bg-appMain rounded-full w-2 h-2" />
              </View>
            )}
          </Pressable> */}
          {/* <Pressable
            className="mr-2"
            onPress={async () => {
              try {
                await signOut(newAuth);
                await GoogleSignin.signOut();
              } catch (error) {
                console.log(error);
              }
              navigation.reset({
                index: 0,
                routes: [{ name: "Onboarding" }],
              });
            }}
          >
            <MaterialCommunityIcons name="logout" size={30} color="red" />
          </Pressable> */}
        </View>
      </View>

      <View className="w-full mb-5 ">
        <View
          className="rounded-xl h-[346px] w-full p-5"
          style={{ backgroundColor: "rgba(126, 228, 203, 1)" }}
        >
          <Text
            className="text-[28px] w-[55%] mt-3"
            style={{ fontFamily: fonts.fontExtraBold }}
          >
            Share your thoughts on how you feel
          </Text>

          <View className="flex flex-row justify-between items-center w-full -mt-6">
            <TouchableOpacity
              className="bg-white rounded-[20px] w-[141px] h-[40px] flex flex-row items-center justify-center p-1 mt-1"
              onPress={() => {
                // Scroll to bottom of the ScrollView
                scrollViewRef?.current?.scrollToEnd({ animated: true });
              }}
            >
              <Text
                className="text-[15px]"
                style={{
                  fontFamily: fonts.fontRegular,
                }}
              >
                Explore below
              </Text>
            </TouchableOpacity>
            <Image
              className="w-[131.06px] h-[172.5px]"
              source={require("../../assets/resources/asking-question.png")}
            />
          </View>
        </View>
      </View>

      <FlashList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={DATA({ changeFeedSelected })}
        renderItem={({ item }) => <RenderItem {...{ item }} />}
        estimatedItemSize={187}
      />
    </ScrollView>
  );
};

export default GetStarted;

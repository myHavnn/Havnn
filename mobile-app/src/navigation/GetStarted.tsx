import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
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
import {
  firestore,
  getCurrentUser,
  newAuth,
  newFirestore,
} from "../config/firebase";
import { useRef, useState, useEffect } from "react";
import { signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { collection, doc, setDoc } from "@react-native-firebase/firestore";

// Reusable Loading Spinner Component
const LoadingSpinner = ({
  size = 141,
  color = "rgba(126, 228, 203, 1)",
  onButtonPress,
}: {
  size?: number;
  color?: string;
  onButtonPress: (item: string) => void;
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();

    setTimeout(() => {
      onButtonPress("done");
    }, 2000);
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="justify-center items-center">
      <Animated.View
        style={{
          transform: [{ rotate: spin }],
          width: size,
          height: size,
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 15,
            borderColor: "rgba(126, 228, 203, 0.25)",
            borderTopColor: color,
            borderRightColor: color,
          }}
        />
      </Animated.View>
    </View>
  );
};

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

// Reusable Welcome Card Component
const WelcomeCard = ({
  title,
  onButtonPress,
  render,
}: {
  title: string;
  onButtonPress: (item: string) => void;
  render: ({
    title,
    onButtonPress,
  }: {
    title: string;
    onButtonPress: (item: string) => void;
  }) => React.ReactNode;
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const imageAnimatedStyle = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  };

  return (
    <ScrollView className="relative flex-1">
      <Image
        source={require("../../assets/onboarding/6.png")}
        style={imageAnimatedStyle}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(56, 107, 94, 0.85)",
        }}
      >
        <View className="flex justify-around items-center h-full">
          {render({
            title,
            onButtonPress,
          })}
          <Text
            className="text-[15px] text-white text-center"
            style={{ fontFamily: fonts.fontRegular }}
          >
            No one will see this information
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const GetStarted = ({ navigation }) => {
  const { changeFeedSelected } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(1);

  const currentUser = getCurrentUser();
  const [user] = useDocumentData(
    firestore().collection("users").doc(currentUser.uid),
  );
  const isNewUser = user?.isNewUser;

  if (!user) return null;

  if (isNewUser) {
    return (
      <>
        {step === 1 && (
          <WelcomeCard
            {...{
              title: "To which gender do you most identify",
              onButtonPress: async (gender: string) => {
                await setDoc(
                  doc(collection(newFirestore, "users"), currentUser.uid),
                  {
                    gender,
                  },
                  { merge: true },
                );
                setStep(2);
              },
              render: ({ title, onButtonPress }) => {
                return (
                  <View className="w-11/12">
                    <Text
                      className="text-[28px] mt-3 text-white text-center"
                      style={{ fontFamily: fonts.fontExtraBold }}
                    >
                      {title}
                    </Text>

                    <View className="mt-20 flex flex-row justify-around items-center">
                      <TouchableOpacity
                        onPress={() => {
                          onButtonPress("Female");
                        }}
                      >
                        <View className="w-[111px] h-[113px] bg-appMain50 border-appMain border-4 rounded-2xl justify-center items-center">
                          <Text
                            className="text-[25px] text-white"
                            style={{ fontFamily: fonts.fontBold }}
                          >
                            Female
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          onButtonPress("Male");
                        }}
                      >
                        <View className="w-[111px] h-[113px] bg-appMain50 border-appMain border-4 rounded-2xl justify-center items-center">
                          <Text
                            className="text-[25px] text-white"
                            style={{ fontFamily: fonts.fontBold }}
                          >
                            Male
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              },
            }}
          />
        )}

        {step === 2 && (
          <WelcomeCard
            {...{
              title: "What’s your age?",
              onButtonPress: async (age: string) => {
                if (age) {
                  await setDoc(
                    doc(collection(newFirestore, "users"), currentUser.uid),
                    {
                      age,
                    },
                    { merge: true },
                  );
                  setStep(3);
                }
              },
              render: ({ title, onButtonPress }) => {
                const inputRef = useRef(null);
                return (
                  <View className="w-11/12">
                    <Text
                      className="text-[28px] mt-3 text-white text-center"
                      style={{ fontFamily: fonts.fontExtraBold }}
                    >
                      {title}
                    </Text>

                    <View className="mt-10 flex flex-row justify-around items-center">
                      <TextInput
                        ref={inputRef}
                        keyboardType="numeric"
                        className="text-white text-center text-[40px] w-11/12 bg-appMain50 border-appMain border-4 rounded-2xl justify-center items-center h-[75px]"
                        style={{
                          fontFamily: fonts.fontBold,
                        }}
                        onChangeText={(e) => (inputRef.current.value = e)} // Store the value in the ref
                      />
                    </View>
                    <Text
                      className="text-[18px] text-white text-center mt-16"
                      style={{ fontFamily: fonts.fontSemiBold }}
                    >
                      I confirm that my age is correct
                    </Text>

                    <TouchableOpacity
                      className="flex justify-center items-center w-full mt-4"
                      onPress={() => {
                        onButtonPress(inputRef?.current?.value);
                      }}
                    >
                      <View className="w-7/12 h-[36px] bg-transparent border-appMain border-2 rounded-2xl justify-center items-center">
                        <Text
                          className="text-white text-[15px]"
                          style={{ fontFamily: fonts.fontSemiBold }}
                        >
                          Next
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              },
            }}
          />
        )}

        {step === 3 && (
          <WelcomeCard
            {...{
              title: "Welcome to Havnn",
              onButtonPress: async () => {
                await setDoc(
                  doc(collection(newFirestore, "users"), currentUser.uid),
                  {
                    isNewUser: false,
                  },
                  { merge: true },
                );
                setStep(1);
              },
              render: ({ title, onButtonPress }) => {
                return (
                  <View className="w-11/12">
                    <Text
                      className="text-[28px] mt-3 text-white text-center"
                      style={{ fontFamily: fonts.fontExtraBold }}
                    >
                      {title}
                    </Text>

                    <View className="mt-28 flex flex-row justify-around items-center">
                      <LoadingSpinner {...{ onButtonPress }} />
                    </View>
                  </View>
                );
              },
            }}
          />
        )}
      </>
    );
  }

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

import { createStackNavigator } from "@react-navigation/stack";
import Main from "./Main";
import Extra from "./Extra";
import Onboarding from "./Onboarding";
import { useEffect, useState } from "react";

import { Image, View } from "react-native";
import { RootStackParamList } from "../models";
import GetStarted from "./GetStarted";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { getNotificationToken, handleNotificationRouting } from "../utils";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { firestore, newAuth } from "../config/firebase";
import { onAuthStateChanged } from "@react-native-firebase/auth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Stack = createStackNavigator<RootStackParamList>();

const Loading = () => {
  return (
    <View className="items-center justify-center flex-1">
      <Image source={require("../../assets/splash.png")} />
    </View>
  );
};

export default function AppStack() {
  const navigation = useNavigation();
  const [skipOnBoardingScreen, setSkipOnBoardingScreen] = useState<
    boolean | null
  >(null);

  const [checkNotification, setCheckNotification] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(newAuth, async (authUser) => {
      try {
        if (authUser) {
          const token = await getNotificationToken();
          const expoToken = (!__DEV__ && token) || null;
          await firestore()
            .collection("users")
            .doc(authUser.uid)
            .set(
              { appLastOpenDate: firestore.Timestamp.now(), expoToken },
              { merge: true },
            );
          setSkipOnBoardingScreen(true);
          navigation.navigate("Get Started");
          setCheckNotification(true);
        } else {
          setSkipOnBoardingScreen(false);
          setCheckNotification(true);
        }
      } catch (error) {
        console.log(error);
      }
    });
    return unsubscribeAuth;
  }, [navigation]);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const content = lastNotificationResponse?.notification?.request?.content;
    if (
      checkNotification &&
      lastNotificationResponse?.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      if (content?.data) {
        const item = content?.data || {};
        handleNotificationRouting({ item, navigation });
      }
    }
  }, [checkNotification, lastNotificationResponse, navigation]);

  useEffect(() => {
    async function registerUser() {
      await requestTrackingPermissionsAsync();
    }
    if (skipOnBoardingScreen) {
      registerUser();
    }
  }, [skipOnBoardingScreen]);

  if (skipOnBoardingScreen === null) {
    return <Loading />;
  }

  return (
    <Stack.Navigator
      initialRouteName={skipOnBoardingScreen ? "Get Started" : "Onboarding"}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { flex: 1, backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={skipOnBoardingScreen === null ? Loading : Onboarding}
        options={() => ({ animationTypeForReplace: "pop" })}
      />
      <Stack.Screen name="Get Started" component={GetStarted} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Extra" component={Extra} />
    </Stack.Navigator>
  );
}

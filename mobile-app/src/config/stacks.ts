import { TScreenProps, TStacks } from "../models";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import FeedTitleRight from "../components/molecules/FeedTitleRight";
import fonts from "../utils/fonts";

export const MainStack: TScreenProps[] = [
  {
    route: "Feed",
    label: "Feed",
    iconName: "book-open",
    icon: Feather,
    // headerLeft: FeedTitleLeft,
    headerRight: FeedTitleRight,
    headerStyle: {
      backgroundColor: "white",
      borderBottomColor: "transparent",
      shadowColor: "transparent",
      borderBottomWidth: 0,
      elevation: 0,
      // backgroundColor: "rgba(126, 228, 155, 0.74)",
    },
    title: "",
    headerTitleStyle: {
      color: "white",
    },
  },
  {
    route: "Stress",
    label: "Stress",
    iconName: "human-handsup",
    icon: MaterialCommunityIcons,
    title: "Stressed",
    headerTitleStyle: {
      fontFamily: fonts.fontExtraBold,
      fontSize: 25,
      textAlign: "center",
    },
  },
  {
    route: "Heartbreak",
    label: "Heartbreak",
    iconName: "heart-broken",
    icon: FontAwesome5,
    title: "Heartbreak",
    headerTitleStyle: {
      fontFamily: fonts.fontExtraBold,
      fontSize: 25,
      textAlign: "center",
    },
  },
  {
    route: "Reproductive",
    label: "Reproductive",
    iconName: "male-female",
    icon: Ionicons,
    title: "Reproductive Health",
    headerTitleStyle: {
      fontFamily: fonts.fontExtraBold,
      fontSize: 25,
      textAlign: "center",
    },
  },
  {
    route: "Book",
    label: "Book",
    iconName: "chatbox-ellipses-outline",
    icon: Ionicons,
    headerShown: false,
  },
];

export const Screens: TStacks = {
  MainStack,
};

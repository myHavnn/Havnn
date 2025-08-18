import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import screens from "../screens";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import {
  NavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";

export interface TabButtonProps extends BottomTabBarButtonProps {
  screen: TScreenProps;
}

export type TRoute = keyof typeof screens;
export type TScreenProps = {
  route: TRoute;
  label: TRoute;
  iconName:
    | React.ComponentProps<typeof AntDesign>["name"]
    | React.ComponentProps<typeof Feather>["name"]
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof Ionicons>["name"];
  icon:
    | typeof AntDesign
    | typeof Feather
    | typeof MaterialCommunityIcons
    | typeof Ionicons;
  headerRight?: () => React.JSX.Element;
  headerLeft?: () => React.JSX.Element;
  title?: string;
  headerStyle?: unknown;
  headerTitleStyle?: unknown;
  headerShown?: boolean;
};

export type TStacks = { [key: string]: TScreenProps[] };

type IconNameMap = {
  AntDesign: keyof typeof AntDesign.glyphMap;
  Entypo: keyof typeof Entypo.glyphMap;
  EvilIcons: keyof typeof EvilIcons.glyphMap;
  Feather: keyof typeof Feather.glyphMap;
  FontAwesome: keyof typeof FontAwesome.glyphMap;
  FontAwesome5: keyof typeof FontAwesome5.glyphMap;
  Fontisto: keyof typeof Fontisto.glyphMap;
  Foundation: keyof typeof Foundation.glyphMap;
  Ionicons: keyof typeof Ionicons.glyphMap;
  MaterialCommunityIcons: keyof typeof MaterialCommunityIcons.glyphMap;
  MaterialIcons: keyof typeof MaterialIcons.glyphMap;
  SimpleLineIcons: keyof typeof SimpleLineIcons.glyphMap;
  Zocial: keyof typeof Zocial.glyphMap;
  Octicons: keyof typeof Octicons.glyphMap;
  FontAwesome6: keyof typeof FontAwesome6.glyphMap;
};

export type MyIconProps<F extends keyof typeof IconComponentMap> = {
  familyIcon: F;
  iconName: IconNameMap[F];
  size: number;
};

const IconComponentMap = {
  AntDesign: AntDesign,
  Entypo: Entypo,
  EvilIcons: EvilIcons,
  Feather: Feather,
  FontAwesome: FontAwesome,
  FontAwesome5: FontAwesome5,
  Fontisto: Fontisto,
  Foundation: Foundation,
  Ionicons: Ionicons,
  MaterialCommunityIcons: MaterialCommunityIcons,
  MaterialIcons: MaterialIcons,
  SimpleLineIcons: SimpleLineIcons,
  Zocial: Zocial,
};

export type RootStackParamList = {
  Onboarding: undefined;
  "Get Started": undefined;
  Main: NavigatorScreenParams<MainStackParamList>;
  Extra: undefined;
};

export type MainStackParamList = {
  Feed: undefined;
  Stress: undefined;
  Heartbreak: undefined;
  Reproductive: undefined;
};

export interface GetStartedData {
  title: string;
  text: string;
  icon: JSX.Element;
  bgColor: string;
  source: ReturnType<typeof require>;
  onPress: (navigation: NavigationProp<ReactNavigation.RootParamList>) => void;
}

import "react-native-gesture-handler";
import { ImageBackground, LogBox, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import Routes from "./src/navigation/routes";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import {
  Nunito_200ExtraLight,
  Nunito_200ExtraLight_Italic,
  Nunito_300Light,
  Nunito_300Light_Italic,
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_600SemiBold,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold,
  Nunito_700Bold_Italic,
  Nunito_800ExtraBold,
  Nunito_800ExtraBold_Italic,
  Nunito_900Black,
  Nunito_900Black_Italic,
} from "@expo-google-fonts/nunito";
import { AppProvider } from "./src/context/AppContext";
import Toast from "react-native-toast-message";

LogBox.ignoreLogs([
  "Setting a timer",
  "VirtualizedLists",
  "Constants.installationId",
  "Error: No native splash screen registered for given view controller.",
  "[use-document] warning: Your document,",
  // "Exception",
  // "currentlyFocusedField",
  "Looks like you're passing an inline function for 'component' prop for the screen 'Tradie Account",
  "It appears that you are using old version of react-navigation library.",
  "SentryError: Native is disabled",
  "No native splash screen registered for given view controller.",
  "ReactNavigationV5Instrumentation] Instrumentation already exists, but register has been called again, doing nothing",
  "EventEmitter.removeListener",
  "Sending `onAnimatedValueUpdate` with no listeners registered",
]);

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          Nunito_200ExtraLight,
          Nunito_200ExtraLight_Italic,
          Nunito_300Light,
          Nunito_300Light_Italic,
          Nunito_400Regular,
          Nunito_400Regular_Italic,
          Nunito_600SemiBold,
          Nunito_600SemiBold_Italic,
          Nunito_700Bold,
          Nunito_700Bold_Italic,
          Nunito_800ExtraBold,
          Nunito_800ExtraBold_Italic,
          Nunito_900Black,
          Nunito_900Black_Italic,
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    })();
  }, [setLoadingComplete]);

  const onLayoutRootView = useCallback(async () => {
    if (isLoadingComplete) {
      await SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  if (!isLoadingComplete) {
    return (
      <ImageBackground
        source={require("./assets/splash.png")}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaView
        style={{
          paddingTop: Constants.statusBarHeight,
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <AppProvider>
          <Routes />
          <Toast />
        </AppProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

import { View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore, getCurrentUser, newAuth } from "../../config/firebase";
import { signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const FeedTitleRight = () => {
  const navigation = useNavigation();
  const currentUser = getCurrentUser();
  const [user] = useDocumentData(
    firestore().collection("users").doc(currentUser.uid),
  );

  return (
    <View className="flex-row items-center justify-center gap-x-2">
      <Pressable
        className="relative mr-4"
        onPress={async () => {
          await firestore().collection("users").doc(user.uid).update({
            hasNewNotification: false,
          });
          navigation.navigate("Extra", { screen: "Notifications" });
        }}
      >
        <MaterialCommunityIcons name="bell" size={20} color="black" />
        {user?.hasNewNotification && (
          <View className="w-4 h-4 bg-white rounded-full p-1 absolute right-0 top-0 justify-center items-center">
            <View className="bg-appMain rounded-full w-2 h-2" />
          </View>
        )}
      </Pressable>
      <Pressable
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
        <MaterialCommunityIcons name="logout" size={20} color="red" />
      </Pressable>
    </View>
  );
};

export default FeedTitleRight;

import { createStackNavigator } from "@react-navigation/stack";
import screens from "../screens";
import fonts from "../utils/fonts";

const Stack = createStackNavigator();

const Extra = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        gestureEnabled: true,
        headerStyle: {
          borderBottomWidth: 0,
        },
      })}
    >
      <Stack.Screen
        name="New Story"
        component={screens.NewStory}
        options={() => {
          return {
            title: "",
            // title: "New post",
            headerBackTitleVisible: false,
          };
        }}
      />
      <Stack.Screen
        name="Comments"
        component={screens.Comments}
        options={() => {
          return {
            title: "Comments",
            headerBackTitleVisible: false,
          };
        }}
      />
      <Stack.Screen
        name="Links"
        component={screens.Links}
        options={() => {
          return {
            headerShown: false,
          };
        }}
      />
      <Stack.Screen
        name="CommentsReply"
        component={screens.CommentReply}
        options={() => {
          return {
            title: "Reply to Comment",
            headerBackTitleVisible: false,
          };
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={screens.Notifications}
        options={() => {
          return {
            headerBackTitleVisible: false,
          };
        }}
      />

      <Stack.Screen
        name="Link"
        component={screens.Link}
        options={({ route }) => {
          return {
            headerBackTitleVisible: false,
            title: route?.params?.title,
            headerTitleStyle: {
              fontFamily: fonts.fontBold,
              textAlign: "center",
            },
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default Extra;

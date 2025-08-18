import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStack } from "../config/stacks";
import screens from "../screens";
import { StyleSheet } from "react-native";
import TabButton from "../components/molecules/TabButton";

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
      }}
    >
      {MainStack.map((screen) => {
        return (
          <Tab.Screen
            key={screen.label}
            name={screen.route}
            component={screens[screen.label]}
            options={{
              headerShown: true,
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} {...{ screen }} />,
              ...screen,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    position: "absolute",
    bottom: 25,
    right: 16,
    left: 16,
    borderRadius: 16,
    marginHorizontal: 15,
    backgroundColor: "#f7f7f7",
  },
});

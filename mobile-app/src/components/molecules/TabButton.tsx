import { View, TouchableOpacity, StyleSheet } from "react-native";
import { TabButtonProps } from "../../models";

const TabButton = ({ screen, onPress, accessibilityState }: TabButtonProps) => {
  const Icon = screen.icon;
  const focused = accessibilityState?.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      className="flex-1 justify-center items-center"
    >
      <View
        className={"justify-center items-center rounded-[25px]"}
        style={StyleSheet.absoluteFillObject}
      />
      <Icon
        name={screen.iconName}
        size={focused ? 25 : 20}
        color={focused ? "green" : "#000"}
      />
    </TouchableOpacity>
  );
};

export default TabButton;

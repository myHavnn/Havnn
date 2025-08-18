import { memo } from "react";
import { View } from "react-native";
import Selector, { Categories } from "../molecules/EmojiSelectorModule";

const EmojiSelector = ({ onEmojiSelected, className }) => {
  return (
    <View
      className={`${className} absolute bg-gray-100 rounded border border-gray-300 z-10 p-1`}
      // className="w-48 h-32 absolute bg-gray-100 rounded bottom-[-25px] left-[25px] p-1 overflow-y-scroll border border-gray-300 z-50"
    >
      <Selector
        showTabs={true}
        showSearchBar={false}
        showHistory={true}
        showSectionTitles={false}
        category={Categories.all}
        onEmojiSelected={onEmojiSelected}
        theme="rgb(126, 228, 203)"
      />
    </View>
  );
};

export default memo(EmojiSelector);

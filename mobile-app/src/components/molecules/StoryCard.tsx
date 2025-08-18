import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { firestore, getCurrentUser } from "../../config/firebase";
import EmojiSelector from "../organisms/EmojiSelector";
import { getCount } from "../../utils";
import fonts from "../../utils/fonts";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ThumbsUp from "../../../assets/blue_thumbsup.svg";
import RedLove from "../../../assets/red_love.svg";
import { formatDistance } from "date-fns";

const StoryCard = ({
  item,
  backgroundColor,
  onEmojiSelected,
  emojiSelectorId,
  setEmojiSelectorId,
}) => {
  const { post, displayName } = item;
  const navigation = useNavigation();

  const [newRun, setNewRun] = useState(new Date());
  const [counts, setCounts] = useState({
    comments: 0,
    likes: 0,
  });
  const currentUser = getCurrentUser();

  const [allLikes] = useCollectionData(
    firestore()
      .collection("feed")
      .doc(item?.id)
      .collection("likes")
      .orderBy("timestamp", "desc"),
    { initialValue: [] },
  );

  useEffect(() => {
    (async () => {
      await Promise.all([
        getCount(
          firestore().collection("feed").doc(item?.id).collection("comments"),
          "comments",
          setCounts,
        ),
        // getCount(
        //   firestore().collection("feed").doc(item?.id).collection("likes"),
        //   "likes",
        //   setCounts,
        // ),
      ]);
    })();
  }, [item, newRun]);

  const getUserLiked = allLikes?.find((l) => l.uid === currentUser.uid)?.emoji;

  return (
    <TouchableOpacity
      className="p-4 rounded-xl mb-3"
      style={{
        backgroundColor,
        borderWidth: 2,
        borderColor: "rgba(126, 228, 203, 0.25)",
      }}
      onPress={() => {
        navigation.navigate("Extra", {
          screen: "Comments",
          params: {
            item,
          },
        });
        setEmojiSelectorId(null);
      }}
    >
      <View className="rounded text-black p-1 flex flex-row justify-start items-center">
        <View className="flex flex-row justify-start items-center">
          <View className="flex flex-row justify-start items-center">
            <FontAwesome5 name="user-alt" size={15} color="black" />
            <Text className="ml-1 opacity-50">@{displayName}</Text>
          </View>
          <Text className="ml-1 opacity-50 text-[12px]">{`\u2022 ${formatDistance(
            new Date(item?.timestamp?.toDate()),
            new Date(),
            { addSuffix: true },
          )}`}</Text>
        </View>
      </View>
      <Text
        className="mt-5 text-[16px]"
        style={{
          fontFamily: fonts.fontSemiBold,
        }}
      >
        {post}
      </Text>
      <View className="mt-4 flex flex-row gap-x-3 items-center justify-start ">
        <View className="text-black flex flex-row items-center w-16 justify-center">
          <MaterialIcons name="chat" size={19} color="rgba(126, 228, 203, 1)" />
          <Text className="ml-1 text-appMain">{counts?.comments}</Text>
        </View>

        <View className="relative">
          {emojiSelectorId === item?.id && (
            <EmojiSelector
              {...{
                className: "w-52 h-40 bottom-[-25px] left-[35px]",
                onEmojiSelected: (emoji) => {
                  onEmojiSelected(emoji);
                  setNewRun(new Date());
                  setEmojiSelectorId((data) =>
                    data === item.id ? null : item?.id,
                  );
                },
              }}
            />
          )}
          <View className="flex flex-row items-center">
            <TouchableOpacity
              className="relative text-black p-1 flex flex-row items-center justify-center"
              onPress={() => {
                setEmojiSelectorId((data) =>
                  data === item.id ? null : item?.id,
                );
              }}
            >
              {getUserLiked ? (
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 25 / 2,
                    backgroundColor: "rgba(126, 228, 203, 0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>{getUserLiked}</Text>
                </View>
              ) : (
                <FontAwesome5
                  name="thumbs-up"
                  size={19}
                  color="rgba(126, 228, 203, 1)"
                />
              )}
            </TouchableOpacity>

            <View className="flex flex-row items-center ml-1">
              {allLikes?.find((l) => l?.emoji === "👍") ? (
                <View className="">
                  <ThumbsUp width={20} height={20} />
                </View>
              ) : null}

              {allLikes?.find((l) => l?.emoji === "❤️") ? (
                <View className="-ml-1">
                  <RedLove width={20} height={20} />
                </View>
              ) : null}

              {/* {allLikes
                ?.filter((l) => !["👍", '"❤️"'].includes(l?.emoji))
                ?.slice(0, 1)
                ?.map((l, i) => {
                  return (
                    <View className="-ml-1" key={i}>
                      <Text>{l?.emoji}</Text>
                    </View>
                  );
                })} */}

              <Text className="ml-1 text-appMain">{allLikes?.length}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;

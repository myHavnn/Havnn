import { Text, TouchableOpacity, View, Modal } from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { firestore, getCurrentUser } from "../../config/firebase";
import EmojiSelector from "../organisms/EmojiSelector";
import { deleteDocAndKnownSubcollections, getCount } from "../../utils";
import fonts from "../../utils/fonts";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ThumbsUp from "../../../assets/blue_thumbsup.svg";
import RedLove from "../../../assets/red_love.svg";
import { formatDistance } from "date-fns";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

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
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const dotsButtonRef = useRef<any>(null);
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
      <View className="rounded text-black flex flex-row justify-between items-center">
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

        {item?.uid === currentUser.uid && (
          <TouchableOpacity
            ref={dotsButtonRef}
            onPress={() => {
              if (dotsButtonRef.current) {
                dotsButtonRef.current.measure(
                  (
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                    pageX: number,
                    pageY: number,
                  ) => {
                    setModalPosition({
                      x: pageX - 120, // Offset to position modal to the left of the button
                      y: pageY + height + 5, // Position below the button with some margin
                    });
                    setShowOptionsModal(true);
                  },
                );
              }
            }}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={{
                color: "rgba(126, 228, 203, 1)",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              •••
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text
        className="mt-5 text-[16px]"
        style={{
          fontFamily: fonts.fontSemiBold,
        }}
      >
        {post}
      </Text>
      <View className="mt-4 flex flex-row gap-x-3 items-center justify-start">
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

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View
            style={{
              position: "absolute",
              top: modalPosition.y,
              left: modalPosition.x,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 0,
              width: 150,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {/* Edit Option */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#f0f0f0",
                justifyContent: "space-between",
                // minWidth: 150,
              }}
              onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate("Extra", {
                  screen: "New Story",
                  params: { item },
                });
                setEmojiSelectorId(null);
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  fontFamily: fonts.fontRegular,
                }}
              >
                Edit
              </Text>
              <Feather name="edit-3" size={20} color="#000" style={{}} />
            </TouchableOpacity>

            {/* Delete Option */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                justifyContent: "space-between",
              }}
              onPress={() => {
                setShowOptionsModal(false);

                deleteDocAndKnownSubcollections(
                  firestore().collection("feed").doc(item?.id),
                )
                  .then(() => {
                    setEmojiSelectorId(null);
                  })
                  .catch((error) => {
                    console.error("Error deleting post:", error);
                  });
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#EF4444",
                  fontFamily: fonts.fontBold,
                }}
              >
                Delete
              </Text>
              <AntDesign name="delete" size={20} color="#EF4444" style={{}} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

export default StoryCard;

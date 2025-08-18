import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore, getCurrentUser } from "../config/firebase";
import { FontAwesome5 } from "@expo/vector-icons";

import { memo, useEffect, useRef, useState } from "react";
import { CONTENT_OFFSET_THRESHOLD } from "../utils";
import EmojiSelector from "../components/organisms/EmojiSelector";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import fonts from "../utils/fonts";
import { formatDistance } from "date-fns";
import { FlashList } from "@shopify/flash-list";
import Feather from "@expo/vector-icons/Feather";

const RenderItem = memo(
  ({
    thisComment,
    item,
    onEmojiSelected,
    navigation,
    params,
    emojiSelectorId,
    setEmojiSelectorId,
  }) => {
    const {
      id,
      displayName,
      comment,
      numberOfReplies = 0,
      hasReplies,
    } = thisComment;

    const [newRun, setNewRun] = useState(new Date());
    const [commentReplies, setCommentReplies] = useState<
      FirebaseFirestoreTypes.DocumentData[]
    >([]);
    const currentUser = getCurrentUser();
    const [commentRepliesClicked, setCommentRepliesClicked] = useState(null);
    const [commentLikes = []] = useCollectionData(
      firestore()
        .collection("feed")
        .doc(item?.id)
        .collection("comments")
        .doc(id)
        .collection("likes"),
    );

    const getUserLiked = commentLikes?.find(
      (l) => l?.uid === currentUser.uid,
    )?.emoji;

    const viewMoreReplies = async (comment) => {
      try {
        const replies: FirebaseFirestoreTypes.DocumentData[] = [];
        const docs = (
          await firestore()
            .collection("feed")
            .doc(item?.id)
            .collection("comments")
            .doc(comment?.id)
            .collection("replies")
            .orderBy("timestamp", "desc")
            .get()
        ).docs;

        docs.forEach((doc) => replies.push(doc.data()));

        setCommentReplies(replies);
        setCommentRepliesClicked(comment.id);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Pressable
        onPress={() => setEmojiSelectorId(null)}
        className="p-3 rounded-xl mb-3"
        style={{
          backgroundColor: "rgba(126, 228, 203, 0.04)",
          borderWidth: 2,
          borderColor: "rgba(126, 228, 203, 0.25)",
        }}
      >
        <View className="flex flex-row items-center w-24">
          <FontAwesome5 name="user-alt" size={14} color="black" />
          <Text className="ml-1 opacity-50 text-[12px]">@{displayName}</Text>
        </View>
        <View className="mt-2 flex flex-row gap-x-3 items-center justify-start w-100">
          <Text className="w-9/12">{comment}</Text>

          <View className="relative">
            {emojiSelectorId === id && (
              <EmojiSelector
                {...{
                  className: "w-52 h-40 bottom-[-90px] left-[-200px]",
                  onEmojiSelected: (emoji) => {
                    onEmojiSelected(emoji, thisComment);
                    setNewRun(new Date());
                    setEmojiSelectorId((data) => (data === id ? null : id));
                  },
                }}
              />
            )}
            <View className="flex flex-row items-center">
              <TouchableOpacity
                className="bg-white text-black p-1 flex flex-row items-center w-16 justify-center"
                onPress={() =>
                  setEmojiSelectorId((data: string) =>
                    data === id ? null : id,
                  )
                }
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
                  <FontAwesome5 name="thumbs-up" size={15} color="black" />
                )}
                <View className="flex flex-row items-center ml-1">
                  {commentLikes?.find((l) => l?.emoji === "👍") ? (
                    <View className="">
                      <ThumbsUp width={20} height={20} />
                    </View>
                  ) : null}

                  {commentLikes?.find((l) => l?.emoji === "❤️") ? (
                    <View className="-ml-1 mr-1">
                      <RedLove width={20} height={20} />
                    </View>
                  ) : null}

                  <Text className="">{commentLikes?.length}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="mt-2 -z-20"
          onPress={() => {
            setEmojiSelectorId(null);
            navigation.push("Extra", {
              screen: "CommentsReply",
              params: {
                comment: thisComment,
                item: params.item,
              },
            });
          }}
        >
          <Text
            className="text-[12px] -z-10"
            style={{
              fontFamily: fonts.fontSemiBold,
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            Tap here to reply to comment
          </Text>
        </TouchableOpacity>

        {hasReplies && (
          <>
            {commentRepliesClicked !== id ? (
              <TouchableOpacity
                className="mt-3 flex flex-row items-center"
                onPress={() => {
                  viewMoreReplies(thisComment);
                  setEmojiSelectorId(null);
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(151, 151, 151, 0.3)",
                    height: 1,
                    width: 17,
                    marginRight: 5,
                  }}
                />
                <Text
                  className="text-[10px]"
                  style={{
                    fontFamily: fonts.fontSemiBold,
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  View {numberOfReplies} replies
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="ml-2">
                {commentReplies?.map((reply) => {
                  return (
                    <View key={reply?.id} className="my-1">
                      <Text className="text-[12px]">{`\u2022 ${reply.reply}`}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </Pressable>
    );
  },
);

const Comments = ({ route, navigation }) => {
  const listRef = useRef<FlashList<FirebaseFirestoreTypes.DocumentData>>(null);
  const inputRef = useRef<TextInput | null>(null);
  const { params } = route;
  const item = params.item;
  const { uid, displayName, post } = item;

  const [emojiSelectorId, setEmojiSelectorId] = useState(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);

  const [comments = []] = useCollectionData(
    firestore()
      .collection("feed")
      .doc(item.id)
      .collection("comments")
      .orderBy("timestamp", "desc"),
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex flex-row justify-center items-center">
          <Text
            className="text-lg"
            style={{
              fontFamily: fonts.fontBold,
            }}
          >
            Comments
          </Text>
          <View className="bg-appMain rounded-full justify-center items-center w-8 h-8 ml-1">
            <Text
              className="text-lg"
              style={{
                fontFamily: fonts.fontBold,
              }}
            >
              {comments?.length}
            </Text>
          </View>
        </View>
      ),
    });
  }, [comments?.length, navigation]);

  const onEmojiSelected = async (emoji, thisComment) => {
    const { id, uid: commentUsername, comment } = thisComment;
    const currentUser = getCurrentUser();

    const ref = firestore()
      .collection("feed")
      .doc(item?.id)
      .collection("comments")
      .doc(id)
      .collection("likes")
      .doc(currentUser.uid);

    await ref.set(
      {
        id: ref?.id,
        emoji,
        timestamp: firestore.Timestamp.now(),
        updated: firestore.Timestamp.now(),
        uid: currentUser.uid,
        displayName: currentUser.displayName,
      },
      { merge: true },
    );

    if (currentUser.uid !== commentUsername) {
      await firestore().collection("users").doc(commentUsername).update({
        hasNewNotification: true,
      });

      const notif = firestore()
        .collection("users")
        .doc(commentUsername)
        .collection("notifications")
        .doc();

      await notif.set(
        {
          id: notif.id,
          subtext: "liked your comment",
          text: comment,
          timestamp: firestore.Timestamp.now(),
          updated: firestore.Timestamp.now(),
          uid: currentUser.uid,
          displayName: currentUser.displayName,
        },
        { merge: true },
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <View className="flex-1 p-2 bg-white" style={{}}>
        <View
          className="p-4 rounded-xl mb-3"
          style={{
            backgroundColor: "rgba(126, 228, 203, 0.04)",
            borderWidth: 1,
            borderColor: "rgba(126, 228, 203, 0.25)",
          }}
        >
          <View className="flex flex-row justify-start items-center">
            <View className="flex flex-row justify-start items-center">
              <FontAwesome5 name="user-alt" size={14} color="black" />
              <Text className="ml-1 opacity-50 text-[12px]">
                @{displayName}
              </Text>
            </View>
            <Text className="ml-1 opacity-50 text-[12px]">{`\u2022 ${formatDistance(
              new Date(item?.timestamp?.toDate()),
              new Date(),
              { addSuffix: true },
            )}`}</Text>
          </View>
          <Text className="mt-2">{post}</Text>
        </View>

        <View
          style={{
            borderBottomColor: "rgba(151, 151, 151, 0.2)",
            borderBottomWidth: 1,
          }}
        />

        <FlashList
          scrollEnabled={!emojiSelectorId}
          ref={listRef}
          estimatedItemSize={124}
          showsVerticalScrollIndicator={false}
          data={comments}
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 80,
          }}
          onScroll={(event) =>
            setContentVerticalOffset(event.nativeEvent.contentOffset.y)
          }
          renderItem={({ item: thisComment }) => (
            <RenderItem
              {...{
                item,
                thisComment,
                navigation,
                onEmojiSelected,
                params,
                emojiSelectorId,
                setEmojiSelectorId,
              }}
            />
          )}
          extraData={emojiSelectorId}
        />

        {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
          <TouchableOpacity
            onPress={() => {
              listRef?.current?.scrollToOffset({ offset: 0, animated: true });
              setEmojiSelectorId(null);
            }}
            style={{
              backgroundColor: "black",
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
              position: "absolute",
              bottom: 10,
              right: 10,
            }}
          >
            <Entypo name="chevron-up" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <View
        className="bg-white"
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          className="px-2 py-1 bg-gray-100 w-11/12 rounded-lg"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            ref={inputRef}
            className="p-0 h-full rounded-lg w-10/12"
            autoCapitalize="sentences"
            autoCorrect={false}
            autoFocus={false}
            returnKeyType="done"
            cursorColor="black"
            placeholder="Add a comment"
            onChangeText={(text) => (inputRef.current.value = text)}
          />
          <TouchableOpacity
            className="p-2 w-2/12 rounded"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(126, 228, 203, 1)",
            }}
            onPress={async () => {
              const text = inputRef?.current?.value;
              if (text) {
                inputRef?.current?.clear();
                const currentUser = getCurrentUser();

                const ref = firestore()
                  .collection("feed")
                  .doc(item?.id)
                  .collection("comments")
                  .doc();

                await ref.set(
                  {
                    id: ref?.id,
                    hasReplies: false,
                    numberOfReplies: 0,
                    comment: text,
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    timestamp: firestore.Timestamp.now(),
                    updated: firestore.Timestamp.now(),
                  },
                  { merge: true },
                );

                await firestore()
                  .collection("feed")
                  .doc(item?.id)
                  .update({
                    updated: firestore.Timestamp.now(),
                    numberOfComments: firestore.FieldValue.increment(1),
                  });

                if (currentUser.uid !== uid) {
                  await firestore()
                    .collection("users")
                    .doc(currentUser.uid)
                    .update({
                      hasNewNotification: true,
                    });

                  const notif = firestore()
                    .collection("users")
                    .doc(currentUser.uid)
                    .collection("notifications")
                    .doc();

                  await notif.set(
                    {
                      id: notif.id,
                      subtext: "comment on your post",
                      text,
                      timestamp: firestore.Timestamp.now(),
                      updated: firestore.Timestamp.now(),
                      uid: currentUser.uid,
                      displayName: currentUser.displayName,
                    },
                    { merge: true },
                  );
                }

                listRef?.current?.scrollToOffset({ offset: 0, animated: true });
                setEmojiSelectorId(null);
              }
            }}
          >
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Comments;

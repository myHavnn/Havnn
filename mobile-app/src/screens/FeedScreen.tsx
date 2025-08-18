import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import StoryCard from "../components/molecules/StoryCard";
import { FlashList } from "@shopify/flash-list";
import { firestore, getCurrentUser } from "../config/firebase";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { itemsFetch } from "../hooks/fetchItems";
import { orderBy as _orderBy, reverse, uniqBy } from "lodash";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { CONTENT_OFFSET_THRESHOLD, getCount } from "../utils";
import fonts from "../utils/fonts";
import { useApp } from "../context/AppContext";

import { useCollectionData } from "react-firebase-hooks/firestore";

const Footer = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="small" color={"red"} />
    </View>
  );
};

const LIMIT = 5;

const FeedScreen = ({ navigation }) => {
  const { changeFeedSelected, feedSelected } = useApp();
  const listRef = useRef<FlashList<FirebaseFirestoreTypes.DocumentData>>(null);
  const isFocused = useIsFocused();

  const [lastPost, setLastPost] = useState(false);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const [allPosts, setAllPosts] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  const [fetchingMore, setFetchingMore] = useState(false);
  const [refetch, setRefetch] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [getMoreQuery, setGetMoreQuery] = useState(
    ["Most Commented"].includes(feedSelected)
      ? firestore()
          .collection("feed")
          .orderBy("numberOfComments", "desc")
          .orderBy("timestamp", "desc")
          .limit(LIMIT)
      : firestore()
          .collection("feed")
          .where("type", "==", feedSelected)
          .orderBy("timestamp", "desc")
          .limit(LIMIT),
  );
  const [emojiSelectorId, setEmojiSelectorId] = useState(null);

  const [allPosts2 = []] = useCollectionData(
    ["Most Commented"].includes(feedSelected)
      ? firestore()
          .collection("feed")
          .orderBy("numberOfComments", "desc")
          .orderBy("timestamp", "desc")
      : firestore()
          .collection("feed")
          .where("type", "==", feedSelected)
          .orderBy("timestamp", "desc"),
  );

  // useEffect(() => {
  //   const r = async () => {
  //     const docs = (await firestore().collection("feed").get()).docs.map(
  //       (d) => ({ id: d.id, ref: d.ref }),
  //     );

  //     docs.map(async (i) => {
  //       getCount(
  //         firestore().collection("feed").doc(i?.id).collection("likes"),
  //         "likes",
  //         (d) => {
  //           const { likes } = d();
  //           console.log(likes);
  //           i.ref.update({ numberOfLikes: likes });
  //         },
  //       );
  //     });
  //   };

  //   r().then((d) => {
  //     console.log(d);
  //   });
  // }, []);

  useEffect(() => {
    return () => {};
    if (isFocused) {
      (async () => {
        const data = await itemsFetch(
          firestore()
            .collection("feed")
            .where("type", "==", feedSelected)
            .orderBy("timestamp", "desc")
            .limit(LIMIT),
        );
        if (data.items?.length) {
          setAllPosts(() => {
            const arr = [...data.items];
            const newData = _orderBy(
              reverse(uniqBy(reverse(arr), "id")),
              ["timestamp"],
              ["desc"],
            );

            return newData;
          });
          listRef.current?.scrollToOffset({ animated: true, offset: 0 });
          setLastPost(false);
          setGetMoreQuery(
            firestore()
              .collection("feed")
              .where("type", "==", feedSelected)
              .orderBy("timestamp", "desc")
              .startAfter(data?.lastVisible)
              .limit(LIMIT),
          );
        } else {
          setAllPosts([]);
        }

        setRefreshing(false);
        setFetchingMore(false);
      })();
    } else {
      setEmojiSelectorId(null);
    }
  }, [feedSelected, isFocused, refetch]);

  const getMore = async () => {
    return;
    if (!lastPost) {
      setFetchingMore(true);
      const data = await itemsFetch(getMoreQuery);
      setAllPosts((d) => {
        const arr = [...d, ...data.items];
        const newData = _orderBy(
          reverse(uniqBy(reverse(arr), "id")),
          ["timestamp"],
          ["desc"],
        );
        return newData;
      });
      if (data?.items?.length === 0) {
        setLastPost(true);
      } else {
        setLastPost(false);
        setGetMoreQuery(
          firestore()
            .collection("feed")
            .where("type", "==", feedSelected)
            .orderBy("timestamp", "desc")
            .startAfter(data?.lastVisible)
            .limit(LIMIT),
        );
      }
      setFetchingMore(false);
    }
  };

  const feedTopics = [
    { name: "Most Commented" },
    {
      name: "Heartbreak",
    },
    {
      name: "Stressed",
    },
    {
      name: "Reproductive health",
    },
  ];

  const onEmojiSelected = async (emoji, item) => {
    const { id, post, uid: postUsername } = item;
    const currentUser = getCurrentUser();

    const ref = firestore()
      .collection("feed")
      .doc(id)
      .collection("likes")
      .doc(currentUser.uid);

    await ref.set(
      {
        emoji,
        timestamp: firestore.Timestamp.now(),
        updated: firestore.Timestamp.now(),
        uid: currentUser.uid,
        displayName: currentUser.displayName,
      },
      { merge: true },
    );

    await firestore()
      .collection("feed")
      .doc(id)
      .update({
        numberOfLikes: firestore.FieldValue.increment(1),
      });

    if (currentUser.uid !== postUsername) {
      await firestore().collection("users").doc(postUsername).update({
        hasNewNotification: true,
      });

      const notif = firestore()
        .collection("users")
        .doc(postUsername)
        .collection("notifications")
        .doc();

      await notif.set(
        {
          id: notif.id,
          subtext: "liked your post",
          text: post,
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
    <View className="flex-1 bg-white p-3 pb-0">
      <FlashList
        contentContainerStyle={{
          backgroundColor: "#eee",
          padding: 1,
        }}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={103}
        data={feedTopics}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => changeFeedSelected(item.name)}
            className={`${feedSelected === item?.name ? "bg-appMain" : "opacity-70"} p-2 rounded-lg transition-all`}
          >
            <Text
              className={"font-semibold text-black"}
              style={{
                fontFamily:
                  feedSelected === item?.name
                    ? fonts.fontSemiBold
                    : fonts.fontRegular,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View className="my-1" />

      <FlashList
        scrollEnabled={!emojiSelectorId}
        ref={listRef}
        onScroll={(event) => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={490}
        // data={allPosts}
        data={allPosts2}
        renderItem={({ item }) => (
          <StoryCard
            {...{
              item,
              backgroundColor: "rgba(126, 228, 203, 0.04)",
              emojiSelectorId,
              setEmojiSelectorId,
              onEmojiSelected: (emoji) => {
                onEmojiSelected(emoji, item);
              },
            }}
          />
        )}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        ListFooterComponent={() => !lastPost && fetchingMore && <Footer />}
        onEndReached={getMore}
        onEndReachedThreshold={0.01}
        scrollEventThrottle={150}
        refreshing={refreshing}
        onRefresh={() => {
          setRefetch(new Date());
        }}
        extraData={emojiSelectorId}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Extra", { screen: "New Story" });
          setEmojiSelectorId(null);
        }}
        style={{
          backgroundColor: "rgba(126, 228, 203, 1)",
          height: 40,
          width: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          position: "absolute",
          bottom: 90,
          left: "47%",
        }}
      >
        <Entypo name="plus" size={20} color="white" />
      </TouchableOpacity>
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() =>
            listRef?.current?.scrollToOffset({ offset: 0, animated: true })
          }
          style={{
            backgroundColor: "black",
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            position: "absolute",
            bottom: 90,
            right: 10,
          }}
        >
          <Entypo name="chevron-up" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FeedScreen;

import { Fragment, useCallback, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import fonts from "../utils/fonts";
import { formatDistance, getDayOfYear } from "date-fns";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore, getCurrentUser } from "../config/firebase";

import { FontAwesome5 } from "@expo/vector-icons";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

const NotificationScreen = ({ route, navigation }) => {
  const dimensions = Dimensions.get("screen");
  const listRef = useRef<FlatList<FirebaseFirestoreTypes.DocumentData>>(null);

  const currentUser = getCurrentUser();

  const [notifications, loading] = useCollectionData(
    firestore()
      .collection("users")
      .doc(currentUser?.uid)
      .collection("notifications")
      .orderBy("timestamp", "desc"),
    { initialValue: [] },
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      if (!notifications?.[index]?.timestamp) return null;
      let shouldRenderHeader = false;
      const currentTimestamp = new Date(
        notifications?.[index]?.timestamp?.toDate(),
      );
      if (index === 0) {
        shouldRenderHeader = true;
      } else {
        const prevTimestamp = new Date(
          notifications?.[index - 1]?.timestamp?.toDate(),
        );

        if (getDayOfYear(prevTimestamp) !== getDayOfYear(currentTimestamp)) {
          shouldRenderHeader = true;
        }
      }

      return (
        <Fragment key={index}>
          {shouldRenderHeader && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: fonts.fontBold }}>
                {formatDistance(new Date(), currentTimestamp, {
                  addSuffix: true,
                })}
              </Text>
            </View>
          )}

          <View className="w-11/12">
            <View className="flex flex-row my-2 items-start">
              <View className="mt-1">
                <FontAwesome5 name="user-alt" size={14} color="black" />
              </View>
              <Text className="ml-1 flex flex-row">
                <Text
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  @{item?.displayName}{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.fontSemiBold,
                    color: "rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {item?.subtext}: {item?.text}{" "}
                </Text>
                <Text
                  className="text-[12px]"
                  style={{
                    color: "rgba(0, 0, 0, 0.6)",
                    fontFamily: fonts.fontLight,
                  }}
                >
                  {formatDistance(new Date(), item?.updated?.toDate(), {
                    addSuffix: true,
                  })}
                </Text>
              </Text>
            </View>
          </View>
        </Fragment>
      );
    },
    [notifications],
  );

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexGrow: 1,
      }}
      style={{}}
      scrollEnabled
      keyboardShouldPersistTaps="always"
    >
      <FlatList
        ref={listRef}
        data={notifications}
        // estimatedItemSize={45}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View
            className="my-4"
            style={{
              borderBottomColor: "rgba(151, 151, 151, 0.2)",
              borderBottomWidth: 1,
            }}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={{ ...StyleSheet.absoluteFillObject }}>
              <ActivityIndicator color={"blue"} size="large" />
            </View>
          ) : (
            <View
              className="flex-1 justify-center items-center"
              style={{ height: dimensions.height - 200 }}
            >
              <Text
                className="text-[16px] text-center"
                style={{
                  fontFamily: fonts.fontLight,
                  color: "rgba(139, 131, 131, 1)",
                }}
              >
                As soon as you jump into conversations around you, you will
                receive awesome notifications
              </Text>
            </View>
          )
        }
      />
    </ScrollView>
  );
};

export default NotificationScreen;

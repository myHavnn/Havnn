import { useCallback, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { firestore, getCurrentUser } from "../config/firebase";
import fonts from "../utils/fonts";
import { Entypo } from "@expo/vector-icons";

const NewStoryScreen = ({ navigation, route }) => {
  const post = route?.params?.item;

  const [text, setText] = useState(post?.post ?? "");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [postType, setPostType] = useState<null | string>(null);

  const addNewPost = useCallback(async () => {
    if (postType) {
      try {
        setProcessing(true);
        const currentUser = getCurrentUser();

        const userData = (
          await firestore().collection("users").doc(currentUser.uid).get()
        ).data();

        const ref = post?.id
          ? firestore().collection("feed").doc(post.id)
          : firestore().collection("feed").doc();

        const postData = {
          type: postType,
          id: ref.id,
          post: text,
          uid: userData?.uid,
          displayName: userData?.displayName,
          ...(post?.id ? {} : { timestamp: firestore.Timestamp.now() }),
          updated: firestore.Timestamp.now(),
        };

        await ref.set(postData, { merge: true });
        navigation.goBack();
      } catch (error) {
        console.log(error);
      } finally {
        setProcessing(false);
      }
    }
  }, [navigation, postType, text]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (text && step === 1) {
          return (
            <TouchableOpacity onPress={() => setStep(2)} className="pr-4">
              <Text>Next</Text>
            </TouchableOpacity>
          );
        }
        if (step === 2) {
          return null;
        }
      },
    });
  }, [navigation, processing, text, step]);

  const postTypes = [
    {
      title: "Stressed",
      text: "Stress among youths is a growing concern.",
      source: require("../../assets/resources/stressed.png"),
    },
    {
      title: "Heartbreak",
      text: "Dealing with heartbreak effectively is crucial for emotional well-being and personal growth",
      source: require("../../assets/resources/feed.png"),
    },

    {
      title: "Reproductive health",
      text: "Youth reproductive health focuses on empowering young individuals with knowledge.",
      source: require("../../assets/resources/stressed.png"),
    },
  ];

  return (
    <KeyboardAvoidingView className="flex-1 w-full">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexGrow: 1,
        }}
        style={{
          backgroundColor: "white",
        }}
        scrollEnabled
        keyboardShouldPersistTaps="always"
      >
        {step == 1 && (
          <TextInput
            className="text-xl font-semibold"
            multiline
            autoCapitalize="sentences"
            autoCorrect={false}
            autoFocus
            textAlignVertical="top"
            numberOfLines={50}
            rows={50}
            style={{ height: Platform.OS === "ios" && 550 }}
            placeholder="Share your thoughts and experiences with eunoia"
            // placeholderTextColor="rgba(65, 57, 57, 1)"
            returnKeyType="done"
            cursorColor="black"
            onChangeText={setText}
            value={text}
          />
        )}
        {step === 2 && (
          <View className="flex-1 justify-between">
            <View>
              <Text
                className="uppercase text-[10px]"
                style={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontFamily: fonts.fontBold,
                }}
              >
                Choose post destination
              </Text>

              <View
                className="rounded-xl mt-3"
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(126, 228, 203, 0.25)",
                }}
              >
                {postTypes?.map((pt, index) => {
                  return (
                    <View key={pt?.title} className="w-full overflow-hidden">
                      <TouchableOpacity
                        disabled={processing}
                        className="flex flex-row justify-center items-center py-2 overflow-hidden"
                        onPress={() => {
                          setPostType(pt?.title);
                        }}
                        style={{
                          backgroundColor:
                            postType === pt?.title
                              ? "rgba(126, 228, 203, 0.25)"
                              : "white",
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          className="w-20 h-20 overflow-hidden"
                          source={pt?.source}
                        />

                        <View
                          className={`ml-4 ${postType === pt?.title ? "w-7/12" : "w-8/12"}`}
                        >
                          <Text
                            className="text-[20px]"
                            style={{
                              fontFamily: fonts.fontBold,
                            }}
                          >
                            {pt?.title}
                          </Text>
                          <Text
                            className="text-[12px]"
                            style={{
                              fontFamily: fonts.fontLight,
                            }}
                          >
                            {pt?.text}
                          </Text>
                        </View>
                        {postType === pt?.title ? (
                          <Entypo name="check" size={24} color="black" />
                        ) : null}
                      </TouchableOpacity>
                      {index !== postTypes?.length - 1 && (
                        <View
                          style={{
                            marginVertical: 5,
                            borderBottomColor: "rgba(151, 151, 151, 0.2)",
                            borderBottomWidth: 1,
                          }}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
            <View className="w-full">
              <TouchableOpacity
                onPress={addNewPost}
                disabled={!postType}
                className="w-full rounded py-2 flex flex-row justify-center items-center"
                style={{
                  backgroundColor: !postType
                    ? "lightgray"
                    : "rgba(126, 228, 203, 1)",
                }}
              >
                <Text
                  className="text-white mr-2"
                  style={{
                    fontFamily: fonts.fontBold,
                  }}
                >
                  SHARE
                </Text>
                <Entypo name="controller-play" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewStoryScreen;

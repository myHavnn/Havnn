import { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { firestore, getCurrentUser } from "../config/firebase";

const CommentReplyScreen = ({ route, navigation }) => {
  const { height } = Dimensions.get("window");
  const {
    params: { item, comment },
  } = route;

  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const addNewCommentReply = async () => {
      try {
        setProcessing(true);
        const currentUser = getCurrentUser();

        const userData = (
          await firestore().collection("users").doc(currentUser.uid).get()
        ).data();

        const ref = firestore()
          .collection("feed")
          .doc(item?.id)
          .collection("comments")
          .doc(comment!.id)
          .collection("replies")
          .doc();

        await ref.set(
          {
            id: ref.id,
            reply: text,
            uid: userData?.uid,
            displayName: userData?.displayName,
            timestamp: firestore.Timestamp.now(),
            updated: firestore.Timestamp.now(),
          },
          { merge: true },
        );

        await firestore()
          .collection("feed")
          .doc(item?.id)
          .collection("comments")
          .doc(comment!.id)
          .update({
            hasReplies: true,
            numberOfReplies: firestore.FieldValue.increment(1),
            updated: firestore.Timestamp.now(),
          });
        navigation.replace("Extra", {
          screen: "Comments",
          params: {
            item,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setProcessing(false);
      }
    };

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={processing}
          onPress={addNewCommentReply}
          className="pr-4"
        >
          <FontAwesome name="send" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [comment, item, item.id, navigation, processing, text]);

  return (
    <KeyboardAvoidingView className="flex-1 w-full">
      <Text
        style={{
          padding: 10,
        }}
      >
        {comment.comment}
      </Text>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          marginTop: 5,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexGrow: 1,
        }}
        style={{
          backgroundColor: "white",
        }}
      >
        <TextInput
          className="text-xl font-semibold"
          multiline
          autoCapitalize="sentences"
          autoCorrect={false}
          autoFocus
          textAlignVertical="top"
          numberOfLines={50}
          style={{ height: Platform.OS === "ios" ? height / 2 : "auto" }}
          placeholder=""
          returnKeyType="done"
          cursorColor="black"
          onChangeText={setText}
          value={text}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CommentReplyScreen;

const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

const firestore = admin.firestore;

exports.newPostLike = onDocumentWritten(
  "/posts/{postId}/likes/{likeId}",
  async (event) => {
    try {
      const postId = event.params.postId;
      const likeId = event.params.likeId;

      const likeData = event.data.after.data();

      const post = (
        await firestore().collection("posts").doc(postId).get()
      ).data();
      logger.log(`post ===>`, post);
      logger.log(`like ===>`, likeData);

      const uid = post?.uid;

      const notifRef = firestore()
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc();

      await notifRef.set({
        id: notifRef?.id,
        text: likeData?.emoji,
        subtext: `liked your comment`,
        uid: likeId,
        postId: post?.id,
        displayName: likeData.displayName,
        timestamp: firestore.Timestamp.now(),
        updated: firestore.Timestamp.now(),
        type: "postLike",
      });

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
);

exports.newPostComment = onDocumentCreated(
  "/posts/{postId}/comments/{commentId}",
  async (event) => {
    try {
      const postId = event.params.postId;
      const commentId = event.params.commentId;
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }
      const commentData = snapshot.data();
      const post = (
        await firestore().collection("posts").doc(postId).get()
      ).data();
      logger.log(`post ===>`, post);
      logger.log(`comment ===>`, commentData);

      const uid = post?.uid;

      const notifRef = firestore()
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc();

      await notifRef.set({
        id: notifRef?.id,
        text: commentData?.comment,
        subtext: `left you a comment`,
        uid: commentData?.uid,
        commentId,
        postId: post?.id,
        displayName: commentData?.displayName,
        timestamp: firestore.Timestamp.now(),
        updated: firestore.Timestamp.now(),
        type: "postComment",
      });

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
);

exports.newCommentReply = onDocumentCreated(
  "/posts/{postId}/comments/{commentId}/replies/{replyId}",
  async (event) => {
    try {
      const postId = event.params.postId;
      const commentId = event.params.commentId;
      const replyId = event.params.replyId;
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }
      const replyData = snapshot.data();

      const post = (
        await firestore().collection("posts").doc(postId).get()
      ).data();
      logger.log(`post ===>`, post);
      logger.log(`reply ===>`, replyData);

      const uid = post?.uid;

      const notifRef = firestore()
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc();

      await notifRef.set({
        id: notifRef?.id,
        text: replyData?.reply,
        subtext: `replied to your comment`,
        uid: replyData?.uid,
        commentId,
        postId: post?.id,
        displayName: replyData?.displayName,
        replyId,
        timestamp: firestore.Timestamp.now(),
        updated: firestore.Timestamp.now(),
        type: "commentReply",
      });

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
);

import FeedScreen from "./FeedScreen";
import NewStoryScreen from "./NewStoryScreen";
import CommentsScreen from "./CommentsScreen";
import StressScreen from "./StressScreen";
import HeartbreakScreen from "./HeartbreakScreen";
import ReproductiveHealthScreen from "./ReproductiveHealthScreen";
import LinksScreen from "./LinksScreen";
import CommentReplyScreen from "./CommentReplyScreen";
import NotificationScreen from "./NotificationScreen";
import LinkScreen from "./LinkScreen";
import BookACounsellor from "./BookACounsellor";

const screens = {
  Feed: FeedScreen,
  NewStory: NewStoryScreen,
  Comments: CommentsScreen,
  Stress: StressScreen,
  Heartbreak: HeartbreakScreen,
  Reproductive: ReproductiveHealthScreen,
  Links: LinksScreen,
  CommentReply: CommentReplyScreen,
  Notifications: NotificationScreen,
  Link: LinkScreen,
  Book: BookACounsellor,
};

export default screens;

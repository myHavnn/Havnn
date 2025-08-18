/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewToken,
  Platform,
  ScrollView,
} from "react-native";

import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import fonts from "../utils/fonts";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { newAuth, newFirestore } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "@react-native-firebase/firestore";

const data = [
  {
    id: 1,
    image: require("../../assets/onboarding/1.png"),
  },
  {
    id: 2,
    image: require("../../assets/onboarding/2.png"),
  },
  {
    id: 3,
    image: require("../../assets/onboarding/3.png"),
  },
  {
    id: 4,
    image: require("../../assets/onboarding/4.png"),
    isGetStarted: true,
  },
  {
    id: 5,
    image: require("../../assets/onboarding/5.png"),
    isLast: true,
  },
];

const RenderItem = ({
  item,
  signIn,
  onEmailPress,
  isSigninInProgress,
  passwordError,
  flatListRef,
}: {
  item: any;
  signIn: () => Promise<void>;
  onEmailPress: () => void;
  isSigninInProgress: boolean;
  passwordError?: string;
  flatListRef: React.RefObject<FlatList>;
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageAnimatedStyle = {
    width: SCREEN_WIDTH,
  };

  if (item.isGetStarted) {
    return (
      <View className="relative">
        <Animated.Image
          className="flex-1"
          source={item.image}
          style={imageAnimatedStyle}
        />

        <View className="absolute bottom-[5%] left-[20%] px-20 py-4 rounded-3xl bg-appMain">
          <TouchableOpacity
            className="h-full w-full"
            onPress={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                  index: item.id,
                  animated: true,
                });
              }
            }}
          >
            <Text
              className="text-white h-full w-full text-[16px]"
              style={{
                fontFamily: fonts.fontBold,
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (item.isLast) {
    return (
      <View className="relative">
        <Animated.Image
          className="flex-1"
          source={item.image}
          style={imageAnimatedStyle}
        />
        {item?.isLast && (
          <View className="absolute bottom-[5%] w-full items-center justify-center">
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
              disabled={isSigninInProgress}
            />
            {passwordError && (
              <Text className="text-xs" style={{ color: "red" }}>
                {passwordError}
              </Text>
            )}

            <View className="w-full flex-row items-center justify-center mt-2">
              <Text style={{ fontFamily: fonts.fontRegular }}>or with </Text>
              <TouchableOpacity onPress={onEmailPress}>
                <Text style={{ fontFamily: fonts.fontBold }}>Email</Text>
              </TouchableOpacity>
            </View>

            <View className="w-[100%] flex-row items-center justify-center mt-2">
              <Text
                className="text-center "
                style={{ fontFamily: fonts.fontRegular }}
              >
                By clicking the button, you agree to our and
                <Text style={{ fontFamily: fonts.fontBold }}>
                  {" "}
                  Terms of Use
                </Text>
                <Text> and </Text>
                <Text style={{ fontFamily: fonts.fontBold }}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="relative">
      <Animated.Image
        className="flex-1"
        source={item.image}
        style={imageAnimatedStyle}
      />
    </View>
  );
};

// Reusable InputWithIcon component
const InputWithIcon = ({
  iconName,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry = false,
  showToggle = false,
  onToggleShow,
  showText = false,
  ...rest
}: {
  iconName: any; // fallback to any for Ionicons name prop
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggleShow?: () => void;
  showText?: boolean;
  [key: string]: any;
}) => (
  <View style={styles.inputRow}>
    <View style={styles.inputIconContainer}>
      <Ionicons name={iconName} size={20} color="#888" />
    </View>
    <TextInput
      style={[styles.inputWithIcon, { flex: 1 }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#888"
      autoComplete="off"
      autoCorrect={false}
      {...rest}
    />
    {showToggle && onToggleShow && (
      <TouchableOpacity onPress={onToggleShow} style={styles.eyeButton}>
        <Ionicons
          name={showText ? "eye-off-outline" : "eye-outline"}
          size={20}
          color="black"
        />
      </TouchableOpacity>
    )}
  </View>
);

const Onboarding = () => {
  const ref = doc(newFirestore, "platform/data");

  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  const flatListRef = useAnimatedRef<FlatList>();

  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    flatListIndex.value = viewableItems[0].index ?? 0;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  GoogleSignin.configure({
    webClientId:
      "290385188673-e7n5v7hr4rjeuj7kv3eb6klorjbpfgv5.apps.googleusercontent.com",
  });

  const signIn = async () => {
    try {
      setIsSigninInProgress(true);
      setPasswordError("");
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token found");
      }

      const googleCredential = GoogleAuthProvider.credential(
        signInResult?.data?.idToken,
      );

      const userCredential = await signInWithCredential(
        newAuth,
        googleCredential,
      );

      const count = ((await getDoc(ref)).data()?.userCount ?? 0) + 1;

      await setDoc(
        doc(collection(newFirestore, "users"), userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          email: userCredential.user.email || "",
          ...(userCredential.additionalUserInfo?.isNewUser
            ? {
                createdAt: Timestamp.now(),
                displayName: `anon${count}`,
              }
            : {}),
        },
        { merge: true },
      );

      if (userCredential.additionalUserInfo?.isNewUser) {
        await updateDoc(ref, {
          userCount: count,
        });
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setPasswordError("Sign in cancelled by user");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setPasswordError("Sign in is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setPasswordError("Play services not available or outdated");
      } else {
        setPasswordError(error?.message);
      }
    } finally {
      setIsSigninInProgress(false);
    }
  };

  const onClose = () => {
    setEmailModalVisible(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordError("");
    setIsLoading(false);
  };

  const handleRegister = async () => {
    try {
      // if (!name.trim()) {
      //   setPasswordError("Name is required");
      //   return;
      // }
      if (!email.trim()) {
        setPasswordError("Email is required");
        return;
      }
      if (!password.trim()) {
        setPasswordError("Password is required");
        return;
      }
      if (!confirmPassword.trim()) {
        setPasswordError("Confirm password is required");
        return;
      }
      if (password.length < 6) {
        setPasswordError("Password should be at least 6 characters");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setPasswordError("Invalid email format");
        return;
      }
      // Check if passwords match
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      setPasswordError("");
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        newAuth,
        email,
        password,
      );
      // await userCredential.user.updateProfile({ displayName: name });

      const count = ((await getDoc(ref)).data()?.userCount ?? 0) + 1;
      await setDoc(
        doc(collection(newFirestore, "users"), userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          displayName: `anon${count}`,
          email,
          createdAt: Timestamp.now(),
        },
      );
      onClose();
      await updateDoc(ref, {
        userCount: count,
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        try {
          const userCredential = await signInWithEmailAndPassword(
            newAuth,
            email,
            password,
          );

          if (!userCredential.user) {
            setPasswordError(
              "That email address is already in use! Try google sign in.",
            );
          } else {
            onClose();
          }
        } catch (error) {
          if ((error as any)?.code === "auth/invalid-credential") {
            setPasswordError(
              "That email address is already in use! Try google sign in.",
            );
          } else {
            setPasswordError(
              "That email address is already in use! Try google sign in.",
            );
          }
        }
      } else if (error.code === "auth/invalid-email") {
        setPasswordError("That email address is invalid!");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("Password should be at least 6 characters!");
      } else {
        setPasswordError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RenderItem
            item={item}
            signIn={signIn}
            onEmailPress={() => setEmailModalVisible(true)}
            isSigninInProgress={isSigninInProgress}
            passwordError={passwordError}
            flatListRef={flatListRef}
          />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <Modal
        visible={isEmailModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[styles.modalOverlay, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              {/* Close Icon */}
              <TouchableOpacity
                style={styles.closeIconButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#e74c3c" />
              </TouchableOpacity>
              <Text
                className="text-[20px] text-center"
                style={{
                  fontFamily: fonts.fontBold,
                  marginBottom: 10,
                }}
              >
                What’s your email?
              </Text>
              <Text
                className="text-center text-[13px] text-gray-500"
                style={{
                  marginBottom: 10,
                }}
              >
                No one will see your email and your data will not be share with
                anyone!
              </Text>
              {/* Email login form */}
              <View style={{ width: "100%" }}>
                {/* <InputWithIcon
                  iconName="person-outline"
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  autoCapitalize="words"
                /> */}
                <InputWithIcon
                  iconName="mail-outline"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <InputWithIcon
                  iconName="lock-closed-outline"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  autoCapitalize="none"
                  secureTextEntry={!showPassword}
                  showToggle
                  onToggleShow={() => setShowPassword((v) => !v)}
                  showText={showPassword}
                />
                <InputWithIcon
                  iconName="lock-closed-outline"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  autoCapitalize="none"
                  secureTextEntry={!showConfirmPassword}
                  showToggle
                  onToggleShow={() => setShowConfirmPassword((v) => !v)}
                  showText={showConfirmPassword}
                />
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
                <TouchableOpacity
                  onPress={handleRegister}
                  style={[styles.registerButton, isLoading && { opacity: 0.2 }]}
                  disabled={isLoading}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: fonts.fontBold,
                      fontSize: 16,
                    }}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // backgroundColor: "rgba(127, 228, 202, 1)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#222",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  closeIconButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  inputLabel: {
    fontFamily: fonts.fontRegular,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 2,
    color: "#222",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 4,
    fontFamily: fonts.fontRegular,
    backgroundColor: "#f7f7f7",
    color: "#222",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    height: 44,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
  },
  inputIconContainer: {
    height: "100%",
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWithIcon: {
    fontSize: 16,
    fontFamily: fonts.fontRegular,
    backgroundColor: "#D9D9D9",
    color: "#222",
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 4,
    fontFamily: fonts.fontRegular,
  },
  registerButton: {
    marginTop: 12,
    backgroundColor: "#1abc9c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});

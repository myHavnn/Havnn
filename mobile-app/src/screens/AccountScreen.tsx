import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore, getCurrentUser, newAuth } from "../config/firebase";
import { capitalize } from "lodash";
import fonts from "../utils/fonts";
import { format } from "date-fns";
import { deleteUser, signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { deleteDocAndKnownSubcollections } from "../utils";

const AccountScreen = ({ navigation }: { navigation: any }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutSuccessModal, setShowLogoutSuccessModal] = useState(false);
  const currentUser = getCurrentUser();
  const [user] = useDocumentData(
    firestore().collection("users").doc(currentUser.uid),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView className="flex-1">
        {/* <StatusBar barStyle="light-content" backgroundColor="#000" /> */}

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={64} color="#000" />
            </View>
          </View>

          <Text style={styles.username}>{capitalize(user?.displayName)}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="mail"
              size={9}
              color="rgba(126, 228, 203, 1)"
              style={{ marginRight: 3 }}
            />
            <Text style={styles.email}>
              {(user?.email ?? "")?.replace(/[^@]+(?=@)/, (match: string) =>
                match.length > 5
                  ? match.slice(0, match.length - 5) + "*".repeat(5)
                  : match.slice(0, match.length - 3) + "*".repeat(3),
              )}
            </Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={21} color="white" />
            <Text style={styles.verifiedText}>Verified Account</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color="rgba(126, 228, 203, 1)" />
            <Text style={styles.sectionTitle}>Account Information</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRow}>
              <Ionicons name="male-female" size={22} color="white" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{user?.gender}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={22} color="white" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{user?.age}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={22} color="white" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member since</Text>
                <Text style={styles.infoValue}>
                  {user ? format(user?.createdAt.toDate(), "MMMM yyyy") : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "#444",
            marginVertical: 16,
            marginHorizontal: 16,
            borderRadius: 1,
          }}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={styles.actionRow}>
              <View style={styles.logoutIcon}>
                <Ionicons name="log-out-outline" size={20} color="white" />
              </View>
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setShowDeleteModal(true)}
          >
            <View style={styles.actionRow}>
              <View style={styles.deleteIcon}>
                <Ionicons name="trash-outline" size={20} color="white" />
              </View>
              <Text style={styles.deleteText}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            No one will see these options. This information will only be visible
            to this account
          </Text>
        </View>
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.trashIconContainer}>
              <Ionicons name="trash" size={51} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>
              Are you sure want to delete your account?
            </Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={async () => {
                  setShowDeleteModal(false);

                  // Show success modal immediately
                  setShowSuccessModal(true);

                  // Hide success modal and navigate after 2 seconds
                  setTimeout(async () => {
                    setShowSuccessModal(false);

                    try {
                      const userPostsSnapshot = await firestore()
                        .collection("feed")
                        .where("uid", "==", currentUser.uid)
                        .get();

                      for (const doc of userPostsSnapshot.docs) {
                        await deleteDocAndKnownSubcollections(doc.ref);
                      }

                      await firestore()
                        .collection("users")
                        .doc(currentUser.uid)
                        .delete();
                      await deleteUser(currentUser);
                    } catch (error) {
                      console.log(error);
                    }
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Onboarding" }],
                    });
                  }, 2000);
                }}
              >
                <Text style={styles.deleteButtonText}>Yes, delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.keepAccountButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.keepAccountButtonText}>Keep account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="trash" size={51} color="#22C55E" />
            </View>

            <Text style={styles.successModalTitle}>
              Account deleted successfully
            </Text>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={51} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>
              Oh no! You're leaving... Are you sure?
            </Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={async () => {
                  setShowLogoutModal(false);

                  // Show success modal immediately
                  setShowLogoutSuccessModal(true);

                  // Hide success modal and navigate after 2 seconds
                  setTimeout(async () => {
                    setShowLogoutSuccessModal(false);
                    try {
                      await signOut(newAuth);
                      await GoogleSignin.signOut();
                    } catch (error) {
                      console.log(error);
                    }
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Onboarding" }],
                    });
                  }, 2000);
                }}
              >
                <Text style={styles.confirmLogoutButtonText}>
                  Yes, log me out
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stayLoggedInButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.stayLoggedInButtonText}>
                  No, keep me in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Success Modal */}
      <Modal
        visible={showLogoutSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="thumbs-up" size={51} color="#22C55E" />
            </View>

            <Text style={styles.successModalTitle}>
              You have successfully logged out
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(126, 228, 203, 1)",
    borderRadius: "50%",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontFamily: fonts.fontSemiBold,
    fontSize: 20,
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 10,
    color: "rgba(248, 248, 248, 0.8)",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(126, 228, 203, 0.8)",
    borderRadius: 20,
    height: 33,
    width: 176,
    borderWidth: 2,
    borderColor: "rgba(126, 228, 203, 1)",
  },
  verifiedText: {
    fontFamily: fonts.fontSemiBold,
    color: "white",
    fontSize: 15,
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.fontBold,
    fontSize: 15,
    color: "#fff",
    marginLeft: 8,
  },
  infoItem: {
    backgroundColor: "rgba(126, 228, 203, 0.3)",
    borderRadius: 5,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "rgba(126, 228, 203, 1)",
    flexDirection: "row",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontFamily: fonts.fontSemiBold,
    fontSize: 15,
    color: "#fff",
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: fonts.fontSemiBold,
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
  },
  actionItem: {
    marginBottom: 0,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(126, 228, 203, 0.4)",
  },
  logoutText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  deleteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deleteText: {
    fontFamily: fonts.fontSemiBold,
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  disclaimer: {
    paddingHorizontal: 55,
    paddingBottom: 24,
    marginTop: "auto",
  },
  disclaimerText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 1)",
    fontFamily: fonts.fontRegular,
    textAlign: "center",
    lineHeight: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  trashIconContainer: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.fontSemiBold,
    color: "#000",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "rgba(255, 33, 4, 0.3)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(228, 126, 126, 1)",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    lineHeight: 19,
    fontFamily: fonts.fontSemiBold,
  },
  keepAccountButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  keepAccountButtonText: {
    color: "rgba(126, 228, 203, 1)",
    lineHeight: 19,
    fontFamily: fonts.fontSemiBold,
  },
  // Success Modal styles
  successModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 330,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successModalTitle: {
    fontSize: 25,
    fontFamily: fonts.fontSemiBold,
    color: "#000",
    textAlign: "center",
    lineHeight: 24,
  },
  // Logout Modal styles
  logoutIconContainer: {
    marginBottom: 24,
  },
  confirmLogoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 33, 4, 0.3)",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(228, 126, 126, 1)",
    justifyContent: "center",
  },
  confirmLogoutButtonText: {
    color: "#fff",
    fontFamily: fonts.fontSemiBold,
    lineHeight: 19,
  },
  stayLoggedInButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  stayLoggedInButtonText: {
    color: "rgba(126, 228, 203, 1)",
    fontSize: 15,
    fontFamily: fonts.fontSemiBold,
  },
});

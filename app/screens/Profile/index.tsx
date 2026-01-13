import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useProfileData } from "./hooks/useProfileData";
import { ProfileStatsCard } from "./components/profileStatsCard";
import { FloatingActionButtons } from "@/components/FloatingActionButtons";
import { GiveAppreciationModal } from "./components/giveAppreciationModal";
import { GiftColleaguesModal } from "./components/giftColleaguesModal";
import { IMG_URL, formatNumber, formatDate, getInitials } from "@/lib/utils";
import SideDrawer from "@/components/SideDrawer";

export default function ProfileScreen() {
  const {
    currentUser,
    userPoints,
    totalApprovedPoints,
    givenAppreciations,
    receivedAppreciations,
    recognitions,
    transactions,
    loading,
    updateUserProfile,
    uploadProfilePicture,
    loadMoreGiven,
    loadMoreReceived,
    loadMoreRecognitions,
    loadMoreTransactions,
    refetch,
  } = useProfileData();

  const [editMode, setEditMode] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editPersonalEmail, setEditPersonalEmail] = useState("");
  const [editWorkMantra, setEditWorkMantra] = useState("");
  const [editHobbies, setEditHobbies] = useState("");
  const [appreciationTab, setAppreciationTab] = useState<"given" | "received">("given");
  const [refreshing, setRefreshing] = useState(false);
  const [visibleTransactions, setVisibleTransactions] = useState(5);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Modal states
  const [showAppreciationModal, setShowAppreciationModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const givenTotal = givenAppreciations.reduce((sum, app) => sum + (app.points || 0), 0);
  const receivedTotal = receivedAppreciations.reduce((sum, app) => sum + (app.points || 0), 0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const enableEdit = () => {
    setEditMode(true);
    setEditPhoneNumber(currentUser?.phoneNumber || "");
    setEditPersonalEmail(currentUser?.personalEmail || "");
    setEditWorkMantra(currentUser?.workMantra || "");
    setEditHobbies(currentUser?.hobbies || "");
  };

  const saveProfile = async () => {
    try {
      await updateUserProfile({
        phoneNumber: editPhoneNumber,
        personalEmail: editPersonalEmail,
        workMantra: editWorkMantra,
        hobbies: editHobbies,
      });
      setEditMode(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const uri = result.assets[0].uri;
        const file: any = {
          uri,
          type: "image/jpeg",
          name: `profile-${Date.now()}.jpg`,
        };

        await uploadProfilePicture(file);
        Alert.alert("Success", "Profile picture updated");
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to upload image");
      }
    }
  };

  if (loading && !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
              />
        {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setIsDrawerOpen(true)}
          style={styles.menuButton}
          android_ripple={{ color: "#f3f4f6" }}
        >
          <Ionicons name="menu-outline" size={22} color="#374151" />
        </Pressable>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <Pressable onPress={pickImage}>
            <Image
              source={{
                uri: currentUser?.profileImageUrl
                  ? IMG_URL.imgUrl + currentUser.profileImageUrl
                  : "https://via.placeholder.com/100",
              }}
              style={styles.profileImage}
            />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </Pressable>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {currentUser?.firstName} {currentUser?.lastName}
            </Text>
            <Text style={styles.userPosition}>{currentUser?.position}</Text>

            <View style={styles.userMeta}>
              <Text style={styles.metaText}>{currentUser?.unit}</Text>
              <Text style={styles.metaText}>{currentUser?.locationName}</Text>
              <Text style={styles.metaText}>Joined 2019</Text>
            </View>

            {/* Editable Fields */}
            {editMode ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  placeholder="Phone Number"
                  value={editPhoneNumber}
                  onChangeText={setEditPhoneNumber}
                />
                <TextInput
                  style={styles.editInput}
                  placeholder="Personal Email"
                  value={editPersonalEmail}
                  onChangeText={setEditPersonalEmail}
                />
                <TextInput
                  style={styles.editInput}
                  placeholder="Work Mantra"
                  value={editWorkMantra}
                  onChangeText={setEditWorkMantra}
                />
                <TextInput
                  style={styles.editInput}
                  placeholder="Hobbies"
                  value={editHobbies}
                  onChangeText={setEditHobbies}
                />
                <View style={styles.editButtons}>
                  <Pressable style={styles.saveButton} onPress={saveProfile}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </Pressable>
                  <Pressable style={styles.cancelButton} onPress={() => setEditMode(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.profileDetails}>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Phone: </Text>
                  {currentUser?.phoneNumber || "N/A"}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Email: </Text>
                  {currentUser?.personalEmail || "N/A"}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Mantra: </Text>
                  {currentUser?.workMantra || "N/A"}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Hobbies: </Text>
                  {currentUser?.hobbies || "N/A"}
                </Text>
                <Pressable onPress={enableEdit} style={styles.editIconButton}>
                  <Ionicons name="create-outline" size={24} color="#2563EB" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ProfileStatsCard
              title="My Balance"
              value={formatNumber(userPoints)}
              icon="star"
              gradientColors={["#EFF6FF", "#FFFFFF"]}
              borderColor="#2563EB"
            />
          </View>
          <View style={styles.statCard}>
            <ProfileStatsCard
              title="Cash Gifts Received"
              value={formatNumber(receivedTotal)}
              icon="trophy"
              gradientColors={["#F0FDF4", "#FFFFFF"]}
              borderColor="#000000"
            />
          </View>
          <View style={styles.statCard}>
            <ProfileStatsCard
              title="Cash Gift Shared"
              value={formatNumber(givenTotal)}
              icon="heart"
              gradientColors={["#FFF7ED", "#FFFFFF"]}
              borderColor="#F97316"
            />
          </View>
          <View style={styles.statCard}>
            <ProfileStatsCard
              title="Total Points Received"
              value={totalApprovedPoints.toString()}
              subtitle="1 point = ₦10,000"
              icon="gift"
              gradientColors={["#EFF6FF", "#FFFFFF"]}
              borderColor="#2563EB"
            />
          </View>
        </View>

        {/* Recent Recognitions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="trophy" size={20} color="#2563EB" /> Recent Appreciations Received
          </Text>

          {recognitions.length === 0 ? (
            <Text style={styles.emptyText}>No recognitions yet</Text>
          ) : (
            <>
              {recognitions.map((recognition, index) => (
                <View key={index} style={styles.recognitionCard}>
                  <View style={styles.recognitionAvatar}>
                    <Text style={styles.avatarInitials}>
                      {getInitials(recognition.giverFullName)}
                    </Text>
                  </View>
                  <View style={styles.recognitionContent}>
                    <Text style={styles.recognitionText}>
                      <Text style={styles.boldText}>{recognition.giverFullName}</Text>
                      {" gave you a "}
                      <Text style={styles.highlightText}>{recognition.awardName}</Text>
                      {" award"}
                    </Text>
                    <Text style={styles.recognitionMessage}>
                      <Text style={styles.boldText}>Message: </Text>
                      {recognition.message}
                    </Text>
                    <Text style={styles.recognitionDate}>
                      {formatDate(recognition.date)}
                    </Text>
                  </View>
                </View>
              ))}

              <Pressable style={styles.viewMoreButton} onPress={loadMoreRecognitions}>
                <Text style={styles.viewMoreText}>View More Appreciations</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Point Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="time" size={20} color="#2563EB" /> Point Transaction History
          </Text>

          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet</Text>
          ) : (
            <>
              {transactions.slice(0, visibleTransactions).map((tx, index) => (
                <View key={index} style={styles.transactionRow}>
                  <View style={styles.transactionLeft}>
                    <Text style={styles.transactionDate}>
                      {formatDate(tx.createdDate)}
                    </Text>
                    <View
                      style={[
                        styles.transactionBadge,
                        tx.transactionType === "Appreciation Earned" && styles.badgeGreen,
                        tx.transactionType === "Gift Given" && styles.badgeOrange,
                      ]}
                    >
                      <Text style={styles.badgeText}>{tx.transactionType}</Text>
                    </View>
                    <Text style={styles.transactionDesc}>{tx.description}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      tx.amount > 0 ? styles.amountPositive : styles.amountNegative,
                    ]}
                  >
                    {tx.amount > 0 ? "+" : "-"}
                    {formatNumber(Math.abs(tx.amount))}
                  </Text>
                </View>
              ))}

              {visibleTransactions < transactions.length && (
                <Pressable
                  style={styles.viewMoreButton}
                  onPress={() => {
                    if (visibleTransactions >= transactions.length) {
                      loadMoreTransactions();
                    } else {
                      setVisibleTransactions((prev) => prev + 5);
                    }
                  }}
                >
                  <Text style={styles.viewMoreText}>View More Transactions</Text>
                </Pressable>
              )}
            </>
          )}
        </View>

        {/* Appreciation Tabs */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, appreciationTab === "given" && styles.tabActive]}
              onPress={() => setAppreciationTab("given")}
            >
              <Text
                style={[styles.tabText, appreciationTab === "given" && styles.tabTextActive]}
              >
                Cash Gift Shared
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, appreciationTab === "received" && styles.tabActive]}
              onPress={() => setAppreciationTab("received")}
            >
              <Text
                style={[
                  styles.tabText,
                  appreciationTab === "received" && styles.tabTextActive,
                ]}
              >
                Cash Gift Received
              </Text>
            </Pressable>
          </View>

          {appreciationTab === "given" ? (
            <>
              {givenAppreciations.length === 0 ? (
                <Text style={styles.emptyText}>No cash gifts shared yet</Text>
              ) : (
                <>
                  {givenAppreciations.map((app, index) => (
                    <View key={index} style={styles.appreciationCard}>
                      <Text style={styles.appreciationName}>To: {app.receiverFullName}</Text>
                      <Text style={styles.appreciationMessage}>{app.message}</Text>
                      <Text style={styles.appreciationMeta}>
                        Amount: {formatNumber(app.points)} | {formatDate(app.createdDate)}
                      </Text>
                    </View>
                  ))}
                  <Pressable style={styles.viewMoreButton} onPress={loadMoreGiven}>
                    <Text style={styles.viewMoreText}>View More Cash Gifts Shared</Text>
                  </Pressable>
                </>
              )}
            </>
          ) : (
            <>
              {receivedAppreciations.length === 0 ? (
                <Text style={styles.emptyText}>No cash gifts received yet</Text>
              ) : (
                <>
                  {receivedAppreciations.map((app, index) => (
                    <View key={index} style={styles.appreciationCard}>
                      <Text style={styles.appreciationName}>
                        From: {app.giverFullName || app.giverEMail}
                      </Text>
                      <Text style={styles.appreciationMessage}>{app.message}</Text>
                      <Text style={styles.appreciationMeta}>
                        Amount: {formatNumber(app.points)} | {formatDate(app.createdDate)}
                      </Text>
                    </View>
                  ))}
                  <Pressable style={styles.viewMoreButton} onPress={loadMoreReceived}>
                    <Text style={styles.viewMoreText}>View More Cash Gifts Received</Text>
                  </Pressable>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        actions={[
          {
            icon: "gift-outline",
            label: "Redeem Rewards",
            color: "#10B981",
            onPress: () => router.push("/rewards"),
          },
          {
            icon: "trophy-outline",
            label: "Give Appreciation",
            color: "#F59E0B",
            onPress: () => setShowAppreciationModal(true),
          },
          {
            icon: "card-outline",
            label: "Gift to Colleagues",
            color: "#8B5CF6",
            onPress: () => setShowGiftModal(true),
          },
        ]}
      />

      {/* Modals */}
      <GiveAppreciationModal
        visible={showAppreciationModal}
        onClose={() => setShowAppreciationModal(false)}
        onSuccess={() => {
          refetch();
          Alert.alert("Success", "Appreciation sent!");
        }}
      />

      <GiftColleaguesModal
        visible={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        onSuccess={() => {
          refetch();
          Alert.alert("Success", "Gift sent!");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  /* HEADER */
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 8,
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerRightSpacer: {
    width: 40,
  },
  headerCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 4,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  userPosition: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 2,
  },
  userMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  editContainer: {
    marginTop: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 13,
  },
  editButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  profileDetails: {
    marginTop: 12,
  },
  detailText: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#111827",
  },
  editIconButton: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: "48%",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  recognitionCard: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  recognitionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },
  recognitionContent: {
    flex: 1,
  },
  recognitionText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "600",
    color: "#111827",
  },
  highlightText: {
    fontWeight: "600",
    color: "#2563EB",
  },
  recognitionMessage: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  recognitionDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  transactionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: "#F3F4F6",
  },
  badgeGreen: {
    backgroundColor: "#D1FAE5",
  },
  badgeOrange: {
    backgroundColor: "#FFEDD5",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  transactionDesc: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  amountPositive: {
    color: "#10B981",
  },
  amountNegative: {
    color: "#EF4444",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    padding: 20,
  },
  viewMoreButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  viewMoreText: {
    color: "#fff",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
  },
  appreciationCard: {
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
  },
  appreciationName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  appreciationMessage: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  appreciationMeta: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});
import { StyleSheet } from "react-native";
import { Colors } from "./colors";

export const popupStyles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 52,
    gap: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    backgroundColor: Colors.darkPrimary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 100,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 4,
    borderColor: Colors.secondary,
    borderWidth: 0.2,
    shadowColor: Colors.secondaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8, // for Android glow effect
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    color: Colors.white,
    fontWeight: "600",
  },
  detailsContainer: {
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    borderColor: Colors.secondary,
    borderWidth: 0.2,
    shadowColor: Colors.secondaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8, // for Android glow effect
  },

  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 160,
    borderRadius: 10,
    borderColor: Colors.secondary,
    borderWidth: 0.2,
    shadowColor: Colors.secondaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8, // for Android glow effect
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  activityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bar,
    padding: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  badges: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  barName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  location: { color: Colors.secondary, marginBottom: 8 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 2,
  },
  buttonRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  checkInButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  checkedInButton: {
    backgroundColor: Colors.green,
  },
  shareButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  infoBox: {
    marginTop: 12,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 6,
  },
  infoText: { fontSize: 12, color: "#FFF" },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  buttonEnabled: {
    backgroundColor: Colors.secondary,
  },
  buttonDisabled: {
    backgroundColor: "#b0b0b0ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  buttonTextDisabled: {
    color: "#000",
  },
  buttonTextCheckedIn: {
    color: "#ffffffc8",
  },
});

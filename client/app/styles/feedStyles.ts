import { StyleSheet } from "react-native";
import { Colors } from "./colors";

export const feedStyles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  liveIndicatorText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
    marginRight: 10,
  },
  liveBadge: {
    backgroundColor: "#e63946",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  liveBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "#2a2d31",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#555",
    marginRight: 8,
  },
  usernameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  postTime: {
    color: "#aaa",
    fontSize: 12,
  },
  postContent: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  reactionCount: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 4,
  },
  deleteIconButton: {
    padding: 5,
  },
  createPostButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  createPostButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  postFormContainer: {
    backgroundColor: "#2a2d31",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  postInput: {
    backgroundColor: "#1f2227",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: "#6b3fd1ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noPostsText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

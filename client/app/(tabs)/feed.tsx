import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Post {
  id: number;
  content: string;
  time: number;
  likes: number;
  userReaction: "none" | "like";
  username: string;
}

export default function FeedScreen() {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [timeRefresh, setTimeRefresh] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRefresh((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeAgo = (time: number) => {
    const diffMinutes = Math.floor((Date.now() - time) / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes === 1) return "1m ago";
    return `${diffMinutes}m ago`;
  };

  const handleCreatePress = () => {
    if (!isCheckedIn) {
      Alert.alert(
        "Check-in required",
        "Please check in to the event/bar before posting."
      );
      return;
    }
    setShowCreateBox(!showCreateBox);
  };

  const handlePost = () => {
    if (!newPost.trim()) {
      Alert.alert("Empty post", "Please enter some content before posting.");
      return;
    }

    const newItem: Post = {
      id: Date.now(),
      content: newPost.trim(),
      time: Date.now(),
      likes: 0,
      userReaction: "none",
      username: "User123", // Placeholder username
    };

    setPosts([newItem, ...posts]);
    setNewPost("");
    setShowCreateBox(false);
  };

  const handleDeletePost = (postId: number) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setPosts(posts.filter((post) => post.id !== postId));
        },
      },
    ]);
  };

  const handleReaction = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.userReaction === "like";
          return {
            ...post,
            // Toggle like count: -1 if already liked, +1 if not
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            // Toggle reaction state: 'none' if liked, 'like' if not
            userReaction: isLiked ? "none" : "like",
          };
        }
        return post;
      })
    );
  };

  const getHeartIconName = (reaction: "none" | "like") => {
    // Return solid heart if liked, outline heart otherwise
    return reaction === "like" ? "heart" : "heart-outline";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createPostButton}
        onPress={handleCreatePress}
      >
        <Text style={styles.createPostButtonText}>
          {showCreateBox ? "Cancel" : "Create Post"}
        </Text>
      </TouchableOpacity>

      {showCreateBox && (
        <View style={styles.postFormContainer}>
          <TextInput
            style={styles.postInput}
            placeholder="What's happening?"
            placeholderTextColor="#aaa"
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {posts.length === 0 ? (
        <Text style={styles.noPostsText}>
          No posts yet. Be the first to share!
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <View style={styles.userTimeRow}>
                <Text style={styles.usernameText}>{item.username}</Text>
                <Text style={styles.postTime}>{getTimeAgo(item.time)}</Text>
              </View>

              <Text style={styles.postContent}>{item.content}</Text>

              <View style={styles.postFooter}>
                <TouchableOpacity
                  style={styles.reactionButton}
                  onPress={() => handleReaction(item.id)}
                >
                  <Ionicons
                    name={getHeartIconName(item.userReaction)}
                    size={22}
                    color={item.userReaction === "like" ? "#e63946" : "#aaa"}
                  />
                  <Text
                    style={[
                      styles.reactionCount,
                      {
                        color:
                          item.userReaction === "like" ? "#e63946" : "#fff",
                      },
                    ]}
                  >
                    {item.likes > 0 ? item.likes : ""}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteIconButton}
                  onPress={() => handleDeletePost(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#aaa" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1d1f",
    paddingHorizontal: 16,
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
  usernameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
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
    backgroundColor: "#4e9af1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 0,
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
    backgroundColor: "#5669ff",
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

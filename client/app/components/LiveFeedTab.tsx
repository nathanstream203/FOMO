import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { feedStyles } from "../styles/feedStyles"; // adjust path as needed

interface Post {
  id: number;
  content: string;
  time: number;
  likes: number;
  userReaction: "none" | "like";
  username: string;
}

const getTimeAgo = (time: number) => {
  const diffMinutes = Math.floor((Date.now() - time) / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes === 1) return "1m ago";
  return `${diffMinutes}m ago`;
};

const LiveFeedTab: React.FC<{ isCheckedIn: boolean }> = ({ isCheckedIn }) => {
  // ...component code...
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [timeRefresh, setTimeRefresh] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRefresh((prev) => prev + 1);
    }, 60000);
  }, []);
  const handleCreatePress = () => {
    // if (!isCheckedIn) {
    //   Alert.alert(
    //     "Check-in required",
    //     "Please check in to the event/bar before posting."
    //   );
    //   return;
    // }
    setShowCreateBox(!showCreateBox);
  };
  const handlePost = () => {
    if (!newPost.trim()) {
      Alert.alert("Empty Post", "Please enter some content.");
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
      { text: "Cancel", style: "cancel" },
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
    //if (!isCheckedIn) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.userReaction === "like";
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            userReaction: isLiked ? "none" : "like",
          };
        }
        return post;
      })
    );
  };
  const getHeartIconName = (reaction: "none" | "like") => {
    return reaction === "like" ? "heart" : "heart-outline";
  };
  return (
    <View style={feedStyles.feedContainer}>
      <TouchableOpacity
        style={feedStyles.createPostButton}
        onPress={handleCreatePress}
      >
        <Text style={feedStyles.createPostButtonText}>
          {showCreateBox ? "Cancel" : "Create Post"}
        </Text>
      </TouchableOpacity>
      {/* Post Form - Only visible if checked in and active */}
      {showCreateBox && (
        <View style={feedStyles.postFormContainer}>
          <TextInput
            style={feedStyles.postInput}
            placeholder="What's happening?"
            placeholderTextColor="#aaa"
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <TouchableOpacity style={feedStyles.postButton} onPress={handlePost}>
            <Text style={feedStyles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
      {posts.length > 0 && (
        <View style={feedStyles.liveIndicator}>
          <Ionicons name="flame" size={20} color="#e63946" />
          <Text style={feedStyles.liveIndicatorText}>
            {posts.length} post{posts.length > 1 ? "s" : ""} live
          </Text>
          <View style={feedStyles.liveBadge}>
            <Text style={feedStyles.liveBadgeText}>Live</Text>
          </View>
        </View>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <Text style={feedStyles.noPostsText}>
          No posts yet. Be the first to share!
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString() + timeRefresh}
          renderItem={({ item }) => (
            <View style={feedStyles.postCard}>
              <View style={feedStyles.userTimeRow}>
                {/* Placeholder for User Avatar */}
                <View style={feedStyles.avatarPlaceholder} />
                <View>
                  <Text style={feedStyles.usernameText}>{item.username}</Text>
                  <Text style={feedStyles.postTime}>
                    {getTimeAgo(item.time)}
                  </Text>
                </View>
              </View>

              <Text style={feedStyles.postContent}>{item.content}</Text>

              <View style={feedStyles.postFooter}>
                {/* Reaction button */}
                <TouchableOpacity
                  style={feedStyles.reactionButton}
                  onPress={() => handleReaction(item.id)}
                  //disabled={!isCheckedIn} - for later
                >
                  <Ionicons
                    name={getHeartIconName(item.userReaction)}
                    size={22}
                    color={item.userReaction === "like" ? "#e63946" : "#aaa"}
                  />
                  <Text
                    style={[
                      feedStyles.reactionCount,
                      {
                        color:
                          item.userReaction === "like" ? "#e63946" : "#fff",
                      },
                    ]}
                  >
                    {item.likes > 0 ? item.likes : ""}
                  </Text>
                </TouchableOpacity>
                {/* Delete button */}
                {
                  <TouchableOpacity
                    style={feedStyles.deleteIconButton}
                    onPress={() => handleDeletePost(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#aaa" />
                  </TouchableOpacity>
                }
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default LiveFeedTab;

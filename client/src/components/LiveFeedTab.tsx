import React, { useState, useEffect, use } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { feedStyles } from "../styles/feedStyles";
import { useCurrentFirstName } from "../hooks/useCurrentUserInfo";
import { useCurrentUserId } from "../hooks/useCurrentUserInfo";
import {
  deletePost,
  getPostsByBarId,
  getPostsByPartyId,
  postNewPost,
} from "../../src/api/databaseOperations";
import { getAToken } from "../../src/tokenStorage";
import { auth } from "../../src/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface Post {
  id: number;
  content: string;
  time: number;
  likes: number;
  userReaction: "none" | "like";
  username: string;
  user_id: number;
}

// Utility to convert ISO date string from DB to milliseconds
const convertTimestampToMs = (timestamp: string): number => {
  return new Date(timestamp).getTime();
};

const getTimeAgo = (time: number) => {
  const diffMinutes = Math.floor((Date.now() - time) / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes === 1) return "1m ago";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "1h ago";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

interface LiveFeedTabProps {
  isCheckedIn: boolean;
  barId?: number; // The ID of the currently active bar/event
  partyId?: number; // The ID of the currently active party
}

const LiveFeedTab: React.FC<LiveFeedTabProps> = ({
  isCheckedIn,
  barId,
  partyId,
}) => {
  const { currentUserFirstName } = useCurrentFirstName();
  const { currentUserId, isUserIdLoading } = useCurrentUserId();
  const [firebaseUser] = useAuthState(auth); // Get current Firebase user
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRefresh, setTimeRefresh] = useState(0);

  const fetchPosts = async (feedType: "bar" | "party", id: number) => {
    setLoading(true);
    try {
      const JWT_token = await getAToken();

      // Call the appropriate backend function
      const dbPosts =
        feedType === "bar"
          ? await getPostsByBarId(id, JWT_token)
          : await getPostsByPartyId(id, JWT_token);

      console.log(`${feedType.toUpperCase()} POSTS RESPONSE:`, dbPosts);

      if (!Array.isArray(dbPosts)) {
        setPosts([]);
        return;
      }

      // Format posts
      const formattedPosts = dbPosts
        .filter((post) =>
          feedType === "party" ? post.party_id != null : post.bar_id != null
        )
        .map((post) => ({
          id: post.id,
          content: post.content,
          time: convertTimestampToMs(post.timestamp),
          username: post.first_name || "User",
          likes: post.likes ?? 0,
          userReaction: post.userReaction ?? null,
          user_id: post.user_id,
        }));

      formattedPosts.sort((a, b) => b.time - a.time);

      setPosts(formattedPosts);
    } catch (err) {
      console.error(`Error fetching ${feedType} feed posts:`, err);
      Alert.alert("Error", "Failed to load feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Data Fetch (on barId change)
  useEffect(() => {
    if (partyId) {
      fetchPosts("party", partyId);
    } else if (barId) {
      fetchPosts("bar", barId);
    } else {
      setPosts([]);
    }
  }, [barId, partyId]);

  // 2. Time Refresh for '... ago' display
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRefresh((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCreatePress = () => {
    if (!isCheckedIn) {
      Alert.alert(
        "Check-in required",
        "Please check in to the event/bar before posting."
      );
      return;
    }
    if (isUserIdLoading || currentUserId === null) {
      Alert.alert(
        "Authentication Error",
        "User data is still loading or unavailable."
      );
      return;
    }
    setShowCreateBox(!showCreateBox);
  };

  // 3. Post to Database
  const handlePost = async () => {
    if (!newPost.trim())
      return Alert.alert("Empty Post", "Please enter some content.");

    const user_id = currentUserId;
    if (!user_id || isUserIdLoading)
      return Alert.alert("Error", "User data not ready.");

    try {
      const JWT_token = await getAToken();
      const content = newPost.trim();
      const timestamp = new Date().toISOString();

      // Send the right ID based on feed type
      await postNewPost(
        user_id,
        barId ?? null,
        partyId ?? null,
        content,
        timestamp,
        JWT_token
      );

      setNewPost("");
      setShowCreateBox(false);

      // Refresh feed
      if (barId) await fetchPosts("bar", barId);
      else if (partyId) await fetchPosts("party", partyId);
    } catch (error) {
      console.error("Failed to post:", error);
      Alert.alert("Post Failed", "Could not submit post to the server.");
    }
  };

  const handleReaction = (postId: number) => {
    if (!isCheckedIn) {
      Alert.alert("Check-in required", "You must be checked in to react.");
      return;
    }

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

  const handleDeletePost = (postId: number) => {
    // Find the post in state
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Only allow deletion if current user owns the post
    if (post.user_id !== currentUserId) {
      Alert.alert("Unauthorized", "You can only delete your own posts.");
      return;
    }

    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await getAToken();
            await deletePost(postId, currentUserId, token);

            // Remove from frontend state
            setPosts((prev) => prev.filter((p) => p.id !== postId));
          } catch (err: any) {
            console.error("Failed to delete post:", err);
            Alert.alert("Delete Failed", err.message);
          }
        },
      },
    ]);
  };

  const getHeartIconName = (reaction: "none" | "like") => {
    return reaction === "like" ? "heart" : "heart-outline";
  };

  return (
    <View style={feedStyles.feedContainer}>
      {/* Create Post Button & Form */}
      {isCheckedIn && (
        <>
          <TouchableOpacity
            style={[
              feedStyles.createPostButton,
              { backgroundColor: showCreateBox ? "#FE4A49" : "#8b5cf6" },
            ]}
            onPress={handleCreatePress}
            // Add visual indication if loading or posting
            disabled={loading}
          >
            <Text style={feedStyles.createPostButtonText}>
              {showCreateBox ? "Cancel" : "Create Post"}
            </Text>
          </TouchableOpacity>

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
              <TouchableOpacity
                style={feedStyles.postButton}
                onPress={handlePost}
              >
                <Text style={feedStyles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Live Indicator */}
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

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#a388f6"
          style={{ marginVertical: 20 }}
        />
      )}

      {/* Posts List */}
      {!loading && posts.length === 0 ? (
        <Text style={feedStyles.noPostsText}>
          No posts yet. Be the first to share!
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
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
                <TouchableOpacity
                  style={feedStyles.reactionButton}
                  onPress={() => handleReaction(item.id)}
                >
                  <Ionicons
                    name={getHeartIconName(item.userReaction)}
                    size={22}
                    color={
                      item.userReaction === "like"
                        ? "#e63946"
                        : isCheckedIn
                        ? "#a388f6"
                        : "#a488f640" // Less visible if not checked in
                    }
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
                {/* Only show delete button if the user is the post owner*/}
                {item.user_id === currentUserId && (
                  <TouchableOpacity
                    style={feedStyles.deleteIconButton}
                    onPress={() => handleDeletePost(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#a388f6" />
                  </TouchableOpacity>
                )}
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

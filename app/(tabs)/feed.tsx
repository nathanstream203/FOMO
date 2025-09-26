import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../theme';


export default function FeedScreen() {
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handlePost = () => {
    if (input.trim().length > 0) {
      setComments(prev => [input.trim(), ...prev]);
      setInput('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Feed List */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentText}>{item}</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, justifyContent: comments.length ? 'flex-start' : 'center' }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
        }
      />

      {/* Input + Post button */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a comment..."
          placeholderTextColor={Colors.text}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  comment: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.text,
  },
  commentText: {
    color: Colors.white,
  },
  emptyText: {
    color: Colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.text,
    padding: 8,
    backgroundColor: Colors.primary,
  },
  input: {
    flex: 1,
    color: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.grey,
  },
  postButton: {
    marginLeft: 8,
    backgroundColor: Colors.button,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  postText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

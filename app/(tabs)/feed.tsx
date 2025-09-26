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
          placeholderTextColor="#999"
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
    backgroundColor: '#25292e',
  },
  comment: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  commentText: {
    color: '#fff',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#444',
    padding: 8,
    backgroundColor: '#1c1c1c',
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  postButton: {
    marginLeft: 8,
    backgroundColor: '#5568fe',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  postText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

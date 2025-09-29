import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../theme';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});

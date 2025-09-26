import { Image, StyleSheet, View } from 'react-native';

const PlaceholderImage = require('@/assets/images/background-image.jpg');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
  },
});

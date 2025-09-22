import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import { StyleSheet, View } from "react-native";

const PlacehodlerImage = require("@/assets/images/background-image.png");

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlacehodlerImage}/>
      </View>
      <View style={styles.footerContainer}>
        <Button label="Choose a Photo" />
        <Button label="Use this Photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex : 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
   footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});

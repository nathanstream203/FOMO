import { StyleSheet, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { Colors } from '../theme';
import {Stack} from 'expo-router';


export default function HomeScreen() {
  return (
      <View style={styles.container}>
          <Stack.Screen options={{headerShown: false}} />
          <MapView
              style={styles.map}
              initialRegion={{
                  latitude: 44.872394,
                  longitude: -91.925203,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
              }}
          >
              <Marker coordinate={{latitude: 44.872394, longitude: -91.925203}}/>
          </MapView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
    map: {
      width: '100%', height: '100%',
    }
});

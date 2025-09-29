import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { Colors } from '../theme';


export default function HomeScreen() {
const circleRadius = 5000;

  return (
      <View style={styles.container}>
          <Stack.Screen options={{headerShown: false}} />
          <MapView
              style={styles.map}
              customMapStyle={mapStyle}
              initialRegion={{
                  latitude: 44.872394,
                  longitude: -91.925203,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
              }}
          >
            <Circle
            center={{
              latitude: 44.872394,
              longitude: -91.925203,
            }}
            radius={5000}
            strokeWidth={2}
            strokeColor={'#1a66ff'}

            />

              <Marker coordinate={{latitude: 44.878091740523985, longitude: -91.92843302663482}}/>
              <Marker coordinate={{latitude: 44.87805290393327, longitude: -91.92962985786905}}/>
              <Marker coordinate={{latitude: 44.87720510396106, longitude: -91.92994142428837}}/>
              <Marker coordinate={{latitude: 44.87705427213555, longitude: -91.92993748257626}}/>
              <Marker coordinate={{latitude:44.87639168428689, longitude: -91.92544797922613}}/>
              <Marker coordinate={{latitude: 44.87663124956, longitude: -91.92667921682191}}/>
              


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

const mapStyle = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
];

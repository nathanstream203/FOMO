// app/(tabs)/index.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { auth } from '../(logon)/firebaseConfig';
import markerData from '../markers.json';
import NotVerified from '../notverified';
import { Colors } from '../theme';
// import { Location, defaultLocation } from "../utils/location";



export default function HomeScreen() {
  const [user, loading, error] = useAuthState(auth);

  if (!user?.emailVerified) {
    return <NotVerified />;
  }
  
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
              minZoomLevel={14}
              maxZoomLevel={18}


          >
            <Circle
            center={{
              latitude: 44.872394,
              longitude: -91.925203,
            }}
            radius={circleRadius}
            strokeWidth={2}
            strokeColor={Colors.primary}

            />

              {markerData.map((marker, index) => {
                  const backgroundColor =
                  marker.icon === 'beer-outline'
                  ? Colors.primary // lighter color for houses
                  : Colors.secondary;
                  return (
                  <Marker
                      key={index}
                      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                      title={marker.title}
                  >

                      {marker.icon && (
                          <View
                              style={{
                                  backgroundColor,
                                  borderRadius: 20,
                                  padding: 8,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                              }}

                          >
                              <Ionicons
                                  name={marker.icon as any}
                                  size={20}
                                  color="white"
                              />
                          </View>
                      )}

                  </Marker>
                  );
              })}
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

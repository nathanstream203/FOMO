import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import markerData from '../markers.json';
import { Colors } from '../theme';
// import { Location, defaultLocation } from "../utils/location";



export default function HomeScreen() {
const [activeMarker, setActiveMarker] = useState<any | null>(null);
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
                      onPress={() => setActiveMarker(marker)}
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

          {activeMarker && (
            <View style={popupStyles.container}>
              <View style={popupStyles.row}>
                <Text style={popupStyles.title}>{activeMarker.title}</Text>

                <TouchableOpacity
                  onPress={() => setActiveMarker(null)}
                  style={popupStyles.closeButton}
                >
                  <Ionicons name="close" size={20} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={popupStyles.description}>{activeMarker.description}</Text>
              </View>
          )}
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

const popupStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
  },
  closeButton: {
    position: 'absolute',
    right: 6,
    top: -2,
    padding: 6,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  }
});

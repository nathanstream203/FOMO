import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';


import Ionicons from '@expo/vector-icons/Ionicons';
import markerData from '../markers.json';
import { Colors } from '../theme.js';
// import { Location, defaultLocation } from "../utils/location";

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function HomeScreen() {
const circleRadius = 5000;
const [region, setRegion] = useState<any>(null);
const [nearbyBar, setNearbyBar] = useState<any>(null);
const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);


// Request location permission
    useEffect(() => {
        let subscription: Location.LocationSubscription;

        const startTracking = async () => {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Cannot access location.');
                return;
            }

            // Get initial location
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            // Log initial coordinates here
            console.log('Initial user location:', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Subscribe to location updates
            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    distanceInterval: 1, // update every 1 meters
                    timeInterval: 1000, // update every 1 seconds
                },
                (newLocation) => {
                    // Log each location update
                    console.log('📍 Location updated:', {
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        timestamp: new Date(newLocation.timestamp).toLocaleTimeString(),
                    });

                    setRegion({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });

                    setLocation({ latitude:newLocation.coords.latitude, longitude: newLocation.coords.longitude });

                    // Check if user is near any bar (~6 meters = 20 feet)
                    const closeBar = markerData.find((bar) => {
                        const distance = getDistanceFromLatLonInMeters(
                            newLocation.coords.latitude,
                            newLocation.coords.longitude,
                            bar.latitude,
                            bar.longitude
                        );
                        return distance <= 10;
                    });
                    setNearbyBar(closeBar || null);

                }
            );
        };

        startTracking();

        // Cleanup subscription when component unmounts
        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    if (!region) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

  return (
      <View style={styles.container}>
          <Stack.Screen options={{headerShown: false}}/>
          {region ? (
              <MapView
                  //provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  customMapStyle={mapStyle}
                  region={region}
                  showsUserLocation={false}
                  followsUserLocation
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

                  {/* Location Markers */}
                  {markerData.map((marker, index) => {
                      const backgroundColor =
                          marker.icon === 'beer-outline'
                              ? Colors.primary // lighter color for houses
                              : Colors.secondary;
                      return (
                          <Marker
                              key={index}
                              coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
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

                  {/* User Marker */}
                  {location && (
                      <Marker
                          coordinate={{
                              latitude: location.latitude,
                              longitude: location.longitude,
                          }}
                          zIndex={9999}
                      >
                          <View
                              style={{
                                  backgroundColor: Colors.blue,
                                  borderRadius: 20,
                                  padding: 3,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderWidth: 2,
                                  borderColor: '#fff',
                              }}
                          >
                              <Ionicons name="person" size={9} color="white" />
                          </View>
                      </Marker>
                  )}
              </MapView>
          ) : null}
          {nearbyBar && (
              <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' }}>
                  <TouchableOpacity
                      style={{
                          backgroundColor: Colors.primary,
                          paddingVertical: 12,
                          paddingHorizontal: 25,
                          borderRadius: 25,
                      }}
                      onPress={() => Alert.alert('Checked in!', `You are at ${nearbyBar.title}`)}
                  >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Check In</Text>
                  </TouchableOpacity>
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
    },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

const mapStyle = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
];

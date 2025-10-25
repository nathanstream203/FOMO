import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { getBars } from '../api/databaseOperations';

import { Colors } from '../theme.js';

interface BarLocation {
  id: string;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  events: Event[];
}

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // meters
  const φ1 = Number(lat1) * Math.PI / 180;
  const φ2 = Number(lat2) * Math.PI / 180;
  const Δφ = (Number(lat2) - Number(lat1)) * Math.PI / 180;
  const Δλ = (Number(lon2) - Number(lon1)) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}


export default function HomeScreen() {
const [activeMarker, setActiveMarker] = useState<any | null>(null);
const circleRadius = 5000;
const [region, setRegion] = useState<any>(null);
const [nearbyBar, setNearbyBar] = useState<any>(null);
const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
const [markers, setMarkers] = useState<BarLocation[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchBars = async () => {
      setLoading(true);
      try {
        const data = await getBars();
        setMarkers(data);

    
        console.log("Fetched bars:", data);
      } catch (err) {
        console.error("Error fetching bars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

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
                    accuracy: Location.Accuracy.Highest,
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
                    const closeBar = markers.find((bar) => {
                        const distance = getDistanceFromLatLonInMeters(
                            newLocation.coords.latitude,
                            newLocation.coords.longitude,
                            bar.latitude,
                            bar.longitude
                        );
                        //Distance to every bar for debugging
                        markers.forEach((bar) => {
                            console.log(`${bar.name}: ${distance.toFixed(2)}m away`);
                        });
                        return distance <= 10;
                    });
                    
                    setNearbyBar(closeBar || null);
                    if (closeBar) {
                    console.log('📍 Nearby ' + closeBar.name);
                    } else {
                    console.log('❌ No nearby bar');
                    }

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
                  {markers.map((marker, index) => {
                      const isActive = activeMarker?.id === marker.id;
                      return (
                          <Marker
                              key={index}
                              coordinate={{latitude: Number(marker.latitude), longitude: Number(marker.longitude)}}
                              title={marker.name}
                              onPress={() => setActiveMarker(marker)}
                              zIndex={isActive ? 999 : 1}
                          >

                              {marker && (
                                  <View
                                      style={{
                                        backgroundColor: isActive ? Colors.secondary : Colors.primary,
                                        borderRadius: 20,
                                        padding: 8, // slightly bigger when selected
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        shadowColor: isActive ? Colors.secondary : 'transparent',
                                        shadowOpacity: isActive ? 0.5 : 0,
                                        shadowRadius: isActive ? 6 : 0,
                                        elevation: isActive ? 8 : 0, // Android shadow
                                      }}

                                  >
                                      <Ionicons
                                          name={'beer-outline'}
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
                          zIndex={99}
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
          {activeMarker && (
          <View style={popupStyles.container}>
            <View style={popupStyles.row}>
              <Text style={popupStyles.title}>{activeMarker.name}</Text>

              <TouchableOpacity
                onPress={() => setActiveMarker(null)}
                style={popupStyles.closeButton}
              >
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={popupStyles.divider} />

            <Text style={popupStyles.description}>
              {activeMarker.address || 'No address available.'}
            </Text>

            <View style={popupStyles.actions}>
              <TouchableOpacity
                style={[
                  popupStyles.button,
                  nearbyBar?.id === activeMarker.id
                    ? popupStyles.buttonEnabled
                    : popupStyles.buttonDisabled,
                ]}
                disabled={nearbyBar?.id !== activeMarker.id}
                onPress={() =>
                  Alert.alert('Checked in!', `You are at ${activeMarker.name}`)
                }
              >
                <Text
                  style={[
                    popupStyles.buttonText,
                    nearbyBar?.id !== activeMarker.id && popupStyles.buttonTextDisabled,
                  ]}
                >
                  {nearbyBar?.id === activeMarker.id ? 'Check In' : 'Too Far!'}
                </Text>
              </TouchableOpacity>
            </View>
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

const popupStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    color: '#444',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#e6e6e6',
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonEnabled: {
    backgroundColor: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonTextDisabled: {
    color: '#eee',
  },
});



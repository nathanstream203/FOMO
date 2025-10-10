//Geolocation
// import { useState, useEffect } from "react";
// import { Platform, PermissionsAndroid, Alert } from "react-native";
// import Geolocation from "@react-native-community/geolocation";
//
// export type Location = {
//     latitude: number;
//     longitude: number;
//     latitudeDelta: number;
//     longitudeDelta: number;
// };
//
// export const defaultLocation: Location = {
//     latitude: 37.78825,
//     longitude: -122.4324,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
// };
//
// export default function App() {
//     const [location, setLocation] = useState<Location | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//
//     const getCurrentLocation = () => {
//         Geolocation.getCurrentPosition(
//             position => {
//                 setLocation({
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                 });
//                 setLoading(false);
//             },
//             (error) => {
//                 Alert.alert(
//                     "Error",
//                     `Failed to get your location: ${error.message}. Make sure your location is enabled.`
//                 );
//                 setLocation(defaultLocation);
//                 setLoading(false);
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//     };
//
//     useEffect(() => {
//         const requestLocationPermission = async () => {
//             if (Platform.OS === "android") {
//                 try {
//                     const granted = await PermissionsAndroid.request(
//                         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//                     );
//                     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                         getCurrentLocation();
//                     } else {
//                         Alert.alert(
//                             "Permission Denied",
//                             "Location permission is required to show your current location on the map."
//                         );
//                         setLocation(defaultLocation);
//                         setLoading(false);
//                     }
//                 } catch (err) {
//                     console.warn(err);
//                     setLocation(defaultLocation);
//                     setLoading(false);
//                 }
//             } else {
//                 getCurrentLocation();
//             }
//         };
//
//         requestLocationPermission();
//     }, []);
//
// };
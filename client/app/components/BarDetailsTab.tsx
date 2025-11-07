import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Bar } from "../types"; // optional: your marker type

interface BarDetailsTabProps {
  activeMarker: Bar;
  nearbyBar?: Bar | null;
  isCheckedIn: boolean;
  handleCheckIn: () => void;
  barImages: Record<string, any>;
  styles: any; // pass popupStyles
}

const BarDetailsTab: React.FC<BarDetailsTabProps> = ({
  activeMarker,
  nearbyBar,
  isCheckedIn,
  handleCheckIn,
  barImages,
  styles,
}) => {
  const canCheckIn = nearbyBar?.id === activeMarker.id || isCheckedIn;

  return (
    <>
      {/* Bar Image & Badges */}
      <View style={styles.imageContainer}>
        <Image
          source={
            barImages[activeMarker.name] ||
            require("../../assets/images/background-image.jpg")
          }
          style={styles.image}
        />
        <View style={styles.badges}>
          <View style={styles.activityBadge}>
            <Ionicons name="people-circle-outline" size={12} color="#FFF" />
            <Text style={styles.badgeText}>100</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Details */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.barName}>{activeMarker.name}</Text>
        <Text style={styles.location}>{activeMarker.address}</Text>

        {/* Info Rows */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={12} color="#7f54e2" />
          <Text style={styles.infoText}>{activeMarker.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={12} color="#7f54e2" />
          <Text style={styles.infoText}>9pm-2am</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="star" size={12} color="#7f54e2" />
          <Text style={styles.infoText}>4.5/5</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people-circle-outline" size={12} color="#7f54e2" />
          <Text style={styles.infoText}>100 checked in</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.checkInButton,
              canCheckIn ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
            disabled={!canCheckIn}
            onPress={handleCheckIn}
          >
            <Text
              style={[
                styles.buttonText,
                !canCheckIn && styles.buttonTextDisabled,
              ]}
            >
              {isCheckedIn
                ? "Checked In!"
                : nearbyBar?.id === activeMarker.id
                ? "Check In"
                : "Too Far!"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default BarDetailsTab;

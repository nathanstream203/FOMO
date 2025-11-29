import React from "react";
import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LiveFeedTab from "./LiveFeedTab";
import BarDetailsTab from "./BarDetailsTab";
import { popupStyles } from "../styles/popupStyles";
import { barImages } from "../barImages.js";

export default function ActiveMarkerPopup({
  activeMarker,
  setActiveMarker,
  activeTab,
  setActiveTab,
  isCheckedIn,
  handleCheckIn,
  nearbyBar,
}: any) {
  if (!activeMarker) return null;

  return (
    <View style={popupStyles.container}>
      <TouchableOpacity
        onPress={() => setActiveMarker(null)}
        style={popupStyles.closeButton}
      >
        <Ionicons name="close" size={20} color="#FFF" />
      </TouchableOpacity>

      <View style={popupStyles.tabContainer}>
        <TouchableOpacity
          style={[
            popupStyles.tabButton,
            activeTab === "details" && popupStyles.activeTab,
          ]}
          onPress={() => setActiveTab("details")}
        >
          <Text style={popupStyles.tabText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            popupStyles.tabButton,
            activeTab === "live" && popupStyles.activeTab,
          ]}
          onPress={() => setActiveTab("live")}
        >
          <Text style={popupStyles.tabText}>Live Feed</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "details" ? (
        <BarDetailsTab
          activeMarker={activeMarker}
          nearbyBar={nearbyBar}
          isCheckedIn={isCheckedIn}
          handleCheckIn={handleCheckIn}
          barImages={barImages}
          styles={popupStyles}
        />
      ) : (
        <LiveFeedTab isCheckedIn={isCheckedIn} barId={activeMarker.id} />
      )}
    </View>
  );
}

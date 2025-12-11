import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { feedStyles } from "../styles/feedStyles";
import { eventStyles } from "../styles/eventStyles";

import { getAToken } from "../../src/tokenStorage";
import {
  getEventsByBarId,
  postNewEvent,
} from "../../src/api/databaseOperations";

interface EventItem {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface BarEventsTabProps {
  barId: number;
}

export default function BarEventsTab({ barId }: BarEventsTabProps) {
  const [showCreateBox, setShowCreateBox] = useState(false);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!barId) return;

    setLoading(true);
    try {
      const token = await getAToken();
      const dbEvents = await getEventsByBarId(barId, token);

      const formatTime = (value: string) => {
        if (!value) return "";

        // Case: full timestamp like "2025-12-10T16:52:00.000Z"
        if (value.includes("T")) {
          const timePart = value.split("T")[1]; // "16:52:00.000Z"
          const [hh, mm] = timePart.split(":");
          return `${hh}:${mm}`;
        }

        // Case: "HH:MM:SS" or "HH:MM"
        if (value.includes(":")) {
          const [hh, mm] = value.split(":");
          return `${hh}:${mm}`;
        }

        return value;
      };

      const formatted = dbEvents.map((ev: any) => ({
        id: ev.id,
        name: ev.title, // correct
        date: ev.event_date, // correct
        startTime: formatTime(ev.start_time), // "HH:MM"
        endTime: formatTime(ev.end_time), // "HH:MM"
      }));

      setEvents(formatted);
    } catch (err) {
      console.error("Error fetching events:", err);
      Alert.alert("Error", "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [barId]);

  const handleCreatePress = () => {
    setShowCreateBox(!showCreateBox);
  };

  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert("Missing Name", "Please enter an event name.");
      return;
    }
    if (!eventDate.trim()) {
      Alert.alert("Missing Date", "Please enter a date.");
      return;
    }
    if (!startTime.trim() || !endTime.trim()) {
      Alert.alert("Missing Time", "Please enter start and end times.");
      return;
    }

    // Format times to ISO string with milliseconds for datetime(3)
    const formatTimeForDB = (timeString: string) => {
      // Split manually instead of using new Date() — safer.
      const [hourStr, minuteStr] = timeString.split(":");

      const hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);

      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        throw new Error("Invalid time format. Use HH:mm");
      }

      const hh = hours.toString().padStart(2, "0");
      const mm = minutes.toString().padStart(2, "0");

      return `${hh}:${mm}:00`; // SQL TIME format
    };

    const formattedStartTime = formatTimeForDB(startTime);
    const formattedEndTime = formatTimeForDB(endTime);

    console.log("Formatted start time:", formattedStartTime);
    console.log("Formatted end time:", formattedEndTime);

    try {
      const token = await getAToken();

      await postNewEvent(
        eventName.trim(),
        eventDate.trim(),
        formattedStartTime,
        formattedEndTime,
        barId,
        token
      );

      setEventName("");
      setEventDate("");
      setStartTime("");
      setEndTime("");
      setShowCreateBox(false);

      await fetchEvents();
    } catch (err) {
      console.error("Create event failed:", err);
      Alert.alert("Error", "Failed to create event.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 250 }}
    >
      {/*button to open/close create form */}
      <View style={feedStyles.feedContainer}>
        <TouchableOpacity
          style={feedStyles.createPostButton}
          onPress={handleCreatePress}
        >
          <Text style={feedStyles.createPostButtonText}>
            {showCreateBox ? "Cancel" : "Create Event"}
          </Text>
        </TouchableOpacity>

        {/* event creation form */}
        {showCreateBox && (
          <View style={feedStyles.postFormContainer}>
            {/*event name*/}
            <TextInput
              style={eventStyles.fullInput}
              placeholder="Event name..."
              placeholderTextColor="#aaa"
              value={eventName}
              onChangeText={setEventName}
            />

            {/* date */}
            <TextInput
              style={eventStyles.fullInput}
              placeholder="Event date (mm/dd/yyyy)"
              placeholderTextColor="#aaa"
              value={eventDate}
              onChangeText={setEventDate}
            />

            {/* start/end time */}
            <View style={eventStyles.row}>
              <TextInput
                style={eventStyles.smallInput}
                placeholder="Start time (e.g., 7:30 PM)"
                placeholderTextColor="#aaa"
                value={startTime}
                onChangeText={setStartTime}
              />

              <Text style={eventStyles.dash}>-</Text>

              <TextInput
                style={eventStyles.smallInput}
                placeholder="End time (e.g., 10:00 PM)"
                placeholderTextColor="#aaa"
                value={endTime}
                onChangeText={setEndTime}
              />
            </View>

            {/* submit */}
            <TouchableOpacity
              style={feedStyles.postButton}
              onPress={handleCreateEvent}
            >
              <Text style={feedStyles.postButtonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#a388f6"
            style={{ marginVertical: 20 }}
          />
        )}

        {/* event list */}
        {events.length === 0 ? (
          <Text style={feedStyles.noPostsText}>No events yet.</Text>
        ) : (
          events.map((event) => (
            <View key={event.id} style={feedStyles.postCard}>
              <Text style={feedStyles.usernameText}>{event.name}</Text>

              <Text style={feedStyles.postTime}>{event.date}</Text>

              <Text style={feedStyles.postContent}>
                {event.startTime} - {event.endTime}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

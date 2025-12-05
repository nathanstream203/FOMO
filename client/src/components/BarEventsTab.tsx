import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, } from "react-native";
import { feedStyles } from "../styles/feedStyles";
import { eventStyles } from "../styles/eventStyles";

const BACKEND_URL = ""

interface EventItem {
    id: number;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
}

export default function BarEventsTab(){
    const [showCreateBox, setShowCreateBox] = useState(false);

    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [events, setEvents] = useState<EventItem[]>([]);

    const handleCreatePress = () => {
        setShowCreateBox(!showCreateBox);
    };

    const handleCreateEvent = () => {
        if (!eventName.trim()) {
            Alert.alert("Missing Name" , "Please enter an event name.");
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

        const newEvent: EventItem = {
            id: Date.now(),
            name: eventName.trim(),
            date: eventDate.trim(),
            startTime: startTime.trim(),
            endTime: endTime.trim(),
        };

        setEvents([newEvent, ...events]);

        setEventName("");
        setEventDate("");
        setStartTime("");
        setEndTime("");

        setShowCreateBox(false);
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
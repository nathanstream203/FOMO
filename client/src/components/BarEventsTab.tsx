import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator,} from "react-native";
import { feedStyles } from "../styles/feedStyles";
import { eventStyles } from "../styles/eventStyles";

import {getAToken } from "../../src/tokenStorage";
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

export default function BarEventsTab({ barId }: BarEventsTabProps){
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
        try{
            const token = await getAToken();
            const dbEvents = await getEventsByBarId(barId, token);

            
            const formatted = dbEvents.map((ev: any) => ({
                id: ev.id,
                name: ev.name,
                date: ev.date,
                start_time: ev.start_time,
                end_time: ev.end_time,
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

        try {
            const token = await getAToken();

            await postNewEvent(
                eventName.trim(),
                eventDate.trim(),
                startTime.trim(),
                endTime.trim(),
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
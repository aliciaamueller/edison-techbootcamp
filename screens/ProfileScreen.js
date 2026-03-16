import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenShell from "../ui/ScreenShell";
import { theme } from "../ui/theme";
import { loadUserProfile, updateUserProfile } from "../services/userProfileStorage";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ProfileScreen({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [wakeTime, setWakeTime] = useState(null);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await loadUserProfile();
            setProfile(data);
            if (data?.wakeTimeMs) {
                setWakeTime(new Date(data.wakeTimeMs));
            }
            setLoading(false);
        })();
    }, []);

    const formatWakeTime = (ms) => {
        if (!ms) return "N/A";
        const date = new Date(ms);
        // Simple HH:MM AM/PM format
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleDateChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setWakeTime(selectedDate);
        }
    };

    const saveChanges = async () => {
        if (!wakeTime) return;
        const updated = await updateUserProfile({ wakeTimeMs: wakeTime.getTime() });
        if (updated) {
            setProfile(updated);
            alert("Saved successfully");
        }
    };

    const renderItem = (label, value) => (
        <View style={styles.itemRow}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value?.toString() || "—"}</Text>
        </View>
    );

    return (
        <ScreenShell variant="base">
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Profile</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <Text style={styles.infoText}>Loading...</Text>
                ) : !profile ? (
                    <View style={styles.centerContainer}>
                        <Ionicons name="person-outline" size={48} color={theme.colors.textFaint} style={{ marginBottom: 16 }} />
                        <Text style={styles.infoText}>No data saved yet.</Text>
                    </View>
                ) : (
                    <View>
                        <View style={styles.section}>
                            {renderItem("Role", profile.userRole)}
                            {renderItem("Name", profile.userName)}
                            {renderItem("Reason", profile.reason)}
                            {renderItem("Wake Time", formatWakeTime(profile.wakeTimeMs))}
                            {renderItem("Days", Array.isArray(profile.days) ? profile.days.join(", ") : profile.days)}
                            {renderItem("Music Genre", profile.musicGenre)}
                            {renderItem("AI Personality", profile.aiPersonality)}
                            {renderItem("Interval (min)", profile.intervalMinutes)}
                            {renderItem("Proof Method", profile.proofMethod)}
                        </View>

                        <TouchableOpacity
                            style={styles.editBtn}
                            activeOpacity={0.9}
                            onPress={() => setShowPicker(true)}
                        >
                            <Ionicons name="time-outline" size={20} color={theme.colors.buttonTextDark} />
                            <Text style={styles.editBtnText}>
                                {wakeTime ? `Edit Time (${formatWakeTime(wakeTime.getTime())})` : "Set Time"}
                            </Text>
                        </TouchableOpacity>

                        {showPicker && (
                            <DateTimePicker
                                value={wakeTime || new Date()}
                                mode="time"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[styles.saveBtn, { opacity: wakeTime ? 1 : 0.5 }]}
                            activeOpacity={0.9}
                            onPress={saveChanges}
                            disabled={!wakeTime}
                        >
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#0A0F1F" />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.16)",
    },
    screenTitle: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: "700",
    },
    content: {
        paddingBottom: 40,
    },
    centerContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60,
    },
    infoText: {
        color: theme.colors.textMuted,
        fontSize: 16,
        textAlign: "center",
    },
    section: {
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: theme.radius.xl,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    itemRow: {
        marginBottom: 16,
    },
    label: {
        color: theme.colors.textFaint,
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    value: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: "500",
    },
    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.text,
        height: 56,
        borderRadius: theme.radius.lg,
        gap: 10,
    },
    editBtnText: {
        color: theme.colors.buttonTextDark,
        fontWeight: "700",
        fontSize: 16,
    },
    saveBtn: {
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.success,
        height: 56,
        borderRadius: theme.radius.lg,
        gap: 10,
    },
    saveBtnText: {
        color: "#0A0F1F",
        fontWeight: "700",
        fontSize: 16,
    }
});

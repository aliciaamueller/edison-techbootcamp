import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import ScreenShell from "../ui/ScreenShell";
import GlassCard from "../ui/GlassCard";
import { theme } from "../ui/theme";
import {
    loadProfiles,
    getActiveProfileId,
    updateProfile,
    deleteProfile,
    setActiveProfileId,
    loadUserProfile,
    addProfile
} from "../services/userProfileStorage";
import { cancelAlarmNotification } from "../services/alarmEngine"; // Removed scheduleAlarmNotification as it's no longer directly called here

export default function ProfileGateScreen({ navigation }) {
    const [profiles, setProfiles] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        const data = await loadProfiles();
        const aid = await getActiveProfileId();
        setProfiles(data);
        setActiveId(aid);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [])
    );

    const formatWakeTime = (ms) => {
        if (!ms) return "N/A";
        const date = new Date(ms);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleAddProfile = async () => {
        const newP = await addProfile({
            userName: `Alarm ${profiles.length + 1}`,
            wakeTimeMs: new Date().setHours(7, 0, 0, 0)
        });
        if (newP) {
            navigation.navigate("RoleSelect", { mode: "create", profileId: newP.id });
        }
    };

    const handleDeleteProfile = (id) => {
        Alert.alert(
            "Delete Alarm",
            "Are you sure you want to delete this alarm?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteProfile(id);
                        refresh();
                    }
                }
            ]
        );
    };

    const handleToggle = async (profile, value) => {
        try {
            if (!value) {
                // Toggling OFF
                if (profile.alarmNotificationId) {
                    await cancelAlarmNotification(profile.alarmNotificationId);
                }
                await updateProfile(profile.id, {
                    enabled: false,
                    alarmNotificationId: null,
                    alarmScheduledFor: null
                });
            } else {
                // Toggling ON -> Navigate to wizard to ensure settings/task are set
                navigation.navigate("RoleSelect", { mode: "edit", profileId: profile.id });
            }
            refresh();
        } catch (e) {
            console.warn("Toggle error:", e);
            Alert.alert("Error", "Could not update alarm status.");
        }
    };

    const handleUseProfile = async (profile) => {
        await setActiveProfileId(profile.id);
        navigation.navigate("RoleSelect", { mode: "edit", profileId: profile.id });
    };

    const handleEditProfile = async (id) => {
        await setActiveProfileId(id);
        navigation.navigate("RoleSelect", { mode: "edit", profileId: id });
    };

    if (loading && profiles.length === 0) {
        return (
            <ScreenShell variant="base">
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.accent} />
                    <Text style={styles.loadingText}>Loading alarms...</Text>
                </View>
            </ScreenShell>
        );
    }

    const activeProfile = profiles.find(p => p.id === activeId);

    return (
        <ScreenShell variant="base">
            <View style={styles.header}>
                <Text style={styles.welcome}>Hello, {activeProfile?.userName || "Traveler"}</Text>
                <Text style={styles.roleBadge}>{activeProfile?.userRole || "User"}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {profiles.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="alarm-outline" size={64} color={theme.colors.textFaint} />
                        <Text style={styles.emptyText}>No alarms set yet.</Text>
                    </View>
                ) : (
                    profiles.map((p) => (
                        <GlassCard key={p.id} style={[styles.profileCard, p.id === activeId && styles.activeCard]}>
                            <View style={styles.pHeader}>
                                <View>
                                    <Text style={styles.pName}>{p.userName || "Unnamed Alarm"}</Text>
                                    <Text style={styles.pTime}>{formatWakeTime(p.wakeTimeMs)}</Text>
                                    <Text style={styles.pDays}>
                                        {Array.isArray(p.days) ? p.days.join(", ") : "Once"}
                                    </Text>
                                </View>
                                <Switch
                                    value={p.enabled}
                                    onValueChange={(val) => handleToggle(p, val)}
                                    trackColor={{ false: "rgba(255,255,255,0.1)", true: theme.colors.accent }}
                                    thumbColor={p.enabled ? "#fff" : "#888"}
                                />
                            </View>

                            <View style={styles.pActions}>
                                <TouchableOpacity style={styles.pBtn} onPress={() => handleUseProfile(p)}>
                                    <Ionicons name="play" size={16} color={theme.colors.text} />
                                    <Text style={styles.pBtnText}>Use</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.pBtn} onPress={() => handleEditProfile(p.id)}>
                                    <Ionicons name="create-outline" size={16} color={theme.colors.text} />
                                    <Text style={styles.pBtnText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.pBtn} onPress={() => handleDeleteProfile(p.id)}>
                                    <Ionicons name="trash-outline" size={16} color={theme.colors.textFaint} />
                                    <Text style={[styles.pBtnText, { color: theme.colors.textFaint }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    ))
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.9} onPress={handleAddProfile}>
                    <Text style={styles.addBtnText}>Add new profile</Text>
                    <Ionicons name="add-circle-outline" size={24} color={theme.colors.buttonTextDark} />
                </TouchableOpacity>
            </View>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    loadingText: { color: theme.colors.textFaint, marginTop: 16 },

    header: { paddingTop: 20, marginBottom: 20 },
    welcome: { fontSize: 28, fontWeight: "800", color: theme.colors.text },
    roleBadge: {
        fontSize: 12,
        color: theme.colors.accent2,
        fontWeight: "700",
        textTransform: "uppercase",
        marginTop: 4,
        letterSpacing: 1,
    },

    scrollContent: { paddingBottom: 100 },
    emptyState: { alignItems: "center", marginTop: 60, gap: 10 },
    emptyText: { color: theme.colors.textFaint, fontSize: 16, fontWeight: "600" },

    profileCard: { marginBottom: 16, padding: 20 },
    activeCard: { borderColor: "rgba(255,255,255,0.3)", borderWidth: 1 },
    pHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    pName: { color: theme.colors.textFaint, fontSize: 12, fontWeight: "800", textTransform: "uppercase", marginBottom: 2 },
    pTime: { color: theme.colors.text, fontSize: 32, fontWeight: "900", letterSpacing: -1 },
    pDays: { color: theme.colors.textMuted, fontSize: 13, fontWeight: "700", marginTop: 2 },

    pActions: { flexDirection: "row", gap: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)", paddingTop: 14 },
    pBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, paddingHorizontal: 8 },
    pBtnText: { color: theme.colors.text, fontSize: 14, fontWeight: "700" },

    footer: {
        position: "absolute",
        bottom: 24,
        left: 20,
        right: 20,
    },
    addBtn: {
        backgroundColor: "rgba(255,255,255,0.9)",
        height: 60,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
    addBtnText: { color: theme.colors.buttonTextDark, fontSize: 18, fontWeight: "900" },
});

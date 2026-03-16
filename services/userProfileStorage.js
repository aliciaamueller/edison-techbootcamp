import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PROFILES = "edison:profiles";
const KEY_ACTIVE_ID = "edison:activeProfileId";
const KEY_LEGACY = "edison:userProfile"; // Keep for migration or global userRole if needed

/**
 * Multi-profile management
 */

export async function loadProfiles() {
    try {
        const json = await AsyncStorage.getItem(KEY_PROFILES);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.warn("[STORAGE] Error loading profiles:", e);
        return [];
    }
}

export async function saveProfiles(profiles) {
    try {
        await AsyncStorage.setItem(KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
        console.warn("[STORAGE] Error saving profiles:", e);
    }
}

export async function getActiveProfileId() {
    return await AsyncStorage.getItem(KEY_ACTIVE_ID);
}

export async function setActiveProfileId(id) {
    await AsyncStorage.setItem(KEY_ACTIVE_ID, id || "");
}

export async function getActiveProfile() {
    const profiles = await loadProfiles();
    const activeId = await getActiveProfileId();
    return profiles.find(p => p.id === activeId) || null;
}

export async function addProfile(patch = {}) {
    try {
        const profiles = await loadProfiles();
        const legacy = await AsyncStorage.getItem(KEY_LEGACY);
        const legacyData = legacy ? JSON.parse(legacy) : {};

        const newProfile = {
            id: Date.now().toString(),
            userName: "New Alarm",
            wakeTimeMs: Date.now(),
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            enabled: true,
            userRole: legacyData.userRole || "other",
            ...patch
        };

        const updated = [...profiles, newProfile];
        await saveProfiles(updated);
        await setActiveProfileId(newProfile.id);
        return newProfile;
    } catch (e) {
        console.warn("[STORAGE] Error adding profile:", e);
        return null;
    }
}

export async function updateProfile(id, patch) {
    try {
        const profiles = await loadProfiles();
        const updated = profiles.map(p => {
            if (p.id === id) {
                const newP = { ...p, ...patch };
                console.log("[PROFILE] updated:", newP);
                return newP;
            }
            return p;
        });
        await saveProfiles(updated);
        return updated.find(p => p.id === id);
    } catch (e) {
        console.warn("[STORAGE] Error updating profile:", e);
        return null;
    }
}

export async function deleteProfile(id) {
    try {
        const profiles = await loadProfiles();
        const updated = profiles.filter(p => p.id !== id);
        await saveProfiles(updated);

        const activeId = await getActiveProfileId();
        if (activeId === id) {
            const nextActive = updated.length > 0 ? updated[0].id : null;
            await setActiveProfileId(nextActive);
        }
    } catch (e) {
        console.warn("[STORAGE] Error deleting profile:", e);
    }
}

export async function toggleProfileEnabled(id, enabled) {
    return await updateProfile(id, { enabled });
}

/**
 * Legacy wrappers (Single-profile compatibility)
 */

export async function loadUserProfile() {
    const active = await getActiveProfile();
    console.log("[PROFILE] loaded (active):", active);
    return active;
}

export async function saveUserProfile(profile) {
    // This was used to save the whole profile. 
    // In multi-profile world, we prefer updateProfile.
    const activeId = await getActiveProfileId();
    if (activeId) {
        await updateProfile(activeId, profile);
    }
}

export async function updateUserProfile(patch) {
    try {
        const activeId = await getActiveProfileId();
        if (activeId) {
            return await updateProfile(activeId, patch);
        } else {
            // No active profile? Create one.
            return await addProfile(patch);
        }
    } catch (e) {
        console.warn("[STORAGE] Error in updateUserProfile wrapper:", e);
        return null;
    }
}

export async function clearUserProfile() {
    // For debugging/reset: clears EVERYTHING
    await AsyncStorage.removeItem(KEY_PROFILES);
    await AsyncStorage.removeItem(KEY_ACTIVE_ID);
    await AsyncStorage.removeItem(KEY_LEGACY);
}

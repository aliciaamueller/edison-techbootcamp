import { Vibration } from "react-native";

/**
 * Centralized Vibration Controller
 * Single source of truth for vibration state across the app
 */
class VibrationController {
    constructor() {
        this.isVibrating = false;
        this.isDisabled = false; // Flag to prevent reactivation
    }

    /**
     * Start alarm vibration (continuous loop)
     * Only works if not disabled
     */
    startAlarm() {
        if (this.isDisabled) {
            console.log('[VIBRATION] Blocked: vibration is disabled');
            return;
        }

        if (this.isVibrating) {
            console.log('[VIBRATION] Already vibrating, skipping start');
            return;
        }

        console.log('[VIBRATION] Starting alarm vibration');
        Vibration.vibrate([0, 900, 500, 900, 500], true);
        this.isVibrating = true;
    }

    /**
     * Stop all vibration
     */
    stop() {
        if (!this.isVibrating) {
            return;
        }

        console.log('[VIBRATION] Stopping vibration');
        Vibration.cancel();
        this.isVibrating = false;
    }

    /**
     * Disable vibration completely (for challenges)
     * Stops current vibration and prevents reactivation
     */
    disable() {
        console.log('[VIBRATION] Disabling vibration');
        this.stop();
        this.isDisabled = true;
    }

    /**
     * Re-enable vibration (after challenge ends)
     */
    enable() {
        console.log('[VIBRATION] Enabling vibration');
        this.isDisabled = false;
    }

    /**
     * One-shot vibration for feedback (not affected by disable flag)
     * @param {number} duration - Duration in milliseconds
     */
    feedback(duration = 100) {
        console.log('[VIBRATION] Feedback:', duration, 'ms');
        Vibration.vibrate(duration);
    }

    /**
     * Get current state
     */
    getState() {
        return {
            isVibrating: this.isVibrating,
            isDisabled: this.isDisabled,
        };
    }

    /**
     * Reset controller (for cleanup)
     */
    reset() {
        console.log('[VIBRATION] Resetting controller');
        this.stop();
        this.isDisabled = false;
    }
}

// Singleton instance
const vibrationController = new VibrationController();

export default vibrationController;

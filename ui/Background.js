// ui/Background.js
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Background that matches the provided screenshots:
 * - deep navy base
 * - subtle star dots
 * - big soft circles (top-right + mid)
 * - optional bottom "purple haze" (for alarm screens)
 */
export default function Background({ variant = "base" }) {
  const stars = useMemo(() => {
    // Fixed list so it doesn't re-randomize on every render.
    return [
      { left: 24, top: 90, size: 2, o: 0.16 },
      { left: 62, top: 140, size: 3, o: 0.12 },
      { left: 110, top: 210, size: 2, o: 0.14 },
      { left: 44, top: 260, size: 2, o: 0.10 },
      { left: 88, top: 330, size: 3, o: 0.10 },
      { left: 26, top: 410, size: 2, o: 0.12 },
      { left: 140, top: 520, size: 2, o: 0.10 },
      { left: 64, top: 580, size: 2, o: 0.12 },
      { left: 28, top: 650, size: 3, o: 0.10 },
      { left: 120, top: 740, size: 2, o: 0.10 },
      { left: 40, top: 800, size: 2, o: 0.12 },
      { left: 90, top: 860, size: 2, o: 0.10 },
    ];
  }, []);

  const baseColors =
    variant === "success" ? ["#061C18", "#071A2A"] : ["#050B1C", "#06102A"];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={baseColors} style={StyleSheet.absoluteFill} />

      {/* Big soft circles */}
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleMid]} />

      {/* Star dots */}
      {stars.map((s, idx) => (
        <View
          key={idx}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: 99,
            backgroundColor: "rgba(255,255,255,1)",
            opacity: s.o,
          }}
        />
      ))}

      {/* Bottom haze (visible in alarm screenshot) */}
      {variant === "alarm" && (
        <LinearGradient
          colors={[
            "rgba(164,88,255,0)",
            "rgba(164,88,255,0.35)",
            "rgba(164,88,255,0.55)",
          ]}
          style={styles.haze}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: "rgba(111,231,255,0.06)",
  },
  circleTopRight: {
    width: 520,
    height: 520,
    right: -240,
    top: -180,
    backgroundColor: "rgba(111,231,255,0.07)",
  },
  circleMid: {
    width: 380,
    height: 380,
    left: -120,
    top: 260,
    backgroundColor: "rgba(111,231,255,0.05)",
  },
  haze: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 360,
  },
});

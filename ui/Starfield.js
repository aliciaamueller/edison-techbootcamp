// ui/Starfield.js
import React, { useMemo } from "react";
import { View } from "react-native";

// Tiny, subtle “space dust” dots (premium, not noisy)
// Deterministic layout so it doesn't flicker/re-render randomly.
export default function Starfield({ opacity = 0.28 }) {
  const dots = useMemo(
    () => [
      { x: "8%", y: "12%", s: 2, o: 0.18 },
      { x: "22%", y: "18%", s: 1, o: 0.10 },
      { x: "35%", y: "10%", s: 2, o: 0.16 },
      { x: "58%", y: "14%", s: 1, o: 0.12 },
      { x: "74%", y: "9%", s: 2, o: 0.14 },
      { x: "88%", y: "18%", s: 1, o: 0.10 },

      { x: "10%", y: "42%", s: 1, o: 0.10 },
      { x: "26%", y: "48%", s: 2, o: 0.14 },
      { x: "46%", y: "44%", s: 1, o: 0.10 },
      { x: "63%", y: "52%", s: 2, o: 0.16 },
      { x: "82%", y: "46%", s: 1, o: 0.10 },

      { x: "14%", y: "78%", s: 2, o: 0.14 },
      { x: "38%", y: "82%", s: 1, o: 0.10 },
      { x: "52%", y: "76%", s: 2, o: 0.16 },
      { x: "70%", y: "84%", s: 1, o: 0.10 },
      { x: "90%", y: "78%", s: 2, o: 0.14 },
    ],
    []
  );

  return (
    <View pointerEvents="none" style={{ position: "absolute", inset: 0, opacity }}>
      {dots.map((d, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.s,
            height: d.s,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,1)",
            opacity: d.o,
          }}
        />
      ))}
    </View>
  );
}

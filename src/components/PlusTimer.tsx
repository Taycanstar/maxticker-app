// TimerComponent.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Circle, Svg } from "react-native-svg";
import { Layout, useTheme } from "@ui-kitten/components";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../constants/Colors";

type props = {
  onPress?: () => void;
};

const PlusTimer: React.FC<props> = ({ onPress }) => {
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true);
  const theme = useTheme();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<
    "stopped" | "running" | "paused"
  >("stopped");
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [laps, setLaps] = useState<{ time: number; name: string }[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTime: number;

    if (timerState === "running") {
      startTime = Date.now() - elapsedTime;
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else if (timerState === "stopped") {
      setElapsedTime(0);
    }

    return () => clearInterval(interval);
  }, [timerState]);

  const onAddPress = () => {};
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const minutes = formatNumber(Math.floor(elapsedTime / 60000));
  const seconds = formatNumber(Math.floor((elapsedTime % 60000) / 1000));
  const milliseconds = formatNumber(Math.floor((elapsedTime % 1000) / 10));
  // Divide by 10 to get 2 digits

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.circleContainer}>
        <Svg
          style={{ flexShrink: 0, flexGrow: 0 }}
          // width="80%"
          // height="40%"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
        >
          <Circle
            cx="50"
            cy="50"
            r="48"
            stroke="#ddd"
            strokeWidth="4"
            fill="none"
          />
        </Svg>
        <View style={styles.timeContainer}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Feather
              color={theme["text-basic-color"]}
              size={30}
              onPress={onPress}
              name="plus-square"
            />

            <View
              style={{
                position: "absolute",
                top: 35,
                width: 100,
                // justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: theme["ios-blue"],
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
              >
                <Text
                  style={{
                    color: theme["text-basic-color"],
                    fontWeight: "bold",
                  }}
                >
                  PLUS
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PlusTimer;

const styles = StyleSheet.create({
  circleContainer: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",

    borderRadius: 100, // This will make it a circle if the width and height are 100 each.
    width: 165, // Suppose you want your circle and its container to be 100x100
    height: 165,
  },
  icons: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    top: 80,
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 20,
  },
  iconGroup: {},
  timeContainer: {
    position: "absolute",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  name: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    right: 0,
    bottom: 90,
    left: 0,
  },
  container: {
    // flex: 1,
    // width: "100%",
    // backgroundColor: "red",
  },
  digit: {
    fontSize: 20,
    // lineHeight: 40,
    textAlign: "center",
    width: 11,
  },
});

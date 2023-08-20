import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../constants/Colors";
import { Layout, useTheme } from "@ui-kitten/components";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import Feather from "@expo/vector-icons/Feather";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Circle, Svg } from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";

type Props = {};

const AddScreen: React.FC = () => {
  const theme = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const goalTime = 10000;
  const [timerState, setTimerState] = useState<
    "stopped" | "running" | "paused"
  >("stopped");
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  // const [laps, setLaps] = useState<number[]>([]);
  // Instead of just storing the lap time, store both lap time and lap name
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

  const percentage = Math.min((elapsedTime / goalTime) * 100, 100);
  const strokeDashoffset = 314 * (1 - percentage / 100);

  const handleLapOrReset = () => {
    if (timerState === "running") {
      setLaps([...laps, { time: elapsedTime, name: `Lap ${laps.length + 1}` }]);
    } else {
      setLaps([]);
      setElapsedTime(0);
      setTimerState("stopped");
    }
  };

  const onInputSubmit = () => {};

  return (
    <Layout style={styles.container}>
      <View style={styles.titleContainer}>
        {isTimerActive && (
          <View
            style={{
              marginBottom: 15,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 30,
                  color: theme["text-basic-color"],
                }}
              >
                Reading
              </Text>
              <Feather
                color={theme["text-basic-color"]}
                size={25}
                name="chevron-down"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.middleContainer}>
          <View style={styles.circleContainer}>
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
              <Circle
                cx="50"
                cy="50"
                r="48"
                stroke={theme["ios-blue"]}
                strokeWidth="4"
                fill="none"
                strokeDasharray="314"
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
              />
            </Svg>
            <View style={styles.timeContainer}>
              {isTimerActive ? (
                <>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                  >
                    {minutes.slice(0, 1)}
                  </Text>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                  >
                    {minutes.slice(1)}
                  </Text>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                  >
                    :
                  </Text>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                  >
                    {seconds.slice(0, 1)}
                  </Text>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                  >
                    {seconds.slice(1)}
                  </Text>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                  >
                    .
                  </Text>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                  >
                    {milliseconds.slice(0, 1)}
                  </Text>
                  <Text
                    style={[styles.digit, { color: theme["text-basic-color"] }]}
                    ellipsizeMode="clip"
                    numberOfLines={1}
                  >
                    {milliseconds.slice(1)}
                  </Text>
                </>
              ) : (
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme["text-basic-color"],
                      borderRadius: 100,
                      padding: 7,
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 7,
                    }}
                  >
                    <Feather
                      color={theme["background-basic-color-1"]}
                      size={30}
                      onPress={() => {}}
                      name="plus"
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      position: "absolute",
                      top: 58,
                      width: 100,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                      }}
                    >
                      New task
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isTimerActive ? (
            <>
              <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                  <Button
                    color={theme["text-basic-color"]}
                    title={timerState === "running" ? "Lap" : "Reset"}
                    onPress={handleLapOrReset}
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button
                    color={
                      timerState === "running"
                        ? theme["ios-red"]
                        : theme["ios-blue"]
                    }
                    title={timerState === "running" ? "Stop" : "Start"}
                    onPress={() =>
                      setTimerState((prev) =>
                        prev === "running" ? "paused" : "running"
                      )
                    }
                  />
                </View>
              </View>
            </>
          ) : (
            <View style={{ height: 22 }}>
              <Text>Hi</Text>
            </View>
          )}
        </View>
        <ScrollView
          style={styles.lapsContainer}
          showsVerticalScrollIndicator={false}
        >
          {laps.map((lap, index) => {
            const lapMinutes = formatNumber(Math.floor(lap.time / 60000));
            const lapSeconds = formatNumber(
              Math.floor((lap.time % 60000) / 1000)
            );
            const lapMilliseconds = formatNumber(
              Math.floor((lap.time % 1000) / 10)
            );

            return (
              <View key={index} style={styles.lap}>
                <TextInput
                  onSubmitEditing={onInputSubmit}
                  style={{
                    color: theme["text-basic-color"],
                    fontSize: 15,
                    borderBottomWidth: 0,
                    borderColor: theme["text-basic-color"],
                  }}
                  value={lap.name}
                  onChangeText={(text) => {
                    const updatedLaps = [...laps];
                    updatedLaps[index].name = text;
                    setLaps(updatedLaps);
                  }}
                />
                <Text
                  style={{ color: theme["text-basic-color"], fontSize: 15 }}
                >
                  {lapMinutes}:{lapSeconds}.{lapMilliseconds}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Layout>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  time: {
    fontSize: 30,

    textAlign: "center",
  },

  digit: {
    fontSize: 40,
    lineHeight: 40,
    textAlign: "center",
    width: 24,
  },
  resetButton: {
    backgroundColor: "rgba(230, 53, 43,0.3)",
    padding: 10,
    borderRadius: 100,
    width: 70,
    height: 70, // fixed width to ensure all buttons have the same width
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  stopButton: {
    backgroundColor: "#2196F3", // any color of your choice
    padding: 10,
    borderRadius: 100,
    width: 70,
    height: 70, // fixed width to ensure all buttons have the same width
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  startButton: {
    backgroundColor: "#2196F3", // any color of your choice
    padding: 10,
    borderRadius: 100,
    width: 70,
    height: 70, // fixed width to ensure all buttons have the same width
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },

  resetTxt: {
    color: "#e6352b", // or any color of your choice
    fontWeight: "500",
    fontSize: 16,
  },
  stopTxt: {
    color: "white", // or any color of your choice
    fontWeight: "bold",
  },
  startTxt: {
    color: "white", // or any color of your choice
    fontWeight: "bold",
  },
  buttonWrapper: {
    width: 65, // adjust this width value as necessary

    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
  },

  titleContainer: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },

  middleContainer: {
    // flex: 2.5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  circleContainer: {
    width: "80%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

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

  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 0,

    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  lapsContainer: {
    width: "100%",
    maxHeight: 200, // Adjust this value based on your preference
    paddingHorizontal: 20,
    marginBottom: 58,
    marginTop: 10, // Add some margin for better visual appearance
  },

  lap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  contentContainer: {
    flex: 8,
    width: "100%",
    justifyContent: "space-between",
  },
});

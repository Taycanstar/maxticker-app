// TimerComponent.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Circle, Svg } from "react-native-svg";
import { Layout, useTheme } from "@ui-kitten/components";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../constants/Colors";
import { taskEventEmitter } from "../utils/eventEmitter";
import { useTasks } from "../contexts/TaskContext";

type props = {
  name: string;
  goalTime?: any;
  id?: string;
  strokeColor?: string;
};

interface SessionData {
  startTime: number;
  totalDuration: number;
  status: string;
  laps: { time: number; name: string }[];
  history: any[];
  breaks: number;
  timeSpentOnBreaks: number;
}

const Stopwatch: React.FC<props> = ({ name, goalTime, strokeColor, id }) => {
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true);
  const theme = useTheme();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const { endSession, tasks } = useTasks();
  const [timerState, setTimerState] = useState<
    "stopped" | "running" | "paused"
  >("stopped");
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [laps, setLaps] = useState<{ time: number; name: string }[]>([]);
  const [breakStartTime, setBreakStartTime] = useState<number | null>(null);

  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: performance.now(),
    totalDuration: 0,
    status: "stopped",
    laps: [],
    history: [],
    breaks: 0,
    timeSpentOnBreaks: 0,
    // ... any other fields you need
  });

  // Update the local state based on user actions
  const handleStart = () => {
    setSessionData((prevData) => ({
      ...prevData,
      status: "running",
      startTime: performance.now(),
    }));
  };

  const handlePause = () => {
    const now = performance.now();
    const duration = now - sessionData.startTime;

    setSessionData((prevData) => ({
      ...prevData,
      status: "paused",
      totalDuration: prevData.totalDuration + duration,
    }));
  };

  useEffect(() => {
    const handleTaskStateChange = (data: { taskId: string; state: string }) => {
      if (data.taskId === id) {
        if (data.state === "running") {
          setTimerState("running");
          console.log("Received timerStarted event in Stopwatch");
        } else if (data.state === "paused") {
          setTimerState("paused");
          console.log("Received timerStarted event in Stopwatch");
        } else if (data.state === "stopped") {
          setTimerState("stopped");
          console.log("Received timerStarted event in Stopwatch");
        }
      }
    };

    taskEventEmitter.on("taskStateChanged", handleTaskStateChange);

    // Cleanup the listener when the component unmounts
    return () => {
      taskEventEmitter.off("taskStateChanged", handleTaskStateChange);
    };
  }, [tasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTime: number;

    if (timerState === "running") {
      startTime = performance.now() - elapsedTime;
      interval = setInterval(() => {
        setElapsedTime(performance.now() - startTime);
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

  const handleEndSession = async () => {
    let finalSessionData = { ...sessionData };

    const now = performance.now();

    // If the session is currently running, add the current duration to totalDuration
    if (timerState === "running") {
      const currentDuration = now - sessionData.startTime;
      finalSessionData.totalDuration += currentDuration;
    }

    // If a break is currently ongoing, add its duration to timeSpentOnBreaks
    if (breakStartTime) {
      const currentBreakDuration = now - breakStartTime;
      finalSessionData.timeSpentOnBreaks += currentBreakDuration;
    }

    try {
      if (id) {
        await endSession(id, finalSessionData); // Send the taskId and final data to the backend
      } else {
        console.error("No current task found");
      }

      // Reset the local state
      setSessionData({
        startTime: performance.now(),
        totalDuration: 0,
        status: "stopped",
        laps: [],
        history: [],
        breaks: 0,
        timeSpentOnBreaks: 0,
      });

      // Reset the local laps state
      setLaps([]);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const handleLap = () => {
    const newLap = {
      time: elapsedTime,
      name: `Lap ${sessionData.laps.length + 1}`,
    };

    // Update the local laps state
    setLaps((prevLaps) => [...prevLaps, newLap]);

    // Update the sessionData.laps
    setSessionData((prevData) => ({
      ...prevData,
      laps: [...prevData.laps, newLap],
    }));
  };

  const handleStartBreak = () => {
    if (sessionData.status === "running") {
      handlePause(); // Pause the timer if it's running
    }

    setBreakStartTime(performance.now());
  };

  const handleEndBreak = () => {
    if (breakStartTime) {
      // Check if breakStartTime is not null
      const now = performance.now();
      const breakDuration = now - breakStartTime;

      setSessionData((prevData) => ({
        ...prevData,
        breaks: prevData.breaks + 1,
        timeSpentOnBreaks: prevData.timeSpentOnBreaks + breakDuration,
      }));

      setBreakStartTime(null); // reset the break start time
    }
  };

  //  const handleEditPress = () => {
  //    setIsMoreVisible(false);
  //    navigation.navigate("Edit", {
  //      name: tasks[activeTaskIndex]?.name,
  //      goal: tasks[activeTaskIndex]?.goal,
  //      color: tasks[activeTaskIndex]?.color,
  //      taskId: tasks[activeTaskIndex]?._id,
  //    });
  //  };

  return (
    <View style={styles.container}>
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
            stroke={isPremiumUser ? strokeColor : theme["ios-blue"]}
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
        <View style={styles.name}>
          <Text
            style={{
              color: theme["text-basic-color"],
              fontSize: 14,
            }}
          >
            {name}
          </Text>
        </View>

        <View style={styles.icons}>
          <View style={styles.iconGroup}>
            <Feather
              color={theme["text-basic-color"]}
              size={18}
              name={timerState === "running" ? "log-in" : "rotate-cw"}
              // onPress={handleLapOrReset}
              onPress={() => {
                if (timerState === "running") {
                  handleLap();
                } else {
                  setElapsedTime(0); // Reset the timer
                  setTimerState("stopped");
                  handleEndSession();
                  taskEventEmitter.emit("multipleTaskStateChanged", {
                    taskId: id,
                    state: "stopped",
                  });
                }
              }}
            />
          </View>
          <View style={styles.iconGroup}>
            <Feather
              color={theme["text-basic-color"]}
              size={18}
              name={timerState === "running" ? "pause" : "play"}
              // onPress={() =>
              //   setTimerState((prev) =>
              //     prev === "running" ? "paused" : "running"
              //   )
              // }
              onPress={() => {
                if (timerState === "stopped") {
                  taskEventEmitter.emit("multipleTaskStateChanged", {
                    taskId: id,
                    state: "running",
                  });
                  handleStart();
                  setTimerState("running");
                } else if (timerState === "running") {
                  setTimerState("paused");
                  taskEventEmitter.emit("multipleTaskStateChanged", {
                    taskId: id,
                    state: "paused",
                  });
                  handlePause();
                  handleStartBreak();
                } else if (timerState === "paused") {
                  taskEventEmitter.emit("multipleTaskStateChanged", {
                    taskId: id,
                    state: "running",
                  });
                  handleEndBreak();
                  setTimerState("running");
                }
              }}
            />
          </View>
          <View style={styles.iconGroup}>
            <Feather
              color={theme["text-basic-color"]}
              size={18}
              name="edit"
              onPress={handleLapOrReset}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  circleContainer: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // backgroundColor: "red",
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
    width: "100%",
  },
  digit: {
    fontSize: 20,
    // lineHeight: 40,
    textAlign: "center",
    width: 11,
  },
});

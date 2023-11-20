import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  AppState,
} from "react-native";
import { Circle, Svg } from "react-native-svg";
import { Layout, useTheme } from "@ui-kitten/components";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../constants/Colors";
import { taskEventEmitter } from "../utils/eventEmitter";
import { useTasks } from "../contexts/TaskContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

type IntervalID = NodeJS.Timeout | number | null;

const Stopwatch: React.FC<props> = ({ name, goalTime, strokeColor, id }) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true);
  const theme = useTheme();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const { endSession, tasks, loading } = useTasks();
  const [timerState, setTimerState] = useState<
    "stopped" | "running" | "paused"
  >("stopped");
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [laps, setLaps] = useState<{ time: number; name: string }[]>([]);
  const [breakStartTime, setBreakStartTime] = useState<number | null>(null);

  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: Date.now(),
    totalDuration: 0,
    status: "stopped",
    laps: [],
    history: [],
    breaks: 0,
    timeSpentOnBreaks: 0,
  });

  const [startTime, setStartTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  const handleStart = () => {
    setElapsedTime(0);
    setStartTime(Date.now());
    setTimerState("running");
    // setSessionData((prevData) => ({
    //   ...prevData,
    //   status: "running",
    //   startTime: Date.now(),
    // }));
  };

  const handlePause = () => {
    const now = Date.now();
    setTotalDuration((prevDuration) => prevDuration + (now - startTime));
    setTimerState("paused");
    setStartTime(0);

    // In handlePause
    console.log("Pausing timer. Total Duration:", totalDuration);

    // setSessionData((prevData) => ({
    //   ...prevData,
    //   status: "paused",
    //   totalDuration: prevData.totalDuration + duration,
    // }));
  };

  const handleResume = () => {
    setStartTime(Date.now());
    setTimerState("running");
  };

  // useEffect(() => {
  //   const handleTaskStateChange = (data: { taskId: string; state: string }) => {
  //     if (!tasks) return; // Ensure tasks is available inside the handler

  //     if (data.taskId === id) {
  //       console.log(data.state, "received current State");
  //       // ... rest of the code
  //     }
  //   };

  //   taskEventEmitter.on("taskStateChanged", handleTaskStateChange);

  //   // Cleanup the listener when the component unmounts
  //   return () => {
  //     taskEventEmitter.off("taskStateChanged", handleTaskStateChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   // Ensure tasks is available before setting up the event listener
  //   if (!tasks) return;

  //   const handleTaskStateChange = (data: { taskId: string; state: string }) => {
  //     if (data.taskId === id) {
  //       console.log(data.state, "received current State");
  //       if (data.state === "running") {
  //         setTimerState("running");
  //         console.log("Received timerStarted event in Stopwatch");
  //       } else if (data.state === "paused") {
  //         setTimerState("paused");
  //         console.log("Received timerStarted event in Stopwatch");
  //       } else if (data.state === "stopped") {
  //         setTimerState("stopped");
  //         console.log("Received timerStarted event in Stopwatch");
  //       }
  //     }
  //   };

  //   taskEventEmitter.on("taskStateChanged", handleTaskStateChange);

  //   // Cleanup the listener when the component unmounts or when tasks changes
  //   return () => {
  //     taskEventEmitter.off("taskStateChanged", handleTaskStateChange);
  //   };
  // }, [tasks]);

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   let startTime: number;

  //   if (timerState === "running") {
  //     startTime = Date.now() - elapsedTime;
  //     interval = setInterval(() => {
  //       setElapsedTime(Date.now() - startTime);
  //     }, 10);
  //   } else if (timerState === "stopped") {
  //     setElapsedTime(0);
  //   }

  //   return () => clearInterval(interval);
  // }, [timerState]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === "running") {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const newElapsedTime = currentTime - startTime + totalDuration;
        setElapsedTime(newElapsedTime);
      }, 50);
    } else if (interval) {
      clearInterval(interval);
    }
    // In useEffect's setInterval
    console.log("Interval running. Timer State:", timerState);
    return () => {
      // Before clearing interval
      console.log("Clearing interval. Timer State:", timerState);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerState, startTime, totalDuration]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

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

    const now = Date.now();

    if (timerState === "running") {
      const currentDuration = now - sessionData.startTime;
      finalSessionData.totalDuration += currentDuration;
    }

    if (breakStartTime) {
      const currentBreakDuration = now - breakStartTime;
      finalSessionData.timeSpentOnBreaks += currentBreakDuration;
    }

    try {
      if (id) {
        await endSession(id, finalSessionData);
      } else {
        console.error("No current task found");
      }

      // Reset the local state
      setSessionData({
        startTime: Date.now(),
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

    setBreakStartTime(Date.now());
  };

  const handleEndBreak = () => {
    if (breakStartTime) {
      // Check if breakStartTime is not null
      const now = Date.now();
      const breakDuration = now - breakStartTime;

      setSessionData((prevData) => ({
        ...prevData,
        breaks: prevData.breaks + 1,
        timeSpentOnBreaks: prevData.timeSpentOnBreaks + breakDuration,
      }));

      setBreakStartTime(null); // reset the break start time
    }
  };

  useEffect(() => {
    setIsReady(true);
    return () => setIsReady(false); // clean up on unmount
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: any) => {
      const currentTime = Date.now();

      if (nextAppState.match(/inactive|background/)) {
        // Save the current state and totalDuration
        await AsyncStorage.setItem("timerState", JSON.stringify(timerState));
        await AsyncStorage.setItem(
          "totalDuration",
          JSON.stringify(totalDuration)
        );

        if (timerState === "running") {
          // If the timer is running, save the current timestamp
          await AsyncStorage.setItem(
            "backgroundTimestamp",
            JSON.stringify(currentTime)
          );
        }
      } else if (nextAppState === "active") {
        // Restore the timer state
        // const savedTimerState = await AsyncStorage.getItem("timerState");
        // const savedTotalDuration = await AsyncStorage.getItem("totalDuration");
        // const backgroundTimestamp = await AsyncStorage.getItem(
        //   "backgroundTimestamp"
        // );
        // if (savedTimerState !== null && savedTotalDuration !== null) {
        //   const restoredTimerState = JSON.parse(savedTimerState);
        //   let newTotalDuration = JSON.parse(savedTotalDuration);
        //   if (
        //     restoredTimerState === "running" &&
        //     backgroundTimestamp !== null
        //   ) {
        //     const timeInBackground =
        //       currentTime - JSON.parse(backgroundTimestamp);
        //     newTotalDuration += timeInBackground;
        //   }
        //   setTotalDuration(newTotalDuration);
        //   setTimerState(restoredTimerState);
        //   if (restoredTimerState === "running") {
        //     setStartTime(currentTime);
        //   }
        // }
      }
    };

    // Subscribe to AppState changes
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup on unmount
    return () => {
      appStateSubscription.remove();
    };
  }, [totalDuration, timerState]);

  // Inside Stopwatch component

  useEffect(() => {
    const handleTaskStateChange = (data: any) => {
      if (data.taskId === id) {
        setTimerState(data.state);
        setElapsedTime(data.elapsedTime);

        if (data.state === "running") {
          // Adjust startTime based on elapsed time
          setStartTime(Date.now() - data.elapsedTime);
        } else if (data.state === "paused" || data.state === "stopped") {
          // Reset startTime for paused or stopped states
          setStartTime(0);
          if (data.state === "stopped") {
            setTotalDuration(0);
          }
        }
      }
    };

    taskEventEmitter.on("taskStateChange", handleTaskStateChange);

    return () => {
      taskEventEmitter.off("taskStateChange", handleTaskStateChange);
    };
  }, [id]);

  // useEffect(() => {
  //   // Emit the current timer state and elapsedTime whenever they change
  //   taskEventEmitter.emit("stopwatchStateChange", {
  //     taskId: id,
  //     state: timerState,
  //     elapsedTime: elapsedTime,
  //   });
  // }, [timerState, elapsedTime, id]);

  const { minutes, seconds, milliseconds } = useMemo(() => {
    let elapsedTime;
    if (timerState === "running") {
      elapsedTime = Date.now() - startTime + totalDuration;
    } else {
      elapsedTime = totalDuration;
    }

    const mins = formatNumber(Math.floor(elapsedTime / 60000));
    const secs = formatNumber(Math.floor((elapsedTime % 60000) / 1000));
    const millisecs = formatNumber(Math.floor((elapsedTime % 1000) / 10));
    return { minutes: mins, seconds: secs, milliseconds: millisecs };
  }, [totalDuration, startTime, timerState, elapsedTime]);

  const percentage = Math.min((elapsedTime / goalTime) * 100, 100);
  const strokeDashoffset = 314 * (1 - percentage / 100);

  const emitCurrentState = () => {
    const currentElapsedTime =
      timerState === "running"
        ? Date.now() - startTime + totalDuration
        : totalDuration;

    taskEventEmitter.emit("stopwatchStateChange", {
      taskId: id,
      state: timerState,
      elapsedTime: currentElapsedTime,
    });
  };

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

                  emitCurrentState();
                }
              }}
            />
          </View>
          <View style={styles.iconGroup}>
            <Feather
              color={theme["text-basic-color"]}
              size={18}
              name={timerState === "running" ? "pause" : "play"}
              onPress={() => {
                if (timerState === "stopped") {
                  setTimerState("running");
                  handleStart();

                  emitCurrentState();
                } else if (timerState === "running") {
                  setTimerState("paused");
                  handlePause();
                  handleStartBreak();

                  emitCurrentState();
                } else if (timerState === "paused") {
                  setTimerState("running");
                  handleResume();
                  handleEndBreak();

                  emitCurrentState();
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

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  AppState,
} from "react-native";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
  useMemo,
} from "react";
import Colors from "../constants/Colors";
import { Layout, useTheme } from "@ui-kitten/components";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import Feather from "@expo/vector-icons/Feather";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Circle, Svg, Line } from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  HomeScreenRouteProp,
  type StackNavigation,
} from "../navigation/AppNavigator";
import { useTasks, Task } from "../contexts/TaskContext";
import { useFocusEffect } from "@react-navigation/native";
import { blackLogo } from "../images/ImageAssets";
import { taskEventEmitter } from "../utils/eventEmitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundTimer from "react-native-background-timer";
import BackgroundService from "react-native-background-actions";

type Props = {};

interface SessionData {
  startTime: number;
  totalDuration: number;
  status: string;
  laps: { time: number; name: string }[];
  history: any[];
  breaks: number;
  timeSpentOnBreaks: number;
}

type HomeProps = {
  route: HomeScreenRouteProp;
};

const HomeScreen: React.FC<HomeProps> = ({ navigation, route }: any) => {
  const theme = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);
  // const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<
    "stopped" | "running" | "paused"
  >("stopped");
  // const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [laps, setLaps] = useState<{ time: number; name: string }[]>([]);
  const { navigate } = useNavigation<StackNavigation>();
  const { tasks, fetchTasks, endSession, deleteTask } = useTasks();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isMoreVisible, setIsMoreVisible] = useState<boolean>(false);
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [goalTime, setGoalTime] = useState<number>(
    tasks && tasks[activeTaskIndex] ? tasks[activeTaskIndex].goal : 0
  );
  const lastEmitRef = useRef<{
    [taskId: string]: {
      state: "stopped" | "running" | "paused";
      elapsedTime: number;
    };
  }>({});

  const [startTime, setStartTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  const handleStart = () => {
    setStartTime(Date.now());
    setTimerState("running");
  };

  const handlePause = () => {
    const now = Date.now();
    setTotalDuration((prevDuration) => prevDuration + (now - startTime));
    setTimerState("paused");
    setStartTime(0); // Reset start time
  };

  const handleResume = () => {
    setStartTime(Date.now());
    setTimerState("running");
  };

  // Define the local state
  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: Date.now(),
    totalDuration: 0,
    status: "stopped",
    laps: [],
    history: [],
    breaks: 0,
    timeSpentOnBreaks: 0,
    // ... any other fields you need
  });

  const handleEndSession = async () => {
    const now = Date.now();

    let currentDuration = 0;
    if (timerState === "running" && startTime) {
      currentDuration = now - startTime;
    }

    const finalTotalDuration = totalDuration + currentDuration;

    try {
      if (tasks[activeTaskIndex] && tasks[activeTaskIndex]._id) {
        // Prepare finalSessionData with all required fields
        const finalSessionData: SessionData = {
          ...sessionData, // Include existing session data
          totalDuration: finalTotalDuration, // Update totalDuration
          status: "stopped", // Update status
          // Include any other fields that need updating
        };

        await endSession(tasks[activeTaskIndex]._id, finalSessionData);
        await BackgroundService.stop();
      } else {
        console.error("Cannot end session: Invalid task.");
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }

    // Reset local state
    setTotalDuration(0);
    setStartTime(0);
    setElapsedTime(0);
    setTimerState("stopped");
    // ... reset other relevant states
  };

  useEffect(() => {
    if (tasks[activeTaskIndex]) {
      setGoalTime(tasks[activeTaskIndex].goal ?? 0);
    }
  }, [tasks, activeTaskIndex]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchTasks();
        // Use a local variable to check the tasks immediately after fetching
        const fetchedTasks = tasks;
        // if (fetchedTasks && fetchedTasks.length > 0) {
        //   setActiveTaskIndex(activeTaskIndex); // Set the first task as the active task after fetching
        // }
      };

      fetchData();
    }, [fetchTasks])
  );

  const onAddPress = () => {
    navigate("Add");
  };
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
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
  useLayoutEffect(() => {
    if (tasks[activeTaskIndex]) {
      navigation.setOptions({
        headerTitle: tasks[activeTaskIndex].name,

        headerTitleStyle: {
          color: theme["text-basic-color"],
          fontSize: 20,
        },
        headerRight: () => (
          <TouchableOpacity
            style={{
              marginLeft: 15,
              marginHorizontal: 5,
              borderRadius: 10,
              height: 35,
              width: 35,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setIsMoreVisible(true)}
          >
            <Feather
              name="more-horizontal"
              size={23}
              color={theme["text-basic-color"]}
            />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: () => (
          <>
            <Image
              source={blackLogo}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </>
        ),
        headerRight: null,
      });
    }
  }, [tasks, navigation, activeTaskIndex]);

  const handleChangeTask = () => {
    setContextMenuVisible(false);
    setIsModalVisible(true);
  };

  const handleEditPress = () => {
    setIsMoreVisible(false);
    navigation.navigate("Edit", {
      name: tasks[activeTaskIndex]?.name,
      goal: tasks[activeTaskIndex]?.goal,
      color: tasks[activeTaskIndex]?.color,
      taskId: tasks[activeTaskIndex]?._id,
    });
  };

  const handleDeletePress = async () => {
    if (tasks[activeTaskIndex]) {
      await deleteTask(tasks[activeTaskIndex]._id);

      // Resetting the state
      // setElapsedTime(0);
      setTimerState("stopped");
      setLaps([]);

      if (activeTaskIndex === tasks.length - 1 && tasks.length > 1) {
        setActiveTaskIndex(tasks.length - 2);
      } else if (tasks.length <= 1) {
        setActiveTaskIndex(0);
      }

      setTimeout(() => {
        setIsDeleteVisible(false);
      }, 100);
    }
  };

  // useEffect(() => {
  //   const handleTaskStateChange = (data: {
  //     taskId: string;
  //     state: "stopped" | "running" | "paused";
  //     elapsedTime?: number;
  //   }) => {
  //     if (data.taskId === tasks[activeTaskIndex]?._id) {
  //       if (data.elapsedTime !== undefined) {
  //         lastEmitRef.current[data.taskId] = {
  //           state: data.state,
  //           elapsedTime: data.elapsedTime,
  //         };
  //       }

  //       if (data.state === "running") {
  //         setTimerState("running");
  //         if (data.elapsedTime !== undefined) {
  //           setElapsedTime(data.elapsedTime);
  //         }
  //         console.log("Received timerStarted event in homescreen");
  //       } else if (data.state === "paused") {
  //         console.log("Received timerStarted event in homescreen");
  //         setTimerState("paused");
  //         if (data.elapsedTime !== undefined) {
  //           setElapsedTime(data.elapsedTime);
  //         }
  //       } else if (data.state === "stopped") {
  //         setTimerState("stopped");
  //         console.log("Received timerStarted event in homescreen");
  //         if (data.elapsedTime !== undefined) {
  //           setElapsedTime(data.elapsedTime);
  //         }
  //       }
  //     }
  //   };

  //   taskEventEmitter.on("multipleTaskStateChanged", handleTaskStateChange);

  //   return () => {
  //     taskEventEmitter.off("multipleTaskStateChanged", handleTaskStateChange);
  //   };
  // }, [tasks]);

  const changeTaskAction = (index: any) => {
    if (index !== undefined) {
      setActiveTaskIndex(index);
      const taskId = tasks[activeTaskIndex]._id;
      setIsModalVisible(false);
      if (lastEmitRef.current[taskId]) {
        setTimerState(lastEmitRef.current[taskId].state);

        if (lastEmitRef.current[taskId].elapsedTime !== undefined) {
          // setElapsedTime(lastEmitRef.current[taskId].elapsedTime);
        }
      }
    }
  };

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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === "running") {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const newElapsedTime = currentTime - startTime + totalDuration;
        setElapsedTime(newElapsedTime);
      }, 50);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerState, startTime, totalDuration]);

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

  useEffect(() => {
    const emitCurrentState = () => {
      const currentTime = Date.now();
      const currentElapsedTime =
        timerState === "running"
          ? currentTime - startTime + totalDuration
          : totalDuration;

      taskEventEmitter.emit("taskStateChange", {
        taskId: tasks[activeTaskIndex]?._id,
        state: timerState,
        elapsedTime: currentElapsedTime,
      });
    };

    emitCurrentState();
  }, [
    timerState,
    elapsedTime,
    tasks,
    activeTaskIndex,
    startTime,
    totalDuration,
  ]);

  const emitCurrentState = () => {
    const currentTime = Date.now();
    const currentElapsedTime =
      timerState === "running"
        ? currentTime - startTime + totalDuration
        : totalDuration;

    taskEventEmitter.emit("taskStateChanged", {
      taskId: tasks[activeTaskIndex]?._id,
      state: timerState,
      elapsedTime: currentElapsedTime,
    });
  };

  useEffect(() => {
    const handleStopwatchStateChange = (data: any) => {
      if (data.taskId === tasks[activeTaskIndex]?._id) {
        setTimerState(data.state);
        setElapsedTime(data.elapsedTime);

        // Handle other necessary state updates
        if (data.state === "running") {
          setStartTime(Date.now() - data.elapsedTime);
        } else if (data.state === "paused" || data.state === "stopped") {
          setStartTime(0);
          if (data.state === "stopped") {
            setTotalDuration(0);
          }
        }
      }
    };

    taskEventEmitter.on("taskStateChanged", handleStopwatchStateChange);

    return () => {
      taskEventEmitter.off("taskStateChanged", handleStopwatchStateChange);
    };
  }, [tasks, activeTaskIndex]);

  return (
    <Layout style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color={theme["ios-blue"]} />
      ) : (
        <>
          <View style={styles.contentContainer}>
            <View style={styles.middleContainer}>
              <View style={styles.circleContainer}>
                <Svg
                  style={{ flexShrink: 0, flexGrow: 0 }}
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
                  {tasks[activeTaskIndex] && (
                    <Circle
                      cx="50"
                      cy="50"
                      r="48"
                      stroke={tasks[activeTaskIndex].color}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="314"
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                </Svg>
                <View style={styles.timeContainer}>
                  {tasks[activeTaskIndex] ? (
                    <>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                      >
                        {minutes.slice(0, 1)}
                      </Text>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                      >
                        {minutes.slice(1)}
                      </Text>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                      >
                        :
                      </Text>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                      >
                        {seconds.slice(0, 1)}
                      </Text>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                      >
                        {seconds.slice(1)}
                      </Text>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                      >
                        .
                      </Text>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                      >
                        {milliseconds.slice(0, 1)}
                      </Text>
                      <Text
                        style={[
                          styles.digit,
                          { color: theme["text-basic-color"] },
                        ]}
                        ellipsizeMode="clip"
                        numberOfLines={1}
                      >
                        {milliseconds.slice(1)}
                      </Text>
                    </>
                  ) : (
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={onAddPress}
                        style={{
                          padding: 7,
                          justifyContent: "center",
                          alignItems: "center",
                          margin: 7,
                        }}
                      >
                        <Feather
                          color={theme["text-basic-color"]}
                          size={35}
                          name="plus-square"
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
                            color: theme["text-basic-color"],
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
              {tasks[activeTaskIndex] && (
                <>
                  <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                      <Button
                        color={theme["text-basic-color"]}
                        title={timerState === "running" ? "Lap" : "Reset"}
                        onPress={() => {
                          if (timerState === "running") {
                            handleLap();
                          } else {
                            // taskEventEmitter.emit("taskStateChanged", {
                            //   taskId: tasks[activeTaskIndex]._id,
                            //   state: "stopped",
                            // });
                            emitCurrentState();
                            setTimerState("stopped");
                            handleEndSession();
                          }
                        }}
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
                        onPress={() => {
                          if (timerState === "stopped") {
                            // taskEventEmitter.emit("taskStateChanged", {
                            //   taskId: tasks[activeTaskIndex]._id,
                            //   state: "running",
                            // });
                            emitCurrentState();
                            handleStart();
                            setTimerState("running");
                          } else if (timerState === "running") {
                            // taskEventEmitter.emit("taskStateChanged", {
                            //   taskId: tasks[activeTaskIndex]._id,
                            //   state: "paused",
                            // });
                            emitCurrentState();
                            handlePause();
                            handleStartBreak();
                            setTimerState("paused");
                          } else if (timerState === "paused") {
                            // taskEventEmitter.emit("taskStateChanged", {
                            //   taskId: tasks[activeTaskIndex]?._id,
                            //   state: "running",
                            // });
                            emitCurrentState();
                            handleResume();
                            handleEndBreak();
                            setTimerState("running");
                          }
                        }}
                      />
                    </View>
                  </View>
                </>
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
                      style={{
                        color: theme["text-basic-color"],
                        fontSize: 15,
                        borderBottomWidth: 0,
                        borderColor: theme["text-basic-color"],
                      }}
                      value={lap.name}
                      onChangeText={(text) => {
                        // Update the local laps state
                        const updatedLaps = [...laps];
                        updatedLaps[index].name = text;
                        setLaps(updatedLaps);

                        // Update the sessionData.laps
                        setSessionData((prevData) => {
                          const updatedSessionLaps = [...prevData.laps];
                          updatedSessionLaps[index].name = text;
                          return {
                            ...prevData,
                            laps: updatedSessionLaps,
                          };
                        });
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
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  justifyContent: "space-between",
                  backgroundColor: theme["box-bg"],
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <View
                  style={[
                    styles.modalView2,
                    {
                      backgroundColor: theme["input-bg"],
                      paddingHorizontal: 15,
                      // backgroundColor: Colors.metagray,
                    },
                  ]}
                >
                  <View
                    style={{
                      borderBottomWidth: 0,
                      paddingBottom: 15,
                      borderBottomColor: theme["border-gray"],
                    }}
                  >
                    <Text
                      style={{
                        color: theme["text-basic-color"],
                        fontSize: 22,
                        fontWeight: "600",

                        textAlign: "center",
                      }}
                    >
                      Select task
                    </Text>
                  </View>

                  {tasks &&
                    Array.isArray(tasks) &&
                    tasks.map((task, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => changeTaskAction(index)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            paddingVertical: 15,
                            backgroundColor: theme["box-bg"],
                            marginBottom: 10,
                            paddingHorizontal: 10,
                            borderRadius: 8,
                          }}
                        >
                          <Feather
                            color={task.color ? task.color : theme["ios-blue"]}
                            size={20}
                            name="circle"
                          />
                          <Text
                            style={{
                              color: theme["text-basic-color"],
                              fontSize: 18,
                              fontWeight: "400",
                              // paddingHorizontal: 15,
                              marginLeft: 15,
                            }}
                          >
                            {task.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMoreVisible}
        onRequestClose={() => {
          setIsModalVisible(!isMoreVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setIsMoreVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  justifyContent: "space-between",
                  backgroundColor: theme["card-bg"],
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <View
                  style={[
                    styles.modalView3,
                    {
                      backgroundColor: theme["card-bg"],
                      paddingHorizontal: 15,
                      // backgroundColor: Colors.metagray,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setIsMoreVisible(false);
                      setIsModalVisible(true); // Close the modal
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      paddingVertical: 15,
                      backgroundColor: theme["btn-bg"],
                      marginBottom: 15,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                    }}
                  >
                    <Feather
                      color={theme["text-basic-color"]}
                      size={18}
                      name="refresh-ccw"
                    />
                    <Text
                      style={{
                        color: theme["text-basic-color"],
                        fontSize: 16,
                        fontWeight: "400",
                        // paddingHorizontal: 15,
                        marginLeft: 15,
                      }}
                    >
                      Change task
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleEditPress}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      paddingVertical: 15,
                      backgroundColor: theme["btn-bg"],
                      marginBottom: 15,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                    }}
                  >
                    <Feather
                      color={theme["text-basic-color"]}
                      size={18}
                      name="edit"
                    />
                    <Text
                      style={{
                        color: theme["text-basic-color"],
                        fontSize: 16,
                        fontWeight: "400",
                        // paddingHorizontal: 15,
                        marginLeft: 15,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("del pressed");
                      setIsMoreVisible(false);
                      setIsDeleteVisible(true);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      paddingVertical: 15,
                      backgroundColor: theme["btn-bg"],
                      marginBottom: 15,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                    }}
                  >
                    <Feather color={theme["meta-red"]} size={18} name="trash" />
                    <Text
                      style={{
                        color: theme["meta-red"],
                        fontSize: 16,
                        fontWeight: "400",
                        // paddingHorizontal: 15,
                        marginLeft: 15,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={contextMenuVisible}
        onRequestClose={() => setContextMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setContextMenuVisible(false)}>
          <View style={styles.contextMenuOverlay}>
            <View style={styles.contextMenu}>
              <TouchableOpacity onPress={handleChangeTask}>
                <Text style={styles.contextMenuItem}>Change task</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.contextMenuItem}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.contextMenuItem}>Delete</Text>
              </TouchableOpacity>
              {/* Add more options as needed */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteVisible}
        onRequestClose={() => {
          setIsDeleteVisible(!isDeleteVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setIsDeleteVisible(false)}>
          <View style={styles.deleteOverlay}>
            <View style={styles.centeredViewDel}>
              <View
                style={[
                  styles.modalViewDel,
                  { backgroundColor: theme["btn-bg"] },
                ]}
              >
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: theme["text-basic-color"],
                      textAlign: "center",
                      marginVertical: 15,
                    },
                  ]}
                >
                  Delete task
                </Text>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: theme["text-basic-color"],
                      fontWeight: "400",
                      paddingHorizontal: 30,
                      fontSize: 14,
                      marginBottom: 15,
                    },
                  ]}
                >
                  Are you sure you want to delete this task permanently?
                </Text>

                <TouchableOpacity
                  onPress={handleDeletePress}
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme["btn-bg"],
                      borderColor: theme["border-gray"],
                    },
                  ]}
                >
                  <Text
                    style={[styles.textStyle, { color: theme["meta-red"] }]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme["btn-bg"],
                      borderColor: theme["border-gray"],
                      paddingBottom: 0,
                    },
                  ]}
                  onPress={() => setIsDeleteVisible(false)}
                >
                  <Text
                    style={[
                      styles.textStyle,
                      { color: theme["text-basic-color"], fontWeight: "400" },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Layout>
  );
};

export default HomeScreen;

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
    // justifyContent: "space-between",
    // alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },

  titleContainer: {
    flex: 1,
  },

  middleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },

  circleContainer: {
    width: "80%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    // position: "relative",
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
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end", // Aligns the modal to the bottom
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%", // Full width
    height: Dimensions.get("window").height * 0.4, // 65% height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    width: "100%", // Full width
    height: Dimensions.get("window").height * 0.6, // 65% height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView3: {
    width: "100%", // Full width
    height: Dimensions.get("window").height * 0.35, // 65% height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contextMenuOverlay: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // semi-transparent background
  },
  contextMenu: {
    width: 200,
    top: 80,
    right: -90,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 10,
  },
  contextMenuItem: {
    padding: 10,
    fontSize: 16,
  },

  centeredViewDel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  modalViewDel: {
    width: "80%",

    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 15,
  },
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
    paddingVertical: 15,
    borderTopWidth: 0.5,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  textStyle2: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  deleteOverlay: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // semi-transparent background
  },
});

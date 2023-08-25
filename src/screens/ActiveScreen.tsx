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
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { type StackNavigation } from "../navigation/AppNavigator";
import { useTasks, Task } from "../contexts/TaskContext";
import { useFocusEffect } from "@react-navigation/native";

type Props = {};

const AddScreen: React.FC = () => {
  const theme = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<
    "stopped" | "running" | "paused"
  >("stopped");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  // Add a new state for current task details
  const [loading, setLoading] = useState<boolean>(false);
  const [laps, setLaps] = useState<{ time: number; name: string }[]>([]);
  const { navigate } = useNavigation<StackNavigation>();
  const { tasks, fetchTasks } = useTasks();
  const [goalTime, setGoalTime] = useState<number>(currentTask?.goal ?? 0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Update local state to remove the deleted task
  // setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

  useEffect(() => {
    setGoalTime(currentTask?.goal ?? 0);
  }, [currentTask?.goal]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchTasks();
        if (!currentTask && tasks.length > 0) {
          setCurrentTask(tasks[0]);
        }
      };

      fetchData();
    }, [fetchTasks, currentTask])
  );

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

  const onAddPress = () => {
    navigate("Add");
  };
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const minutes = formatNumber(Math.floor(elapsedTime / 60000));
  const seconds = formatNumber(Math.floor((elapsedTime % 60000) / 1000));
  const milliseconds = formatNumber(Math.floor((elapsedTime % 1000) / 10));
  // Divide by 10 to get 2 digits

  const percentage = Math.min((elapsedTime / goalTime) * 100, 100);
  // const percentage =
  //   goalTime > 0 ? Math.min((elapsedTime / goalTime) * 100, 100) : 0;

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
      {loading ? (
        <ActivityIndicator size="small" color={theme["ios-blue"]} />
      ) : (
        <>
          <View style={styles.titleContainer}>
            {currentTask !== null && (
              <View
                style={{
                  marginBottom: 15,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
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
                    {currentTask?.name}{" "}
                  </Text>
                  <Feather
                    color={theme["text-basic-color"]}
                    size={25}
                    name={isModalVisible ? "chevron-up" : "chevron-down"}
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
                  {currentTask && (
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
                  )}
                </Svg>
                <View style={styles.timeContainer}>
                  {currentTask ? (
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
                          color={theme["text-basic-color-1"]}
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
              {currentTask && (
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
                      backgroundColor: theme["box-bg"],
                      // backgroundColor: Colors.metagray,
                    },
                  ]}
                >
                  <View
                    style={{
                      paddingHorizontal: 20,
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
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            paddingLeft: 20,
                            marginBottom: 10,
                            // borderRadius: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setCurrentTask(task); // Set the clicked task as the current task
                              setIsModalVisible(false); // Close the modal
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              width: "85%",
                              paddingVertical: 10,
                              // backgroundColor: "red",
                            }}
                          >
                            <Feather
                              color={
                                task.color ? task.color : theme["ios-blue"]
                              }
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
                          <TouchableOpacity
                            style={{
                              alignItems: "center",
                              borderRadius: 100,
                              // paddingHorizontal: 5,
                              marginRight: 15,
                              width: "10%",
                              height: 35,
                              // backgroundColor: "green",

                              justifyContent: "center",
                            }}
                          >
                            <Feather
                              color={Colors.metagray}
                              size={20}
                              name="more-horizontal"
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
});

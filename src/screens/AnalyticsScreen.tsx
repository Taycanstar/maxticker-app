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
  FlatList,
} from "react-native";
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import Colors from "../constants/Colors";
import { Layout, useTheme } from "@ui-kitten/components";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Circle, Svg, Line } from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  HomeScreenRouteProp,
  type StackNavigation,
} from "../navigation/AppNavigator";
import { useTasks, Task } from "../contexts/TaskContext";
import { useFocusEffect } from "@react-navigation/native";
import { blackLogo } from "../images/ImageAssets";
import { taskEventEmitter } from "../utils/eventEmitter";
import ModalComponent from "../components/ModalComponent";
import GeneralCard from "../components/GeneralCard";
import user from "../store/user";
// import { useScrollPosition } from "../contexts/ScrollContext";

type DayProps = {
  day: string; // in YYYY-MM-DD format
  isActive: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const WEEK_WIDTH = SCREEN_WIDTH / 3;
const MONTH_WIDTH = SCREEN_WIDTH / 3;
const DAY_WIDTH = SCREEN_WIDTH / 3;

type WeekProps = {
  week: string;
  isActive: boolean;
};

type MonthProps = {
  month: string;
  isActive: boolean;
};

const monthMapping: { [key: string]: number } = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { navigate } = useNavigation<StackNavigation>();
  const [currentItem, setCurrentItem] = useState<string>("General");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const theme = useTheme();
  const [totalTaskTime, setTotalTaskTime] = useState<number>(0);
  const { tasks } = useTasks();

  const onModalPress = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleItemPress = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(!isModalVisible);
    navigate(item);
  };

  const items = [
    { name: "General", isPlus: false, nav: "Analytics" },
    { name: "Daily", isPlus: true, nav: "Daily" },
    { name: "Weekly", isPlus: true, nav: "Weekly" },
    { name: "Monthly", isPlus: true, nav: "Monthly" },
  ];

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: () => (
  //       <>
  //         <Image
  //           source={blackLogo}
  //           style={{ width: 60, height: 60 }}
  //           resizeMode="contain"
  //         />
  //       </>
  //     ),

  //     headerTitleStyle: {
  //       color: theme["text-basic-color"],
  //       fontSize: 20,
  //     },
  //     headerLeft: () => (
  //       <TouchableOpacity
  //         onPress={onModalPress}
  //         style={{
  //           paddingHorizontal: 15,
  //           flexDirection: "row",
  //           backgroundColor: theme["background-basic-color-1"],
  //         }}
  //       >
  //         <Text
  //           style={{
  //             color: theme["text-basic-color"],
  //             fontSize: 22,
  //             fontWeight: "500",
  //             marginRight: 5,
  //           }}
  //         >
  //           {currentItem}
  //         </Text>
  //         <Feather
  //           color={Colors.metagray2}
  //           size={20}
  //           name={isModalVisible ? "chevron-up" : "chevron-down"}
  //         />
  //       </TouchableOpacity>
  //     ),
  //     headerRight: null,
  //   });
  // }, [isModalVisible]);

  const colors = [
    "rgb(55,120,181)",
    "rgb(94,190,255)",
    theme["pale-gray"],
    "rgb(28,54,105)",
    theme["text-basic-color"],
  ];

  useEffect(() => {
    const totalDuration = tasks.reduce((sum, task) => {
      const sessionTotal =
        task.sessions?.reduce(
          (sessionSum, session) => sessionSum + session.totalDuration,
          0
        ) ?? 0; // Use 0 if task.sessions is undefined
      return sum + sessionTotal;
    }, 0);
    setTotalTaskTime(totalDuration);
  }, [tasks]);

  function calculateStreak(tasks: any) {
    // Flatten the array of sessions across all tasks
    const allSessions = tasks
      .flatMap((task: Task) => task.sessions)
      .map((session: any) => new Date(session.createdAt));

    // Sort the sessions by date in ascending order
    allSessions.sort((a: any, b: any) => a - b);

    let streak = 0;
    let currentDate = new Date();

    for (const sessionDate of allSessions) {
      // Check if the session date is the previous day of the current date
      if (
        sessionDate.getDate() === currentDate.getDate() - 1 &&
        sessionDate.getMonth() === currentDate.getMonth() &&
        sessionDate.getFullYear() === currentDate.getFullYear()
      ) {
        streak++;
        currentDate = sessionDate;
      } else {
        break; // Streak is broken
      }
    }

    return streak;
  }

  function calculateAverageSessionDuration(tasks: any) {
    // Flatten the array of sessions across all tasks
    const allSessions = tasks.flatMap((task: Task) => task.sessions);

    if (allSessions.length === 0) {
      return 0; // Return 0 if there are no sessions
    }

    // Calculate the total duration of all sessions
    const totalDuration = allSessions.reduce(
      (sum: any, session: any) => sum + session.totalDuration,
      0
    );

    // Calculate the average session duration in milliseconds
    const averageDuration = totalDuration / allSessions.length;

    return averageDuration;
  }

  function formatDuration(durationInMilliseconds: number) {
    const seconds = Math.floor((durationInMilliseconds / 1000) % 60);
    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));

    const parts = [];

    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0) {
      parts.push(`${seconds}s`);
    }

    return parts.join(" ");
  }

  function calculateTotalSessions(tasks: any) {
    // Flatten the array of sessions across all tasks
    const allSessions = tasks.flatMap((task: Task) => task.sessions);

    // Return the total number of sessions
    return allSessions.length;
  }

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <View style={{ flex: 1, paddingBottom: 75 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingBottom: 75 }}
        >
          {/* {(() => {
            switch (currentItem) {
              case "General": */}

          <View style={{}}>
            <View
              style={{
                marginBottom: 20,
                marginTop: 45,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                  // backgroundColor: "red",
                }}
              >
                <Text
                  style={{
                    marginVertical: 5,
                    color: theme["text-basic-color"],
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {calculateStreak(tasks)}
                </Text>
                <Text
                  style={{
                    color: theme["text-basic-color"],
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Streak
                </Text>
              </View>

              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                }}
              >
                <Text
                  style={{
                    marginVertical: 5,
                    color: theme["text-basic-color"],
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {formatDuration(calculateAverageSessionDuration(tasks))}
                </Text>
                <Text
                  style={{
                    color: theme["text-basic-color"],
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Avg session
                </Text>
              </View>

              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                }}
              >
                <Text
                  style={{
                    marginVertical: 5,
                    color: theme["text-basic-color"],
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {calculateTotalSessions(tasks)}
                </Text>
                <Text
                  style={{
                    color: theme["text-basic-color"],
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Total sessions
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                marginTop: 35,
                paddingHorizontal: 15,
                height: 25,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                }}
              >
                {tasks.map((task, index) => {
                  const last = tasks.length - 1;
                  if (!task) return null;

                  const taskTotalDuration =
                    task.sessions?.reduce(
                      (sum, session) => sum + session.totalDuration,
                      0
                    ) ?? 0;

                  const flexValue = totalTaskTime
                    ? taskTotalDuration / totalTaskTime
                    : 0;

                  return (
                    <View key={index} style={{ flex: flexValue }}>
                      <View
                        style={{
                          height: 25,
                          backgroundColor: colors[index % colors.length],
                          borderTopLeftRadius:
                            index === 0 && last !== 0 ? 7 : 0,
                          borderBottomLeftRadius:
                            index === 0 && last !== 0 ? 7 : 0,
                          borderTopRightRadius:
                            index === last && last !== 0 ? 7 : 0,
                          borderBottomRightRadius:
                            index === last && last !== 0 ? 7 : 0,
                        }}
                      ></View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                // backgroundColor: "red",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 15,
              }}
            >
              {tasks &&
                tasks.map((task, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        marginRight: 15,
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome
                        color={colors[index % colors.length]}
                        size={15}
                        name="square"
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          color: theme["text-basic-color"],
                        }}
                      >
                        {task.name}
                      </Text>
                    </View>
                  );
                })}
            </View>

            <GeneralCard
              tasks={tasks}
              title={"Today"}
              colors={colors}
              type={"today"}
            />

            <GeneralCard
              tasks={tasks}
              title={"This Month"}
              colors={colors}
              type={"month"}
            />
            <GeneralCard
              tasks={tasks}
              title={"This Week"}
              colors={colors}
              type={"week"}
            />
          </View>
        </ScrollView>
      </View>
      <ModalComponent
        visible={isModalVisible}
        height={0.45}
        handlePress={handleItemPress}
        onClose={() => setIsModalVisible(false)}
        items={items}
      />
    </Layout>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sliderContainer: {
    position: "relative",
  },
  scrollView: {
    position: "relative",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  weekContainer: {
    width: WEEK_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    opacity: 0.9,
    marginTop: 10,
  },
  weekText: {
    fontSize: 14,
    color: "grey",
  },
  activeWeek: {
    opacity: 1,
  },
  activeWeekText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  monthContainer: {
    width: MONTH_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    opacity: 0.9,
    marginTop: 10,
  },
  monthText: {
    fontSize: 14,
    color: "grey",
  },
  activeMonth: {
    opacity: 1,
  },
  activeMonthText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  dayContainer: {
    width: DAY_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    opacity: 0.9,
    marginTop: 10,
  },
  dayText: {
    fontSize: 14,
    color: "grey",
  },
  activeDay: {
    opacity: 1,
  },
  activeDayText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});

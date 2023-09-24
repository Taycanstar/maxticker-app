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
import { useNavigation } from "@react-navigation/native";
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

type Props = {};

const SCREEN_WIDTH = Dimensions.get("window").width;
const WEEK_WIDTH = SCREEN_WIDTH / 3;
const PADDING_WIDTH = Dimensions.get("window").width / 2 - WEEK_WIDTH / 2;

type WeekProps = {
  week: string;
  isActive: boolean;
};

const monthMapping: { [key: string]: number } = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { navigate } = useNavigation<StackNavigation>();
  const [currentItem, setCurrentItem] = useState<string>("General");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const theme = useTheme();
  const [totalTaskTime, setTotalTaskTime] = useState<number>(0);
  const { tasks } = useTasks();
  const userSignupDate = useSelector(
    (state: any) => state.user?.userSignupDate
  );
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const handleWeekPress = (index: number) => {
    setSelectedWeekIndex(index);
    // Here, you can add any logic you need when a week is selected
  };

  const Week: React.FC<WeekProps> = ({ week, isActive }) => (
    <View
      style={[
        styles.weekContainer,
        isActive
          ? [
              styles.activeWeek,
              {
                borderBottomColor: theme["text-basic-color"],
                borderBottomWidth: 1,
              },
            ]
          : {},
      ]}
    >
      <Text
        style={[
          styles.weekText,
          isActive
            ? [styles.activeWeekText, { color: theme["text-basic-color"] }]
            : {},
        ]}
      >
        {week}
      </Text>
    </View>
  );
  // 1. Generate Week Ranges:
  const generateWeekRanges = (signupDate: Date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const weekRanges: string[] = [];

    // Adjust the signupDate to the closest previous Sunday
    let startDate = new Date(signupDate);
    while (startDate.getDay() !== 0) {
      // 0 represents Sunday
      startDate.setDate(startDate.getDate() - 1);
    }
    startDate.setHours(0, 0, 0, 0);

    while (startDate <= currentDate) {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const startMonth = monthNames[startDate.getMonth()];
      const endMonth = monthNames[endDate.getMonth()];
      const startDay = startDate.getDate();
      const endDay = endDate.getDate();

      let weekRange =
        startMonth === endMonth
          ? `${startMonth} ${startDay} - ${endDay}`
          : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

      weekRanges.push(weekRange);
      startDate.setDate(startDate.getDate() + 7);
    }

    return weekRanges;
  };

  const getStartAndEndDates = (weekRange: string) => {
    const splitRange = weekRange.split(" - ");

    const startMonthAndDay = splitRange[0].split(" ");
    const endDay = parseInt(splitRange[1], 10);

    const startYear = new Date().getFullYear();
    const startMonth = monthMapping[startMonthAndDay[0]];
    const startDay = parseInt(startMonthAndDay[1], 10);

    let start = new Date(startYear, startMonth, startDay);
    let end = new Date(startYear, startMonth, endDay);

    // Adjusting for year-end crossover
    if (end < start) {
      end.setFullYear(end.getFullYear() + 1);
    }

    return { start, end };
  };

  const weekRanges = generateWeekRanges(userSignupDate);

  const onModalPress = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleItemPress = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(!isModalVisible);
  };

  const items = [
    { name: "General", isPlus: false },
    { name: "Daily", isPlus: true },
    { name: "Weekly", isPlus: true },
    { name: "Monthly", isPlus: true },
  ];

  useLayoutEffect(() => {
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

      headerTitleStyle: {
        color: theme["text-basic-color"],
        fontSize: 20,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={onModalPress}
          style={{
            paddingHorizontal: 15,
            flexDirection: "row",
            backgroundColor: theme["background-basic-color-1"],
          }}
        >
          <Text
            style={{
              color: theme["text-basic-color"],
              fontSize: 22,
              fontWeight: "500",
              marginRight: 5,
            }}
          >
            {currentItem}
          </Text>
          <Feather
            color={Colors.metagray2}
            size={20}
            name={isModalVisible ? "chevron-up" : "chevron-down"}
          />
        </TouchableOpacity>
      ),
      headerRight: null,
    });
  }, [isModalVisible]);

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

  const getWidthPct = (taskTime: number) => {
    if (totalTaskTime === 0) return 0;
    return taskTime / totalTaskTime;
  };

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

  const [currentWeekIndex, setCurrentWeekIndex] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / WEEK_WIDTH);
    setCurrentWeekIndex(currentIndex + 1);
  };

  const weekRangesWithDummy = ["", ...weekRanges, ""];

  const { start, end } = getStartAndEndDates(
    weekRangesWithDummy[currentWeekIndex]
  );

  const weekSessions = tasks.flatMap((task) => {
    return task.sessions
      ? task.sessions.filter((session: any) => {
          const sessionDate = new Date(session.createdAt);
          const startDay = new Date(start);
          const nextDayAfterEnd = new Date(end);

          startDay.setHours(0, 0, 0, 0);
          nextDayAfterEnd.setHours(0, 0, 0, 0);
          nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

          return sessionDate >= startDay && sessionDate < nextDayAfterEnd;
        })
      : [];
  });

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
          {(() => {
            switch (currentItem) {
              case "General":
                return (
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
                          {formatDuration(
                            calculateAverageSessionDuration(tasks)
                          )}
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
                                  backgroundColor:
                                    colors[index % colors.length],
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
                );
              case "Monthly":
                return <Text>Unknown status.</Text>;
              case "Weekly":
                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView
                      horizontal
                      snapToInterval={WEEK_WIDTH}
                      decelerationRate="fast"
                      showsHorizontalScrollIndicator={false}
                      ref={scrollViewRef}
                      onScroll={handleScroll}
                      scrollEventThrottle={16}
                      style={styles.scrollView}
                    >
                      {weekRangesWithDummy.map((week, index) => (
                        <Week
                          key={`${week}-${index}`}
                          week={week}
                          isActive={index === currentWeekIndex}
                        />
                      ))}
                    </ScrollView>
                    <GeneralCard
                      tasks={tasks}
                      title={"Total"}
                      colors={colors}
                      type={"weeklyTotal"}
                      start={start}
                      end={end}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Avg Session"}
                      colors={colors}
                      type={"weeklyAvgSession"}
                      start={start}
                      end={end}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Goal Completion Rate"}
                      colors={colors}
                      type={"GoalCompletionRate"}
                      start={start}
                      end={end}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Avg Breaks / Session"}
                      colors={colors}
                      type={"AvgBreaksPerSession"}
                      start={start}
                      end={end}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Time Spent on Breaks"}
                      colors={colors}
                      type={"TimeSpentOnBreaks"}
                      start={start}
                      end={end}
                    />
                  </View>
                );
              default:
                return <Text>Unknown status.</Text>;
            }
          })()}
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
    fontSize: 15,
    color: "grey",
  },
  activeWeek: {
    opacity: 1,
  },
  activeWeekText: {
    fontWeight: "bold",
  },
});

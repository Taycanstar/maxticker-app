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

type DayProps = {
  day: string; // in YYYY-MM-DD format
  isActive: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const WEEK_WIDTH = SCREEN_WIDTH / 3;

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

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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
  const userSignupDate = useSelector(
    (state: any) => state.user?.userSignupDate
  );
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [dayScrollPosition, setDayScrollPosition] = useState(0);
  const [monthScrollPosition, setMonthScrollPosition] = useState(0);
  const [weekScrollPosition, setWeekScrollPosition] = useState(0);

  const weekScrollViewRef = useRef<ScrollView>(null);
  const monthScrollViewRef = useRef<ScrollView>(null);

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

  const generateWeekRanges = (signupDate: Date) => {
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

  function getWeekStartDate() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // Sunday - Saturday : 0 - 6
    const numDayFromStartOfWeek = now.getUTCDate() - dayOfWeek;
    const startOfWeek = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      numDayFromStartOfWeek
    );
    return startOfWeek.toISOString().split("T")[0];
  }
  const findCurrentWeekIndex = () => {
    const currentWeekStartStr = getWeekStartDate();

    if (Array.isArray(weekRanges)) {
      const index = weekRanges.indexOf(currentWeekStartStr);
      return index === -1 ? weekRanges.length - 1 : index;
    }

    return -1;
  };

  const realLifeCurrentWeekIndex = findCurrentWeekIndex();

  const [currentWeekIndex, setCurrentWeekIndex] = useState(
    realLifeCurrentWeekIndex
  );

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

  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / WEEK_WIDTH);
    setWeekScrollPosition(scrollPosition);
    setCurrentWeekIndex(currentIndex + 1);
  };

  const weekRangesWithDummy = ["", ...weekRanges, ""];

  const { start, end } = getStartAndEndDates(
    weekRangesWithDummy[currentWeekIndex]
  );

  //handle Monthly

  const generateMonthRanges = (signupDate: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const monthRanges: string[] = [];

    // Ensure signupDate is a Date object
    let startDate = new Date(signupDate);
    // Adjust the signupDate to the first of the month
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (startDate <= currentDate) {
      const startMonth = monthNames[startDate.getMonth()];

      let monthRange = `${startMonth} ${startDate.getFullYear()}`;

      monthRanges.push(monthRange);
      startDate.setMonth(startDate.getMonth() + 1);
    }

    return monthRanges;
  };

  const getStartAndEndDatesForMonth = (monthRange: string) => {
    const splitRange = monthRange.split(" ");
    const month = monthMapping[splitRange[0]];
    const year = parseInt(splitRange[1], 10);

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0); // last day of the month

    return { monthStart, monthEnd };
  };

  const monthRanges = generateMonthRanges(userSignupDate);

  const findCurrentMonthIndex = () => {
    const currentMonthStr = new Date().toISOString().slice(0, 7); // gets the 'YYYY-MM' format

    if (Array.isArray(monthRanges)) {
      const index = monthRanges.indexOf(currentMonthStr);
      return index === -1 ? monthRanges.length - 1 : index;
    }

    return -1;
  };
  const realLifeCurrentMonthIndex = findCurrentMonthIndex();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    realLifeCurrentMonthIndex
  );

  const handleMonthScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / WEEK_WIDTH);
    setMonthScrollPosition(scrollPosition);
    setCurrentMonthIndex(currentIndex + 1);
  };

  const monthRangesWithDummy = ["", ...monthRanges, ""];

  const { monthStart, monthEnd } = getStartAndEndDatesForMonth(
    monthRangesWithDummy[currentMonthIndex]
  );

  const Month: React.FC<MonthProps> = ({ month, isActive }) => (
    <View
      style={[
        styles.monthContainer,
        isActive
          ? [
              styles.activeMonth,
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
          styles.monthText,
          isActive
            ? [styles.activeMonthText, { color: theme["text-basic-color"] }]
            : {},
        ]}
      >
        {month}
      </Text>
    </View>
  );

  //Days
  const generateDayRanges = (signupDate: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 1);

    let startDate = new Date(signupDate);
    startDate.setHours(0, 0, 0, 0);

    const dayRanges: string[] = [];

    while (startDate <= currentDate) {
      dayRanges.push(startDate.toISOString().split("T")[0]);
      startDate.setDate(startDate.getDate() + 1);
    }

    return dayRanges;
  };

  const getStartAndEndDatesForDay = (dayRange: string) => {
    const start = new Date(dayRange);
    const end = new Date(dayRange);
    end.setHours(23, 59, 59, 999); // Set to end of the day

    return { start, end };
  };

  const savedDayScrollPosition = useRef<number>(0);

  const dayScrollViewRef = useRef<ScrollView>(null);

  const handleDayScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    setDayScrollPosition(event.nativeEvent.contentOffset.x);
    const currentIndex = Math.round(scrollPosition / WEEK_WIDTH);
    setCurrentDayIndex(currentIndex + 1);
  };

  const dayRanges = generateDayRanges(userSignupDate);

  const dayRangesWithDummy = ["", ...dayRanges, ""];
  const findCurrentDayIndex = () => {
    const currentDateStr = new Date().toISOString().split("T")[0];

    if (Array.isArray(dayRanges)) {
      const index = dayRanges.indexOf(currentDateStr);
      return index === -1 ? dayRanges.length - 1 : index;
    }

    return -1;
  };

  const realLifeCurrentDayIndex = findCurrentDayIndex();
  const [currentDayIndex, setCurrentDayIndex] = useState(
    realLifeCurrentDayIndex
  );

  const { start: dayStart, end: dayEnd } = getStartAndEndDatesForDay(
    dayRangesWithDummy[currentDayIndex]
  );

  const Day: React.FC<DayProps> = ({ day, isActive }) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return ""; // return an empty string if dateString is falsy

      const date = new Date(dateString);

      const dayOfWeek = dayNames[date.getDay()];
      const month = monthNames[date.getMonth()];
      const dayOfMonth = date.getDate();

      return `${dayOfWeek}, ${month} ${dayOfMonth}`;
    };

    const onFocus = () => {
      if (dayScrollViewRef.current) {
        dayScrollViewRef.current.scrollTo({
          x: savedDayScrollPosition.current,
          animated: false,
        });
      }
    };

    // Attach the listener
    const unsubscribeFocus = navigation.addListener("focus", onFocus);

    // And ensure you are cleaning up the listener on unmount. If you already have useEffect setting listeners, just add this one there.
    useEffect(() => {
      return () => {
        unsubscribeFocus();
      };
    }, []);

    return (
      <View
        style={[
          styles.dayContainer,
          isActive
            ? [
                styles.activeDay,
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
            styles.dayText,
            isActive
              ? [styles.activeDayText, { color: theme["text-basic-color"] }]
              : {},
          ]}
        >
          {formatDate(day)}
        </Text>
      </View>
    );
  };
  const scrollToEnd = (event: any) => {
    if (dayScrollPosition === null && dayScrollViewRef.current) {
      const width = event.nativeEvent.layout.width;
      dayScrollViewRef.current.scrollTo({
        x: width * (dayRangesWithDummy.length - 1),
        animated: false,
      });
    }
  };

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (dayScrollViewRef.current && isInitialRender) {
      const position = currentDayIndex * WEEK_WIDTH;
      dayScrollViewRef.current.scrollTo({ x: position, animated: false });
      setIsInitialRender(false); // Set it to false after the first render
    }
  }, [dayScrollViewRef, currentDayIndex, isInitialRender]);

  useEffect(() => {
    if (
      currentItem === "Daily" &&
      dayScrollPosition !== 0 &&
      dayScrollViewRef.current
    ) {
      dayScrollViewRef.current.scrollTo({
        x: dayScrollPosition,
        animated: false,
      });
    }
    if (
      currentItem === "Monthly" &&
      monthScrollPosition !== 0 &&
      monthScrollViewRef.current
    ) {
      monthScrollViewRef.current.scrollTo({
        x: monthScrollPosition,
        animated: false,
      });
    }
  }, [currentItem]);

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
              case "Daily":
                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView
                      horizontal
                      snapToInterval={WEEK_WIDTH}
                      decelerationRate="fast"
                      showsHorizontalScrollIndicator={false}
                      ref={dayScrollViewRef}
                      onScroll={handleDayScroll}
                      scrollEventThrottle={16}
                      style={styles.scrollView}
                      onLayout={scrollToEnd}
                    >
                      {dayRangesWithDummy.map((day, index) => (
                        <Day
                          key={`${day}-${index}`}
                          day={day}
                          isActive={index === currentDayIndex}
                        />
                      ))}
                    </ScrollView>
                    <GeneralCard
                      tasks={tasks}
                      title={"Total"}
                      colors={colors}
                      type={"dailyTotal"}
                      start={dayStart}
                      end={dayEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Avg Session"}
                      colors={colors}
                      type={"dailyAvgSession"}
                      start={dayStart}
                      end={dayEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Goal Completion Rate"}
                      colors={colors}
                      type={"dailyGoalCompletionRate"}
                      start={dayStart}
                      end={dayEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Avg Breaks / Session"}
                      colors={colors}
                      type={"dailyAvgBreaksPerSession"}
                      start={dayStart}
                      end={dayEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Time Spent on Breaks"}
                      colors={colors}
                      type={"dailyTimeSpentOnBreaks"}
                      start={dayStart}
                      end={dayEnd}
                    />
                  </View>
                );
              case "Monthly":
                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView
                      horizontal
                      snapToInterval={WEEK_WIDTH}
                      decelerationRate="fast"
                      showsHorizontalScrollIndicator={false}
                      ref={monthScrollViewRef}
                      onScroll={handleMonthScroll}
                      scrollEventThrottle={16}
                      style={styles.scrollView}
                    >
                      {monthRangesWithDummy.map((month, index) => (
                        <Month
                          key={`${month}-${index}`}
                          month={month}
                          isActive={index === currentMonthIndex}
                        />
                      ))}
                    </ScrollView>
                    <GeneralCard
                      tasks={tasks}
                      title={"Total"}
                      colors={colors}
                      type={"monthlyTotal"}
                      start={monthStart}
                      end={monthEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Avg Session"}
                      colors={colors}
                      type={"monthlyAvgSession"}
                      start={monthStart}
                      end={monthEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Goal Completion Rate"}
                      colors={colors}
                      type={"monthlyGoalCompletionRate"}
                      start={monthStart}
                      end={monthEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Avg Breaks / Session"}
                      colors={colors}
                      type={"monthlyAvgBreaksPerSession"}
                      start={monthStart}
                      end={monthEnd}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Time Spent on Breaks"}
                      colors={colors}
                      type={"monthlyTimeSpentOnBreaks"}
                      start={monthStart}
                      end={monthEnd}
                    />
                  </View>
                );
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
                        // <TouchableOpacity
                        //   key={`${week}-${index}`}
                        //   onPress={() => handleWeekPress(index)}
                        // >
                        <Week
                          key={`${week}-${index}`}
                          week={week}
                          isActive={index === currentWeekIndex}
                        />
                        // </TouchableOpacity>
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
                      type={"weeklyGoalCompletionRate"}
                      start={start}
                      end={end}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Avg Breaks / Session"}
                      colors={colors}
                      type={"weeklyAvgBreaksPerSession"}
                      start={start}
                      end={end}
                    />
                    <GeneralCard
                      tasks={tasks}
                      title={"Time Spent on Breaks"}
                      colors={colors}
                      type={"weeklyTimeSpentOnBreaks"}
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
    width: WEEK_WIDTH,
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
    width: WEEK_WIDTH,
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
